import "../css/EditTodo.css";

import type {JSX} from "react";

interface EditTodoProps {
    editor: {
        title: string;
        done: boolean;
        groupId: number;
        content: string;
        editing: boolean;
        targetId: number;
    },
    setEditor: (editor: EditTodoProps["editor"]) => void
    hideEditor: () => void;
    handleAdd: () => void;
    handleEdit: () => void;
}
export default function EditTodo(props: EditTodoProps): JSX.Element {
    return(
        <div className="edit-todo-container">
            <div className="edit-todo-center">
                <input
                    type="checkbox"
                    checked={props.editor.done}
                    onChange={() => props.setEditor({
                        ...props.editor,
                        done: !props.editor.done
                    })}
                />

                <input
                    type="text"
                    value={props.editor.title}
                    onChange={(e) => props.setEditor({
                        ...props.editor,
                        title: e.target.value
                    })}
                />
                <textarea
                    value={props.editor.content}
                    onChange={(e) => props.setEditor({
                        ...props.editor,
                        content: e.target.value
                    })}
                />
                <div className="edit-todo-buttons">
                    <button
                        className="edit-todo-button"
                        onClick={() => props.hideEditor()}
                    >Cancel</button>
                    <button
                        className="edit-todo-button"
                        onClick={() => {
                            if(props.editor.editing){
                                props.handleEdit();
                            } else{
                                props.handleAdd();
                            }
                        }}
                    >Save</button>
                </div>
            </div>
        </div>
    );
}