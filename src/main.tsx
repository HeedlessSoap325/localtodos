import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {BrowserRouter, Route, Routes} from "react-router";

import MainPage from "./components/MainPage.tsx";
import AuthenticatedRoute from "./AuthenticatedRoute.tsx";
import Authentication from "./components/Authentication.tsx";
import ShowProject from "./components/ShowProject.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={
                    <AuthenticatedRoute>
                        <MainPage />
                    </AuthenticatedRoute>
                } />
                <Route path="/auth" element={
                    <Authentication />
                } />
                <Route path="/project/:id" element={
                    <AuthenticatedRoute>
                        <ShowProject />
                    </AuthenticatedRoute>
                } />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);