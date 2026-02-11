const LOCAL_API = "http://localhost:3000";
const PROD_API = "https://crud-backend-ff0r.onrender.com";

export const API_URL =
  import.meta.env.MODE === "development"
    ? LOCAL_API
    : PROD_API;
