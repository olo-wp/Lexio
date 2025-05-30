import api from "../auth/api.js";
import {useState, useEffect} from "react";
import "./ProfBar.css";


function ProfBar() {
    const [login, setLogin] = useState("");

    useEffect(() => {
        async function getProfBar() {
            try{
                const res = await api.get("/api/auth/user/")
                if(res) {
                    if (res.status === 200) {
                        setLogin(res.data.username);
                        console.log("succesfully obtained:", res.data.username);
                    }
                } else {
                    console.error(res.data.message);
                }
            }catch(e){
                console.error(e);
            }
        }
        getProfBar();
    },[])




    return (
        <div className="profbar">
            <p>Hello {login ? login : "guest"}!</p>
        </div>
    )
}

export default ProfBar;