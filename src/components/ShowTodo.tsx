import "../css/ShowTodo.css";

import {type JSX, useState} from "react";

import type {Todo} from "../scripts/utils/types.ts";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface TodoProps {
    todo: Todo;
    toggleTodoCheck: (todo: Todo) => void;
    setupEditTodo: (todo: Todo) => void;
    handleDeleteTodo: (targetId: number) => void;
}
export default function ShowTodo(props: TodoProps): JSX.Element {
    const [expanded, setExpanded] = useState<boolean>(false);
    return(
        <div key={props.todo.id} className={`todo ${props.todo.done ? "completed" : ""}`}>
            <div className="todo-info" onClick={() => setExpanded(!expanded)}>
                <div className="todo-header">
                    <input
                        type="checkbox"
                        checked={props.todo.done}
                        onChange={() => {props.toggleTodoCheck(props.todo)}}
                        onClick={(e) => e.stopPropagation()}
                    />

                    <span className="todo-title">{props.todo.title}</span>
                    <span className="todo-date">
                        {new Date(props.todo.id).toLocaleDateString()}
                    </span>
                    <button
                        className="action-button"
                        onClick={(e) =>{
                            e.stopPropagation();
                            props.setupEditTodo(props.todo)
                        }}>
                        <EditIcon />
                    </button>

                    <button
                        className="action-button"
                        onClick={(e) =>{
                            e.stopPropagation();
                            props.handleDeleteTodo(props.todo.id)
                        }}>
                        <DeleteIcon />
                    </button>
                </div>
                {expanded && (
                    <p className="todo-content">{props.todo.content}</p>
                )}
            </div>
        </div>
    );
}