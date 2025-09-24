import "../css/Authentication.css";

import {type JSX, useState} from "react";
import {getEncryptedForUserIfExists} from "../scripts/utils/idb.ts";
import {handleLoad} from "../scripts/TodoManager.ts";
import {useTodoStore, useUserStore} from "../scripts/TodoStore.ts";

export default function Authentication(): JSX.Element {
    const [showLogin, setShowLogin] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [loginUsername, setLoginUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const {setTree} = useTodoStore();
    const {setUsername, setPassphrase} = useUserStore();

    async function usernameExists(): Promise<boolean> {
        const result = await getEncryptedForUserIfExists(loginUsername);
        return result != null;
    }

    async function handleCheckUsername(): Promise<void> {
        if(await usernameExists()){
            setShowLogin(true);
            setMessage(`User with name ${loginUsername} was found. Please enter the password below and login.`);
        }else{
            setShowLogin(false);
            setMessage("Username was not found. Click on Register to make a new Account or input an existing username.");
        }
    }

    async function handleLogin(){
        if(!loginUsername || !password){
            setMessage("Invalide Credentials were provided.");
        }else{
            try{
                await handleLoad(loginUsername, password, setTree);
                setPassphrase(password);
                setMessage("Login successful.");
                setUsername(loginUsername)
                document.location.href = "/";
            }catch(e){
                setMessage((e as Error).message);
            }
        }
    }

    async function handleRegister(){
        if(await usernameExists()){
            setMessage("A user with this name already exists. Please choose another one.")
        }else{
            setTree([]);
            setUsername(loginUsername)
            setMessage("Registration successful.");
            document.location.href = "/";
        }
    }

    return(
        <div className="auth-container">
            <div className="auth-container-center">
                <div className="auth-inputs">
                    <div className="auth-inputs-line-1">
                        <input
                            onChange={e => setLoginUsername(e.target.value)}
                            value={loginUsername}
                            type="text"
                            placeholder="Username"
                        />
                        <button
                            className="auth-button"
                            onClick={handleCheckUsername}
                        >Check</button>
                    </div>
                    <div className="auth-inputs-line-2">
                        <input
                            onChange={e => setPassword(e.target.value)}
                            value={password}
                            type="password"
                            placeholder="Password"
                            style={{visibility: showLogin ? "visible" : "hidden"}}
                        />
                    </div>
                    <div className="auth-buttons">
                        <button
                            className="auth-button"
                            onClick={handleLogin}
                            disabled={!showLogin || password == ""}
                        >Login</button>

                        <button
                            className="auth-button"
                            onClick={handleRegister}
                            disabled={loginUsername == "" || showLogin}
                        >Register</button>
                    </div>
                </div>
                <p className="auth-message">{message}</p>
            </div>
        </div>
    );
}