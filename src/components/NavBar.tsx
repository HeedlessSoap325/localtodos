import "../css/NavBar.css";

import type {JSX} from "react";
import {useUserStore} from "../scripts/TodoStore.ts";

interface NavBarProps {
    handleSave: () => void;
    handleSaveAndQuit: () => void;
}

export default function NavBar(props: NavBarProps): JSX.Element {
    const {username} = useUserStore();

    return (
        <div className="nav-bar-container">
            <div className="nav-bar-left">
                { !window.location.href.endsWith("/") ?
                    <button
                        className="nav-bar-button"
                        onClick={() => window.location.href = "/"}
                    >Back</button>
                    :
                    <></>
                }
                <button
                    className="nav-bar-button"
                    onClick={props.handleSave}
                >Save</button>
                <button
                    className="nav-bar-button"
                    onClick={props.handleSaveAndQuit}
                >Save And Quit</button>
            </div>

            <div className="nav-bar-right">
                <h1>{username}</h1>
            </div>
        </div>
    )
}