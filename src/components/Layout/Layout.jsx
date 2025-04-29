import { useState, useEffect } from "react";
import NavBar from '../NavBar/NavBar';
import NavBar2 from "../NavBar2/NavBar2";
import "./Layout.scss";
import { Outlet } from "react-router-dom";

export default function Layout() {
    const [darkMode, setDarkMode] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // جلب بيانات المستخدم من persist:root في localStorage
        const persistRoot = localStorage.getItem('persist:root');
        if (persistRoot) {
            try {
                const parsedPersist = JSON.parse(persistRoot);
                if (parsedPersist.auth) {
                    const authData = JSON.parse(parsedPersist.auth);
                    if (authData.user) {
                        setUser(authData.user);
                    }
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    return (
        <div className={`layout theme-${darkMode ? "dark" : "light"}`}>
            {user ? <NavBar2 user={user} /> : <NavBar />}
            <main className="content">
                <Outlet />
            </main>
        </div>
    );
}