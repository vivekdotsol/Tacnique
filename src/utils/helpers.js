import { DEPARTMENTS } from "./constants";

export const mapApiUser = (user, index) => {
  const nameParts = user.name.split(" ");
  return {
    id: user.id,
    firstName: nameParts[0] || "",
    lastName: nameParts.slice(1).join(" ") || "",
    email: user.email,
    department: DEPARTMENTS[index % DEPARTMENTS.length],
  };
};

export const generateId = (users) => {
  return users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
};
