import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

function Certification({ children }) {
    const navigate = useNavigate();
    const token = useSelector((store) => store.authReducer.token);

    useEffect(() => {
        if (!token) {
            navigate("/");
        } else {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000; // Get current time in seconds
            if (decodedToken.exp < currentTime) {
                localStorage.clear();
                navigate("/");
            } else {
            // Token is still valid, do nothing
            }
            if (decodedToken.level === "user") {
                if (children.type.name === "Manage") {
                    navigate("/");
                }
            } else if (decodedToken.level === "manager" || decodedToken.level === "master") {
                if (children.type.name === "Home") {
                    navigate("/");
                }
            }
        }
    }, [navigate, token, children]);

    if (token) {
        return children;
    } else {
        return null; // or any fallback UI if desired
    }
}

export default Certification;