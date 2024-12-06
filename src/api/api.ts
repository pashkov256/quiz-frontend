import axios from "axios";

const istance = axios.create({
    baseURL: "https://quiz-backend-5lbl.onrender.com",
});

istance.interceptors.request.use((config) => {
    config.headers.Authorization = window.localStorage.getItem("token");
    return config;
});

export default istance;
