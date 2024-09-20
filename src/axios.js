import axios from "axios";

const instance = axios.create({ baseURL: "https://sajyatra.sajpe.in/admin/api" });
instance.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';

instance.interceptors.request.use(
    (config) => {
        // Define your default body here
        const defaultBody = {}
        // Merge default body with request data if it's a POST, PUT, PATCH, or DELETE request
        if (["post", "put", "patch", "delete"].includes(config.method)) {
            if (config.data instanceof FormData) {
                for (const key in defaultBody) {
                    config.data.append(key, defaultBody[key]);
                }
            } else {
                config.data = {
                    ...defaultBody,
                    ...config.data
                };
            }
        }

        return config;
    },
    (error) => {
        // Do something with request error
        return Promise.reject(error);
    }
);

export default instance;
