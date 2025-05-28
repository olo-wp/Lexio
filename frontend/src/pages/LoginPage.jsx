import {Link} from "react-router-dom";
import "../assets/LogReg.css";

function LoginPage(){
    return (
        <>
            <div className="container">
                <div className={"LoginBox"}>
                    <ul>
                        <li><label htmlFor={"login"}>Login</label></li>
                        <li><input type={"text"} id="login"></input></li>
                        <li><label htmlFor={"password"}>Password</label></li>
                        <li><input type={"password"} id="password"></input></li>
                        <li><input type={"submit"} value={"Login"}></input></li>
                        <li><Link to={"/register"}>Don't have an account yet? Register Now!</Link></li>
                    </ul>
                </div>
                <div className="LoginGoogle">
                    <Link to={"/google"}>
                        <img
                            src="https://developers.google.com/identity/images/btn_google_signin_light_normal_web.png"
                            alt="Login with Google"
                        />
                    </Link>
                </div>
            </div>
        </>
    )
}

export default LoginPage;