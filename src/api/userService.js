import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/users`;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export const getUsers = () => axiosInstance.get("/users");
export const createUser = (user) => axiosInstance.post("/users", user);
export const updateUser = (id, user) => axiosInstance.put(`/users/${id}`, user);
export const deleteUser = (id) => axiosInstance.delete(`/users/${id}`);

export { API_URL };
