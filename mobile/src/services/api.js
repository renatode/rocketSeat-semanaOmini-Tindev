import axios from 'axios';

const api = axios.create({
    // No Emulador usar a seguinte linha de comando para simular o localhost
    // adb reverse tcp:3333 tcp:3333
    baseURL: 'http://10.0.26.161:3333'
});

export default api;