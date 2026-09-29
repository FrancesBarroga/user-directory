import axios from "axios";

export async function fetchUsers() {
  try {
    return await axios.get(`https://jsonplaceholder.typicode.com/users`);
  } catch (error) {
    if (error.response) {
      throw error.response;
    }
    throw error;
  }
}
