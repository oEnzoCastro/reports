const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check route
app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

/********************************************
 *                    Users                 *
 *******************************************/

// GET
app.get("/user", async (req, res) => {
  const email = req.query.email;

  try {
    let query = supabase.from("users").select("email, name, photo, logo");

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "User authentication is required",
      });
    }
    query = query.eq("email", email);

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({
        error: "Failed to fetch user",
        details: error.message,
      });
    }

    if (data.length === 0) {
      const message = "User not found";
      return res.status(404).json({
        success: false,
        message: message,
      });
    }

    res.json(data[0]);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
});

// POST
app.post("/user", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email, and password are required",
    });
  }

  try {
    const { data, error } = await supabase.from("users").insert([
      {
        name: name,
        email: email,
        password: password,
      },
    ]);

    if (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({
        error: "Failed to create user",
        details: error.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
});

// AUTH
app.get("/auth", async (req, res) => {
  const email = req.query.email;
  const password = req.query.password;

  try {
    const { data, error } = await supabase
      .from("users")
      .select("email, name, photo, logo")
      .eq("email", email)
      .eq("password", password);

    if (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({
        error: "Failed to fetch users",
        details: error.message,
      });
    }

    if (data.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    res.status(200).json({
      success: true,
      user: data[0],
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
});

/**********************************************
 *                    Clients                 *
 *********************************************/

app.get("/clients", async (req, res) => {
  const user = req.query.user;
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User authentication is required",
    });
  }

  try {
    const { data, error } = await supabase
      .from("clients")
      .select(
        "id, name, profession, gender, email, phonenumber, birthdate, maritalstatus, address, addressnumber, addresscomplement, partnername, partneremail, partnerphonenumber, partnergender, partnerprofession, partnerbirthdate"
      )
      .eq("useremail", user);

    if (error) {
      console.error("Error fetching clients:", error);
      return res.status(500).json({
        error: "Failed to fetch clients",
        details: error.message,
      });
    }

    res.json(data);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
});

app.post("/client", async (req, res) => {
  const {
    name,
    profession,
    email,
    phonenumber,
    gender,
    birthdate,
    maritalstatus,
    address,
    addressnumber,
    addresscomplement,
    partnername,
    partneremail,
    partnerphonenumber,
    partnergender,
    partnerprofession,
    partnerbirthdate,
    useremail,
  } = req.body;

  try {
    const { data, error } = await supabase
      .from("clients")
      .insert([
        {
          name,
          profession,
          email,
          phonenumber,
          gender,
          birthdate,
          maritalstatus,
          address,
          addressnumber,
          addresscomplement,
          partnername,
          partneremail,
          partnerphonenumber,
          partnergender,
          partnerprofession,
          partnerbirthdate,
          useremail,
        },
      ])
      .select();

    if (error) {
      console.error("Error creating client:", error);
      return res.status(500).json({
        error: "Failed to create client",
        details: error.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "Client created successfully",
      clientId: data[0]?.id,
    });

    return data[0]?.id;
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
});

// PUT endpoint to update a client
app.put("/client/:id", async (req, res) => {
  const clientId = req.params.id;
  const {
    name,
    profession,
    email,
    phonenumber,
    gender,
    birthdate,
    maritalstatus,
    address,
    addressnumber,
    addresscomplement,
    partnername,
    partneremail,
    partnerphonenumber,
    partnergender,
    partnerprofession,
    partnerbirthdate,
  } = req.body;

  try {
    const { data, error } = await supabase
      .from("clients")
      .update({
        name,
        profession,
        email,
        phonenumber,
        gender,
        birthdate,
        maritalstatus,
        address,
        addressnumber,
        addresscomplement,
        partnername,
        partneremail,
        partnerphonenumber,
        partnergender,
        partnerprofession,
        partnerbirthdate,
      })
      .eq("id", clientId)
      .select();

    if (error) {
      console.error("Error updating client:", error);
      return res.status(500).json({
        error: "Failed to update client",
        details: error.message,
      });
    }

    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.json({
      success: true,
      message: "Client updated successfully",
      client: data[0],
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
});

// DELETE endpoint to delete a client
app.delete("/client/:id", async (req, res) => {
  const clientId = req.params.id;

  try {
    // First, delete all dependents of this client
    const { error: dependentsError } = await supabase
      .from("dependents")
      .delete()
      .eq("clientid", clientId);

    if (dependentsError) {
      console.error("Error deleting client's dependents:", dependentsError);
      return res.status(500).json({
        error: "Failed to delete client's dependents",
        details: dependentsError.message,
      });
    }

    // Then delete the client
    const { data, error } = await supabase
      .from("clients")
      .delete()
      .eq("id", clientId)
      .select();

    if (error) {
      console.error("Error deleting client:", error);
      return res.status(500).json({
        error: "Failed to delete client",
        details: error.message,
      });
    }

    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.json({
      success: true,
      message: "Client and associated dependents deleted successfully",
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
});

/**********************************************
 *                 Dependents                 *
 *********************************************/

app.get("/dependents", async (req, res) => {
  const clientid = req.query.clientid;
  if (!clientid) {
    return res.status(400).json({
      success: false,
      message: "Client ID is required",
    });
  }

  try {
    const { data, error } = await supabase
      .from("dependents")
      .select("*")
      .eq("clientid", clientid);

    if (error) {
      console.error("Error fetching dependents:", error);
      return res.status(500).json({
        error: "Failed to fetch dependents",
        details: error.message,
      });
    }

    res.json(data);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
});

app.post("/dependent", async (req, res) => {
  const { clientid, name, email, gender, birthdate, phonenumber, type } =
    req.body;

  try {
    const { data, error } = await supabase.from("dependents").insert([
      {
        clientid,
        name,
        email,
        gender,
        birthdate,
        phonenumber,
        type,
      },
    ]);

    if (error) {
      console.error("Error creating dependent:", error);
      return res.status(500).json({
        error: "Failed to create dependent",
        details: error.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "Dependent created successfully",
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
});

// PUT endpoint to update a dependent
app.put("/dependent/:id", async (req, res) => {
  const dependentId = req.params.id;
  const { name, email, gender, birthdate, phonenumber, type } = req.body;

  try {
    const { data, error } = await supabase
      .from("dependents")
      .update({
        name,
        email,
        gender,
        birthdate,
        phonenumber,
        type,
      })
      .eq("id", dependentId)
      .select();

    if (error) {
      console.error("Error updating dependent:", error);
      return res.status(500).json({
        error: "Failed to update dependent",
        details: error.message,
      });
    }

    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Dependent not found",
      });
    }

    res.json({
      success: true,
      message: "Dependent updated successfully",
      dependent: data[0],
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
});

// DELETE endpoint to delete a dependent
app.delete("/dependent/:id", async (req, res) => {
  const dependentId = req.params.id;

  try {
    const { data, error } = await supabase
      .from("dependents")
      .delete()
      .eq("id", dependentId)
      .select();

    if (error) {
      console.error("Error deleting dependent:", error);
      return res.status(500).json({
        error: "Failed to delete dependent",
        details: error.message,
      });
    }

    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Dependent not found",
      });
    }

    res.json({
      success: true,
      message: "Dependent deleted successfully",
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
});

/**********************************************
 *                    End                     *
 *********************************************/

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
