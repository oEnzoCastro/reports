const express = require("express");
const cors = require("cors")
const app = express();

app.use(cors({origin: '*'}))

const knex = require("knex")({
  client: "pg",
  connection: {
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "SenhaPostgres",
    database: "adriana",
  },
});

app.get("/api", async (req, res) => {
  res.json();
});

// Routes



// User

app.get("/api/user", async (req, res) => {
  const users = await knex.select("*").from("User");

  res.json(users);
});

app.get("/api/userclient", async (req, res) => {

  const user = req.query.useremail;
  
  const users = await knex
    .select("*")
    .from("User")
    .join("Client", "User.email", "Client.useremail")
    .where("useremail", user)

  res.json(users);
});

app.post("/api/user", (req, res) => {
  const user = {
    email: "Enzo@gmail.com",
    name: "Enzo",
    password: "1234567",
  };

  knex("User")
    .insert(user)
    .then(() => {
      res.status(201).json({ message: "User created successfully!" }); // Send a success response
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to create user." }); // Handle errors
    });
});

// Client
app.get("/api/client", async (req, res) => {
  const users = await knex.select("*").from("Client");

  res.json(users);
});

app.post("/api/client", (req, res) => {
  const client = {
    cpfcnpj: "125125125",
    name: "Duda",
    address: "Av Professor, 456",
    dateofbirth: "2004-05-02",
    sex: "F",
    wallet: 1235136.3561,
    maritalstatus: "Namorando",
    spousename: "Enzo",
    spousedateofbirth: "2004-05-13",
    spousetype: "Ainda Nada",
    useremail: "enzocastru@gmail.com",
  };

  knex("Client")
    .insert(client)
    .then(() => {
      res.status(201).json({ message: "Client created successfully!" }); // Send a success response
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to create client." }); // Handle errors
    });
});

// Report

app.get("/api/reportnote", async (req, res) => {
  const users = await knex
    .select("*")
    .from("Report")
    .join("Note", "Report.id", "Note.reportid");

  res.json(users);
});

app.get("/api/reporttobeachieved", async (req, res) => {
  const users = await knex
    .select("*")
    .from("Report")
    .join("ToBeAchieved", "Report.id", "ToBeAchieved.reportid");

  res.json(users);
});

app.get("/api/reportalreadyachieved", async (req, res) => {
  const users = await knex
    .select("*")
    .from("Report")
    .join("AlreadyAchieved", "Report.id", "AlreadyAchieved.reportid");

  res.json(users);
});

app.get("/api/report", async (req, res) => {
  const report = req.query.report;

  const users = await knex.select("*").from("Report").where("id", report);

  res.json(users);
});

app.post("/api/report", async (req, res) => {
  const report = {
    title: "Teste",
    summary:
      "IASHFIOHWAOUFIDHNAWOHSIUOHIOFHAWIOFJOWANFIOWAHNF AWIOFJHwifhawoifioawhnfo Wfoiwhna",
    date: "2025-07-24",
    clientcpfcnpj: "125125125",
  };

  knex("Report")
    .insert(report)
    .then(() => {
      res.status(201).json({ message: "Report created successfully!" }); // Send a success response
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to create report." }); // Handle errors
    });
});

// Note
app.get("/api/note", async (req, res) => {
  const users = await knex.select("*").from("Note");

  res.json(users);
});

app.post("/api/note", async (req, res) => {
  const note = {
    note: "AUWGHFUIWAHFUIGWAUIFGWAUIGFUIWAGFUIGWAUIFGWUAIGH FUWGAIU!!!",
    reportid: 1,
  };

  knex("Note")
    .insert(note)
    .then(() => {
      res.status(201).json({ message: "Note created successfully!" }); // Send a success response
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to create note." }); // Handle errors
    });
});

// To Be Achieved
app.get("/api/tobeachieved", async (req, res) => {
  const users = await knex.select("*").from("ToBeAchieved");

  res.json(users);
});

app.post("/api/tobeachieved", async (req, res) => {
  const tobeachieved = {
    title: "Teste21412",
    description:
      "IASHFIOHWAOUFIDHNAWOHSIUOHIOFHAWIOFJOWANFIOWAHNF AWIOFJHwifhawoifioawhnfo Wfoiwhna",
    date: "2025-07-24",
    reportid: 1,
  };

  knex("ToBeAchieved")
    .insert(tobeachieved)
    .then(() => {
      res.status(201).json({ message: "To Be Achieved created successfully!" }); // Send a success response
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to create To Be Achieved." }); // Handle errors
    });
});

// Already Achieved
app.get("/api/alreadyachieved", async (req, res) => {
  const users = await knex.select("*").from("AlreadyAchieved");

  res.json(users);
});

app.post("/api/alreadyachieved", async (req, res) => {
  const alreadyachieved = {
    title: "Teste21412",
    description:
      "IASHFIOHWAOUFIDHNAWOHSIUOHIOFHAWIOFJOWANFIOWAHNF AWIOFJHwifhawoifioawhnfo Wfoiwhna",
    date: "2025-07-24",
    reportid: 1,
  };

  knex("AlreadyAchieved")
    .insert(alreadyachieved)
    .then(() => {
      res
        .status(201)
        .json({ message: "Already Achieved created successfully!" }); // Send a success response
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to create Already Achieved." }); // Handle errors
    });
});

// -----

app.listen(5000, () => {
  console.log("Server started at port 5000");
});
