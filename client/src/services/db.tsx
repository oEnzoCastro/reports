const url = "http://localhost:3001";

export async function getUser(email: string) {
  try {
    if (!email) {
      return null;
    }

    // Check if the parameter looks like an email or an ID
    const queryParam = `email=${email}`;

    const response = await fetch(`${url}/user?${queryParam}`);

    if (!response.ok) {
      return false;
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error in getUser:", error);
    return null;
  }
}

export async function postUser(name: string, email: string, password: string) {
  try {
    const response = await fetch(`${url}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    });

    if (!response.ok) {
      return null;
    } else {
      return response.statusText;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function authUser(email: string, password: string) {
  try {
    const response = await fetch(
      `${url}/auth?email=${email}&password=${password}`
    );
    if (!response.ok) {
      return false;
    }

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


// Clients

export async function getClients(user: string) {

  try {
    const response = await fetch(`${url}/clients?user=${user}`);
    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getClients:", error);
    return [];
  }
}
