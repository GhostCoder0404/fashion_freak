// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { setToken as apiSetToken, me as apiMe } from "../services/api";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const t = localStorage.getItem("ff_token");
        if (t) {
            apiSetToken(t);
            apiMe().then(u => setUser(u)).catch(() => {
                localStorage.removeItem("ff_token");
                apiSetToken(null);
                setUser(null);
            });
        }
    }, []);

    const login = async (token) => {
        console.log("AuthContext: login called with token", token);
        localStorage.setItem("ff_token", token);
        apiSetToken(token);
        try {
            console.log("AuthContext: calling apiMe()...");
            const u = await apiMe();
            console.log("AuthContext: apiMe returned", u);
            setUser(u);
        } catch (e) {
            console.error("me fetch failed", e);
        }
    };

    const logout = () => {
        localStorage.removeItem("ff_token");
        apiSetToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
