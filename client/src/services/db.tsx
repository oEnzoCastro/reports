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

export async function fetchUserClient(userEmail: string) {
  try {
    const response = await fetch(`${url}/userclient?useremail=${userEmail}`);
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
