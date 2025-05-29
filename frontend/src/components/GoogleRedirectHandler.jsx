import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {GOOGLE_ACCESS_TOKEN} from "../auth/token.js"

function GoogleRedirect() {
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Redirecter working");

        const queryParams = new URLSearchParams(window.location.search);
        const accessToken = queryParams.get("access_token");
        console.log("query params:" , queryParams);

        if(accessToken) {
            console.log(accessToken);
            localStorage.setItem(GOOGLE_ACCESS_TOKEN, accessToken);

            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            axios.get('http://localhost:8080/api/auth/user/').then(
                response => {
                    console.log("user data: ", response.data);
                    navigate('/');
                }).catch(error => {
                    console.log(error);
                    navigate('/login');
                });
        } else {
            console.log("no access token");
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div>Logging in.....</div>
    )
}

export default GoogleRedirect;