import "../css/MainContainer.css";

import * as React from "react";
import {useState} from "react";

import NavBar from "./NavBar.tsx";
import {type Modal, modals} from "../scripts/utils/types.ts";
import SaveWithPassword from "./SaveWithPassword.tsx";
import {useTodoStore, useUserStore} from "../scripts/TodoStore.ts";
import {handleSave} from "../scripts/TodoManager.ts";

export default function MainContainer({ children }: { children: React.ReactNode }) {
    const [editingMode, setEditingMode] = useState<Modal>(modals.HIDDEN);

    const {username, passphrase, clearUser, setPassphrase} = useUserStore();
    const {tree, clearTree} = useTodoStore();

    async function handleSaveTree(){
        if(!tree) return;

        if(passphrase){
            await handleSave(username, tree, passphrase);
            setEditingMode(modals.HIDDEN);
        }else{
            setEditingMode(modals.PASSWORD_AND_SAVE);
        }
    }

    async function handleSaveAndQuit(){
        if(!tree) return;

        if(passphrase){
            await handleSave(username, tree, passphrase);
            setEditingMode(modals.HIDDEN);
            clearTree();
            clearUser();
        }else{
            setEditingMode(modals.PASSWORD_AND_QUIT);
        }
    }

    return (
        <div className="main-container">
            <NavBar
                handleSave={handleSaveTree}
                handleSaveAndQuit={handleSaveAndQuit}
            />

            <div
                className="main-container-content"
                style={{display: editingMode === modals.HIDDEN ? "flex" : "none"}}
            >
                <div className="main-container-space-left" />
                {children}
            </div>

            <div
                className="main-container-content"
                style={{display: editingMode === modals.PASSWORD_AND_QUIT || editingMode === modals.PASSWORD_AND_SAVE ? "flex" : "none"}}
            >
                <SaveWithPassword
                    setPassword={setPassphrase}
                    hideEditor={() => setEditingMode(modals.HIDDEN)}
                    handleSave={() => {
                        if(editingMode === modals.PASSWORD_AND_SAVE) {
                            handleSaveTree().catch(console.error);
                        }else if(editingMode === modals.PASSWORD_AND_QUIT) {
                            handleSaveAndQuit().catch(console.error);
                        }else {
                            return;
                        }
                    }}
                />
            </div>
        </div>
    );
}