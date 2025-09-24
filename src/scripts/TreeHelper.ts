import {ProjectUnit, Todo, TodoGroup, type TodoSuper} from "./utils/types";

export function addProject(title: string, appendToTree: (x: TodoSuper) => void) {
    const project = new ProjectUnit(title || undefined);
    appendToTree(project);
    return project;
}

export function editProject(id: number, title: string, tree: TodoSuper[], updateInTree: (id: number, updated: TodoSuper) => void) {
    const project = tree.find((x) => x.id === id && x.type === ProjectUnit.name) as ProjectUnit | undefined;
    if (!project) return;
    project.title = title;
    updateInTree(project.id, project);
}

export function deleteProject(id: number, tree: TodoSuper[], deleteFromTree: (id: number) => void) {
    for (const entry of tree) {
        if (entry.type === ProjectUnit.name && entry.id === id) {
            deleteFromTree(entry.id);
        } else if (
            (entry.type === TodoGroup.name && (entry as TodoGroup).project === id) ||
            (entry.type === Todo.name && (entry as Todo).project === id)
        ) {
            deleteFromTree(entry.id);
        }
    }
}

export function addGroup(projectId: number, title: string, appendToTree: (x: TodoSuper) => void) {
    const group = new TodoGroup(projectId, title || undefined);
    appendToTree(group);
    return group;
}

export function editGroup(id: number, title: string, tree: TodoSuper[], updateInTree: (id: number, updated: TodoSuper) => void) {
    const group = tree.find((x) => x.id === id && x.type === TodoGroup.name) as TodoGroup | undefined;
    if (!group) return;
    group.title = title;
    updateInTree(group.id, group);
}

export function deleteGroup(id: number, tree: TodoSuper[], deleteFromTree: (id: number) => void) {
    for (const entry of tree) {
        if (entry.type === TodoGroup.name && entry.id === id) {
            deleteFromTree(entry.id);
        } else if (entry.type === Todo.name && (entry as Todo).group === id) {
            deleteFromTree(entry.id);
        }
    }
}

export function addTodo(projectId: number, groupId: number | null, title: string, content: string, done: boolean, appendToTree: (x: TodoSuper) => void) {
    const todo = new Todo(title, content, done, projectId, groupId);
    appendToTree(todo);
    return todo;
}

export function editTodo(id: number, title: string, content: string, done: boolean, projectId: number, groupId: number | null, tree: TodoSuper[], updateInTree: (id: number, updated: TodoSuper) => void) {
    const todo = tree.find((x) => x.id === id && x.type === Todo.name) as Todo | undefined;
    if (!todo) return;
    todo.title = title;
    todo.content = content;
    todo.done = done;
    todo.project = projectId;
    todo.group = groupId;
    updateInTree(todo.id, todo);
}

export function deleteTodo(id: number, tree: TodoSuper[], deleteFromTree: (id: number) => void) {
    for (const entry of tree) {
        if (entry.type === Todo.name && entry.id === id) {
            deleteFromTree(entry.id);
        }
    }
}