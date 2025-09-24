export interface TodoSuper {
    id: number;
    type: string;
}

export class ProjectUnit implements TodoSuper {
    id: number;
    type: string;
    title: string;
    constructor(title: string = `project on ${new Date().toLocaleDateString()}`) {
        this.id = new Date().getTime();
        this.type = this.constructor.name;
        this.title = title;
    }
}

export class Todo implements TodoSuper {
    id: number;
    type: string;
    title: string;
    content: string;
    done: boolean;
    project: number;
    group: number | null;
    constructor(title: string, content: string, done: boolean, project: number , group: number | null) {
        this.id = new Date().getTime();
        this.type = this.constructor.name;
        this.title = title;
        this.content = content;
        this.done = done;
        this.project = project;
        this.group = group
    }
}

export class TodoGroup implements TodoSuper {
    id: number;
    type: string;
    project: number;
    title: string;
    constructor(project: number, title: string = `group on ${new Date().toLocaleDateString()}`) {
        this.id = new Date().getTime();
        this.type = this.constructor.name;
        this.project = project;
        this.title = title;
    }
}

export interface EncryptedRoot {
    version: number;
    kdf: string;
    hash: string;
    iterations: number;
    salt: string; // base64
    iv: string; // base64
    ciphertext: string; // base64
    createdAt: number;
}

export interface SavedRoot {
    id: number;
    envelope: EncryptedRoot;
    createdAt: number;
}

export const modals = {
    HIDDEN: "HIDDEN",
    EDITOR_TODO: "EDITOR_TODO",
    EDITOR_GROUP: "EDITOR_GROUP",
    EDITOR_PROJECT: "EDITOR_PROJECT",
    PASSWORD_AND_SAVE: "PASSWORD_AND_SAVE",
    PASSWORD_AND_QUIT: "PASSWORD_AND_QUIT",
} as const;

export type Modal = typeof modals[keyof typeof modals];
