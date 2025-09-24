import "../css/EditTitle.css";

import type {JSX} from "react";

interface EditTitleProps {
    editor: {
        title: string;
        editing: boolean;
        targetId: number;
    },
    setEditor: (editor: EditTitleProps["editor"]) => void
    hideEditor: () => void;
    handleAdd: () => void;
    handleEdit: () => void;
}
export default function EditTitle(props: EditTitleProps): JSX.Element {
    return(
        <div className="edit-title-container">
            <div className="edit-title-center">
                <div className="edit-title-title">
                    <input
                        value={props.editor.title}
                        onChange={(e) => props.setEditor({ ...props.editor, title: e.target.value })}
                        type="text"
                        placeholder="Title"
                    />
                </div>
                <div className="edit-title-buttons">
                    <button
                        className="edit-title-button"
                        onClick={() => props.hideEditor()}
                    >Cancel</button>
                    <button
                        className="edit-title-button"
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