import { useState, useEffect } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../api/userService";
import { mapApiUser, generateId } from "../utils/helpers";

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getUsers()
      .then((res) => {
        setUsers(res.data.map((u, i) => mapApiUser(u, i)));
        setError(null);
      })
      .catch(() =>
        setError(
          "Failed to load users. Please check your connection and try again.",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  const addUser = async (userData) => {
    const res = await createUser(userData);
    const newUser = { ...userData, id: res.data.id || generateId(users) };
    setUsers((prev) => [newUser, ...prev]);
    return newUser;
  };

  const editUser = async (id, userData) => {
    await updateUser(id, userData);
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...userData, id } : u)),
    );
  };

  const removeUser = async (id) => {
    await deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return { users, loading, error, addUser, editUser, removeUser };
};
