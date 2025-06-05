import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {ACCESS_TOKEN, REFRESH_TOKEN} from "../auth/token.js";

const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        console.log("accessToken", accessToken);
        console.log("refreshToken", refreshToken);

        if (accessToken && refreshToken) {
            localStorage.setItem(ACCESS_TOKEN, accessToken);
            localStorage.setItem(REFRESH_TOKEN, refreshToken);
            navigate('/home');
        } else {
            navigate('/login');
        }
    }, [navigate]);

    return <div>Logowanie...</div>;
};

export default AuthCallback;