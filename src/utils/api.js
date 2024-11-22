import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:5000/api/',
    withCredentials: true
})

// Axios API interceptor to return a rejected promise with a 401 status code **/

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response ? error.response.status : null;
        if (status === 401) {
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);

export default api;