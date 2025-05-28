import axios from 'axios'

import {ACCESS_TOKEN, GOOGLE_ACCESS_TOKEN} from "./token.js";

const api_url = 'http://localhost:8080';

const api = axios.create({
    baseURL: api_url,
})

api.interceptors.request.use(
    (config) => {
            const token = localStorage.getItem(ACCESS_TOKEN);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            const googleAccessToken = localStorage.getItem("GOOGLE_ACCESS_TOKEN");
            if (googleAccessToken) {
                config.headers["X-Google-Access-Token"] = googleAccessToken;
            }
            return config;
        },

    (error) => {
        return Promise.reject(error);
    }
)
export default api;