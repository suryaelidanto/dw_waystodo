import axios from "axios";

export const API = axios.create({
  baseURL: `https://api.kontenbase.com/query/api/v1/5f2c4c1e-3892-4723-8121-a7194b324f1a/`,
});

export function setAuthorization(token) {
  if (!token) {
    delete API.defaults.headers.common;
    return;
  }
  API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
