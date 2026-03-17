import axios from "axios";
import { BASE_URL } from "../services/config";
import { setupInterceptors } from "./interceptor"; // Import the setup function

const api = axios.create({
  baseURL: BASE_URL,
});

// The magic touch! We attach the interceptors right here, right now.
setupInterceptors(api);

export default api;