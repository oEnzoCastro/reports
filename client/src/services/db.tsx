const url = "http://localhost:5000/api";

async function fetchData(endpoint: string) {
  try {
    const response = await fetch(`${url}/${endpoint}`);
    if (!response.ok) {
      throw new Error(`Não foi possível buscar os dados de ${endpoint}`);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// User

export async function createUser(
  name: string,
  email: string,
  password: string
) {
  try {
    const response = await fetch(
      `${url}/user?name=${name}&email=${email}&password=${password}`,
      { method: "POST" }
    );
    if (!response.ok) {
      throw new Error(`Não foi possível buscar os dados de userclient`);
    }
    const data = await response.json();

    console.log(data);

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchUser(email: string) {
  try {
    const response = await fetch(`${url}/user?email=${email}`);
    if (!response.ok) {
      throw new Error(`Não foi possível buscar os dados de userclient`);
    }
    const data = await response.json();

    return data[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function authUser(email: string, password: string) {
  try {
    const response = await fetch(
      `${url}/authuser?email=${email}&password=${password}`
    );
    if (!response.ok) {
      throw new Error(`Não foi possível buscar os dados de authUser`);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function checkEmail(email: string) {
  try {
    const response = await fetch(`${url}/checkemail?email=${email}`);
    if (!response.ok) {
      throw new Error(`Não foi possível buscar os dados de checkEmail`);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchClient(userEmail: string) {
  try {
    const response = await fetch(`${url}/client?useremail=${userEmail}`);
    if (!response.ok) {
      throw new Error(`Não foi possível buscar os dados de userclient`);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function postClient(newClient: any) {

  try {
    const response = await fetch(`http://localhost:5000/api/client`, {
      method: "POST",
      body: JSON.stringify(newClient),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Não foi possível buscar os dados de userclient: ` + response.statusText);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchReminder(userEmail: string) {
  try {
    const response = await fetch(`${url}/reminder?useremail=${userEmail}`);
    if (!response.ok) {
      throw new Error(`Não foi possível buscar os dados de userreminder`);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
