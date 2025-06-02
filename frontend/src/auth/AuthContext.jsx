import {useState, useEffect, createContext} from "react";
import {jwtDecode} from "jwt-decode";
import api from "./api"
import {ACCESS_TOKEN, REFRESH_TOKEN, GOOGLE_ACCESS_TOKEN} from "./token.js";

const AuthContext = createContext({
    isAuthenticated: false,
    loading: true,
    logout: () => {},
});

export const AuthMaster = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = async () => {
            const token = localStorage.getItem(ACCESS_TOKEN);
            const googleAccessToken = localStorage.getItem(GOOGLE_ACCESS_TOKEN);

            console.log(token)
            console.log(googleAccessToken)

            if (token) {
                const decoded = jwtDecode(token);
                const tokenExp = decoded.exp;
                const now = Date.now()/1000;

                if(now > tokenExp) {
                    await refreshToken();
                } else {
                    setIsAuthenticated(true);
                }
            } else if(googleAccessToken) {
                const isValid = await validateGoogleToken(googleAccessToken);
                console.log("google token valid", isValid)
                if(isValid) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(false);
            }
            setLoading(false);
        };

        auth().catch(() => {
            setIsAuthenticated(false);
            setLoading(false);
        });
    },[]);

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try{
            const res = await api.post('/api/token/refresh/', {
                refresh: refreshToken
            });
            if(res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
            }
        } catch(error) {
            console.error("error refreshing token", error);
            setIsAuthenticated(false);
        }
    }

    const validateGoogleToken = async (token) => {
        try{
            const res = await api.post('/api/google/validate_token/', {
                google_access_token: token
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            } );
            return res.data.valid
        } catch(error) {
            console.error("error validateGoogleToken", error);
            return false;
        }
    }

    const logout = () => {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(GOOGLE_ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        setIsAuthenticated(false);
    }

    return(
        <AuthContext.Provider value={{isAuthenticated, loading, logout}}>
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    )
}

export default AuthContext