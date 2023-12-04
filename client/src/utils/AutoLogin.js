import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from "react";

function AutoLogin({ children }) {
    const navigate = useNavigate();
    const token = useSelector((store) => store.authReducer.token);
    const [flag, setFlag] = useState(false);
    useEffect(()=>{
        if (token) {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000; // Get current time in seconds
                if (decodedToken.exp < currentTime) {
                    localStorage.clear();
                    navigate("/");
                } else {
                // Token is still valid, do nothing
                }
            if (decodedToken.level !== "user") {
                navigate("/muser");
            } else {
                navigate("/home");
            }
        }
        setFlag(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
        

    return flag ? children : "";
}

export default AutoLogin;