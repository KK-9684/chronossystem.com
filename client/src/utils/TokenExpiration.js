import { jwtDecode } from 'jwt-decode';
import accessLocal from "./accessLocal";

export const TokenExpiration = () => {

    const token = accessLocal.loadData('token'); // Replace 'jwtToken' with your token key
    if (token) {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Get current time in seconds
        if (decodedToken.exp < currentTime) {
            localStorage.clear();
            window.location.href = "/";
        } else {
        // Token is still valid, do nothing
        }
    }
};