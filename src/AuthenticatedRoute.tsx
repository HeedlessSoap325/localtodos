import * as React from "react";
import {useEffect} from "react";
import {Navigate} from "react-router";

import {useTodoStore, useUserStore} from "./scripts/TodoStore.ts";

export default function AuthenticatedRoute({ children }: { children: React.ReactNode }) {
    const {tree, clearTree} = useTodoStore();
    const {username, clearUser} = useUserStore();

    const isNotLoggedIn = username === "" || tree === undefined;

    useEffect(() => {
        if (isNotLoggedIn) {
            clearTree();
            clearUser();
        }
    }, [isNotLoggedIn, clearTree, clearUser]);

    if (isNotLoggedIn) {
        return <Navigate to="/auth" replace />;
    }

    return (
        <>
            {children}
        </>
    );
}