import AuthContext from "./AuthContext";
import {useContext} from "react";

export const useAuthentication = () => useContext(AuthContext);
