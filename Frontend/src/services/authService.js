import api from "./api";

export const registerUsuario = (data) => {
  return api.post("/usuarios/register", data);
};

export const loginUsuario = (data) => {
  return api.post("/usuarios/login", data);
};
