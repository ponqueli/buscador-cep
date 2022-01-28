import axios from "axios";

const api = axios.create({
    baseURL: `https:/ws.apicep.com/cep/`
});

export default api;