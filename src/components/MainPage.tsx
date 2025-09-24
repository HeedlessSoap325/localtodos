import "../css/MainPage.css";

import * as React from "react";
import {type JSX, useState} from "react";

import {useTodoStore} from "../scripts/TodoStore.ts";
import {type Modal, modals, ProjectUnit, type TodoSuper} from "../scripts/utils/types.ts";
import EditTitle from "./EditTitle.tsx";

import MainContainer from "./MainContainer.tsx";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {addProject, deleteProject, editProject} from "../scripts/TreeHelper.ts";

export default function MainPage(): JSX.Element {
    const [editingMode, setEditingMode] = useState<Modal>(modals.HIDDEN);
    const [editor, setEditor] = useState({
        title: "",
        editing: false,
        targetId: -1
    })

    const {tree, appendToTree, deleteFromTree, updateInTree} = useTodoStore();

    function resetEditor(){
        setEditingMode(modals.HIDDEN)
        setEditor({
            ...editor,
            title: "",
            editing: false,
            targetId: -1
        });
    }

    function handleAddProject() {
        addProject(editor.title, appendToTree);
        resetEditor();
    }

    function handleDeleteProject(targetId: number) {
        deleteProject(targetId, tree ?? [], deleteFromTree);
    }

    function setupEditProject(targetId: number) {
        const projects: TodoSuper[] = (tree ?? []).filter((item) => item.id === targetId);
        let project: ProjectUnit;
        if(projects.length !== 1 && projects[0].type !== ProjectUnit.name){
            return;
        }else{
            project = (projects[0] as ProjectUnit);
        }

        setEditor({
            ...editor,
            title: project.title,
            editing: true,
            targetId: project.id,
        })
        setEditingMode(modals.EDITOR_PROJECT)
    }

    function handleEditProject() {
        if (!editor.editing || editor.targetId === -1) return;
        editProject(editor.targetId, editor.title, tree ?? [], updateInTree);
        resetEditor();
    }

    function handleProjectEntryClicked(e: React.MouseEvent<HTMLDivElement>){
        window.location.href = `/project/${e.currentTarget.id}`;
    }

    return (
        <MainContainer>
            <div
                style={{display: editingMode === modals.HIDDEN ? "flex" : "none"}}
                className="main-show-view">
                <div className="main-view-projects-list">
                    {tree?.map((item: TodoSuper) => {
                        if (item.type === ProjectUnit.name) {
                            return (
                                <div
                                    className="main-view-projects-list-item"
                                    id={item.id.toString()}
                                    key={item.id}
                                    onClick={(e) => handleProjectEntryClicked(e)}
                                >
                                    <div className="main-card-image">
                                        {/**TODO: Maybe add Image?**/}
                                    </div>
                                    <div className="main-card-content">
                                        <p>{(item as ProjectUnit).title}</p>

                                        <div
                                            className="main-card-action-buttons"
                                        >
                                            <button
                                                className="main-action-button"
                                                onClick={(e) =>{
                                                    e.stopPropagation();
                                                    setupEditProject(item.id)
                                                }}
                                            >
                                                <EditIcon />
                                            </button>

                                            <button
                                                className="main-action-button"
                                                onClick={(e) =>{
                                                    e.stopPropagation();
                                                    handleDeleteProject(item.id)
                                                }}
                                            >
                                                <DeleteIcon />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    })}
                </div>
                <div className="main-view-buttons">
                    <button
                        className="main-button"
                        onClick={() => {
                            setEditor({
                                ...editor,
                                title: "",
                                editing: false
                            });
                            setEditingMode(modals.EDITOR_PROJECT)
                        }
                    }
                    >Add</button>
                </div>
            </div>

            <div
                style={{display: editingMode === modals.EDITOR_PROJECT ? "flex" : "none"}}
                className="main-show-editor"
            >
                <EditTitle
                    editor={editor}
                    setEditor={setEditor}
                    hideEditor={() => setEditingMode(modals.HIDDEN)}
                    handleAdd={handleAddProject}
                    handleEdit={handleEditProject}
                />
            </div>
        </MainContainer>
    );
}