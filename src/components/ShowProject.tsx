import "../css/ShowProject.css";

import {type JSX, useState} from "react";
import {useParams} from "react-router";

import {useTodoStore} from "../scripts/TodoStore.ts";
import {type Modal, modals, Todo, TodoGroup, type TodoSuper} from "../scripts/utils/types.ts";

import EditTitle from "./EditTitle.tsx";
import EditTodo from "./EditTodo.tsx";
import ShowTodo from "./ShowTodo.tsx";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import MainContainer from "./MainContainer.tsx";
import {addGroup, addTodo, deleteGroup, deleteTodo, editGroup, editTodo} from "../scripts/TreeHelper.ts";

export default function ShowProject(): JSX.Element {
    const [openGroups, setOpenGroups] = useState<Record<number, boolean>>({});
    const [editingMode, setEditingMode] = useState<Modal>(modals.HIDDEN)
    const [todoEditor, setTodoEditor] = useState({
        title: "",
        content: "",
        done: false,
        groupId: -1,
        editing: false,
        targetId: -1
    });
    const [groupEditor, setGroupEditor] = useState({
        title: "",
        editing: false,
        targetId: -1
    });

    const {id} = useParams();
    const {tree, updateInTree, appendToTree, deleteFromTree} = useTodoStore();

    const toggleGroup = (groupId: number) => {
        setOpenGroups((prev) => ({...prev, [groupId]: !prev[groupId]}));
    };

    function toggleTodoCheck(todo: Todo){
        todo.done = !todo.done;
        updateInTree(todo.id, todo)
    }

    function resetEditors(){
        setGroupEditor({
            ...groupEditor,
            title: "",
            editing: false,
            targetId: -1
        });

        setTodoEditor({
            ...todoEditor,
            content: "",
            done: false,
            groupId: -1,
            title: "",
            editing: false,
            targetId: -1,
        });
        setEditingMode(modals.HIDDEN)
    }

    function handleAddGroup() {
        if(!id) return;
        addGroup(+id, groupEditor.title, appendToTree);
        resetEditors();
    }

    function handleDeleteGroup(targetId: number) {
        deleteGroup(targetId, tree ?? [], deleteFromTree);
    }

    function setupEditGroup(todo: TodoGroup){
        setGroupEditor({
            ...groupEditor,
            title: todo.title,
            targetId: todo.id,
            editing: true
        });
        setEditingMode(modals.EDITOR_GROUP);
    }

    function handleEditGroup(){
        editGroup(groupEditor.targetId, groupEditor.title, tree ?? [], updateInTree);
        resetEditors();
    }

    function handleAddTodo() {
        if(!id) return;
        addTodo(+id, todoEditor.groupId, todoEditor.title, todoEditor.content, todoEditor.done, appendToTree);
        resetEditors();
    }

    function handleDeleteTodo(targetId: number) {
        deleteTodo(targetId, tree ?? [], deleteFromTree);
    }

    function setupEditTodo(todo: Todo){
        setTodoEditor({
            ...todoEditor,
            title: todo.title,
            content: todo.content,
            done: todo.done,
            groupId: todo.group ?? -1,
            targetId: todo.id,
            editing: true
        });
        setEditingMode(modals.EDITOR_TODO);
    }

    function handleEditTodo(){
        if(!todoEditor.editing || todoEditor.targetId === -1 ||  !id) return;
        editTodo(todoEditor.targetId, todoEditor.title, todoEditor.content, todoEditor.done, +id, todoEditor.groupId, tree ?? [], updateInTree);
        resetEditors();
    }

    if (!id) {
        return (
            <div>
                <h1>id can't be undefined or null, navigate back.</h1>
            </div>
        );
    }

    return (
        <MainContainer>
            <div
                className="todo-list-view"
                style={{display: editingMode === modals.HIDDEN ? "flex" : "none"}}
            >
                <div className="todo-list-todos-container">
                    {(tree ?? []).filter((value: TodoSuper) => value.type === TodoGroup.name && (value as TodoGroup).project === +id).map((group) => {
                        const groupTodos = (tree ?? []).filter((entry: TodoSuper) => entry.type === Todo.name ).filter((todo:TodoSuper) => (todo as Todo).group === group.id);
                        return (
                            <div key={`header@${group.id}`} className="todo-list-group">
                                <div key={`header@${group.id}`} className="todo-list-group-header" onClick={() => toggleGroup(group.id)}>
                                    <span>{openGroups[group.id] ? "▼" : "▶"}</span>
                                    <h2>{(group as TodoGroup).title}</h2>

                                    <button
                                        className="action-button"
                                        onClick={(e) =>{
                                            e.stopPropagation();
                                            setTodoEditor({
                                                ...todoEditor,
                                                title: "",
                                                content: "",
                                                done: false,
                                                groupId: group.id,
                                                editing: false
                                            });
                                            setEditingMode(modals.EDITOR_TODO);
                                        }}>
                                        <AddIcon />
                                    </button>

                                    <button
                                        className="action-button"
                                        onClick={(e) =>{
                                            e.stopPropagation();
                                            setupEditGroup(group as TodoGroup);
                                        }}>
                                        <EditIcon />
                                    </button>

                                    <button
                                        className="action-button"
                                        onClick={(e) =>{
                                            e.stopPropagation();
                                            handleDeleteGroup(group.id);
                                        }}>
                                        <DeleteIcon />
                                    </button>
                                </div>
                                {openGroups[group.id] && (
                                    <div
                                        className="todo-list-group-content"
                                        key={`content@${group.id}`}
                                    >
                                        {groupTodos.length === 0 && <p className="todo-list-empty">No todos yet.</p>}
                                        {groupTodos.map((todo) => (
                                            <ShowTodo
                                                todo={todo as Todo}
                                                toggleTodoCheck={toggleTodoCheck}
                                                setupEditTodo={setupEditTodo}
                                                handleDeleteTodo={handleDeleteTodo}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    {(tree ?? []).filter((value: TodoSuper) => value.type === Todo.name && (value as Todo).project === +id && (value as Todo).group === -1).map((todo) => (
                            <ShowTodo
                                todo={todo as Todo}
                                toggleTodoCheck={toggleTodoCheck}
                                setupEditTodo={setupEditTodo}
                                handleDeleteTodo={handleDeleteTodo}
                            />
                        ))
                    }
                </div>
                <div className="todo-list-view-buttons">
                    <button
                        className="todo-list-button"
                        onClick={() => {
                            resetEditors();
                            setEditingMode(modals.EDITOR_GROUP);
                        }}
                    >Add Group</button>

                    <button
                        className="todo-list-button"
                        onClick={() => {
                            resetEditors();
                            setEditingMode(modals.EDITOR_TODO);
                        }}
                    >Add Todo</button>
                </div>
            </div>

            <div
                className="todo-list-editor"
                style={{display: editingMode === modals.EDITOR_GROUP || editingMode === modals.EDITOR_TODO ? "flex" : "none"}}
            >
                {editingMode === modals.EDITOR_GROUP ?
                    <EditTitle
                        editor={groupEditor}
                        setEditor={setGroupEditor}
                        hideEditor={() => setEditingMode(modals.HIDDEN)}
                        handleAdd={handleAddGroup}
                        handleEdit={handleEditGroup}
                    />
                    :
                    <EditTodo
                        editor={todoEditor}
                        setEditor={setTodoEditor}
                        hideEditor={() => setEditingMode(modals.HIDDEN)}
                        handleAdd={handleAddTodo}
                        handleEdit={handleEditTodo}
                    />
                }
            </div>
        </MainContainer>
    );
}