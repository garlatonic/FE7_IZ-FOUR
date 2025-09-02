const API_URL = "https://kdt-api.fe.dev-cos.com/documents";
const X_USERNAME = "FE7_team7";

export async function request(method, id, body) {
  try {
    const url = API_URL + (id ? `/${id}` : "");
    const options = {
      method,
      headers: { "x-username": X_USERNAME },
    };

    if (body !== undefined) {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error("error");
    }

    return await response.json();
  } catch (e) {
    console.error(e);
  }
}

export async function getAllDocuments() {
  return request("GET");
}

export async function viewDocument(id) {
  return request("GET", id);
}

export async function postDocument(_, body) {
  return request("POST", undefined, body);
}

export async function editDocument(id, body) {
  return request("PUT", id, body);
}

export async function deleteDocument(id) {
  return request("DELETE", id);
}
