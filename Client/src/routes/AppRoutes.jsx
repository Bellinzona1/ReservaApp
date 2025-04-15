import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "../pages/HomePage.jsx";
import { LoginPage } from "../pages/LoginPage.jsx";
import { useAppContext } from "../store/appContext.jsx";
import { RegisterPage } from "../pages/RegisterPage.jsx";
import { PrincipalPage } from "../pages/PrincipalPage.jsx";
import { PanelPage } from "../pages/PanelPage.jsx";
import { useEffect, useState } from "react";
import { CalendarPage } from "../pages/CalendarPage.jsx";
import { MeProfile } from "../service/userServiceN.js";

const AppRoutes = () => {
    const { userLog } = useAppContext();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!userLog || !userLog.userId) {
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const data = await MeProfile(userLog.userId);
                setUser(data);
            } catch (error) {
                console.error("Error obteniendo el usuario:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userLog]);

    // 👉 Nuevo useEffect para ver los cambios en user
    useEffect(() => {
        console.log("Usuario actualizado:", user);
    }, [user]);

    if (loading) {
        return (
            <div className="loading-screen">
                <p>Cargando...</p>
            </div>
        );
    }

    return (
        <Router>
            <Routes>
                {!userLog ? (
                    <>
                        <Route path="*" element={<Navigate to="/login" replace />} />
                        <Route path="/tuturno/:name" element={<PrincipalPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage />} />
                    </>
                ) : (
                    <>
                        <Route path="*" element={<Navigate to="/" replace />} />
                        <Route path="/tuturno/:name" element={<PrincipalPage />} />
                        <Route path="/admin" element={<PanelPage user={user} />} />
                        <Route path="/Calendar" element={<CalendarPage user={user}></CalendarPage>} />
                        <Route path="/" element={<HomePage  />} />
                    </>
                )}
            </Routes>
        </Router>
    );
};

export default AppRoutes;
