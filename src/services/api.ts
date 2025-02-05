import axios from "axios";

const apiDjango = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_DJANGO,
});

const apiNest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_NEST,
});

export { apiDjango, apiNest };
