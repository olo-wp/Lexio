import React from 'react'
import {Navigate} from "react-router-dom";
import {useAuthentication} from "../auth/Auth.js";

function ProtectedRoute({children}) {
    const isAuthenticated = useAuthentication();

    if(isAuthenticated === null){
        return <div>Loading......</div>
    }
    if(isAuthenticated && (window.location.pathname == "/login" || window.location.pathname == "/register")){
        return <Navigate to={"/"}/>
    }

    return children;
}

export default ProtectedRoute;