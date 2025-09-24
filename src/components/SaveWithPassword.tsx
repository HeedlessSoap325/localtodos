import "../css/SaveWithPassword.css";

import type {JSX} from "react";

interface EditTitleProps {
    setPassword: (password: string) => void;
    hideEditor: () => void;
    handleSave: () => void;
}
export default function SaveWithPassword(props: EditTitleProps): JSX.Element {
    return(
        <div className="password-save-container">
            <div className="password-save-center">
                <div className="password-save-title">
                    <input
                        onChange={(e) => props.setPassword(e.target.value)}
                        type="password"
                        placeholder="Password"
                    />
                </div>
                <div className="password-save-buttons">
                    <button
                        className="password-save-button"
                        onClick={() => props.hideEditor()}
                    >Cancel</button>
                    <button
                        className="password-save-button"
                        onClick={() => props.handleSave()}
                    >Save</button>
                </div>
            </div>
        </div>
    );
}