import api from '../auth/api'
import {useState} from "react";
import '../components/AuthForm.css'
import {useNavigate} from "react-router-dom";

const SettingsPage = () => {
    const [newUsername, setNewUsername] = useState("");
    const navigate = useNavigate();

    const changeLogin = async (e) => {
        e.preventDefault()
        let id
        try{
            const res = await api.get(`/api/auth/user/`, {});
            console.log("this is the first response:", res)
            if(res.status === 200){
                console.log(res.data)
                id = res.data.id;
            } else {
                console.error("Error getting user id: ", res.status);
            }
        } catch (err) {
            console.error("Error getting user id: ", err);
        }
        console.log("id is:", id)
        try{
            const res = await api.patch('/api/auth/user/' + id + '/', {
                "username": newUsername,
            });
            if(res.status === 200){
                console.log("succesfully updated username: ");
                navigate(0);
            } else {
                console.error(res.data.message);
            }
        }catch(err){
            console.error("Error updating user: ", err);
        }
    }


    return(
        <>
            <form onSubmit={changeLogin} className="form">
                <div className="form-group">
                    <label htmlFor="newUsername">New Username</label>
                    <input
                        onChange={(e) => setNewUsername(e.target.value)}
                        type="text"
                        id="newUsername"
                        placeholder="Enter Your Username"
                        required
                    />
                    <button type="submit" onClick={changeLogin}>Change</button>
                </div>
            </form>
        </>
)
}


export default SettingsPage;
