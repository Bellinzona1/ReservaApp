import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "../pages/HomePage.jsx";
import { LoginPage } from "../pages/LoginPage.jsx";
import { RegisterPage } from "../pages/RegisterPage.jsx";
import { PrincipalPage } from "../pages/PrincipalPage.jsx";
import { PanelPage } from "../pages/PanelPage.jsx";
import { CalendarPage } from "../pages/CalendarPage.jsx";
import { UserConfigurationsPage } from "../pages/UserConfigurationsPage.jsx";
import { ConectMpPage } from "../pages/ConectMpPage.jsx";
import { useAppContext } from "../store/appContext.jsx";
import { useEffect, useState } from "react";
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

  if (loading) {
    return (
      <div className="loading-screen">
        <p>Cargando...</p>
      </div>
    );
  }

  const publicRoutes = (
    <>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/tuturno/:name" element={<PrincipalPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </>
  );

  const userWithoutBusinessRoutes = (
    <>
      <Route path="/" element={<HomePage />} />
      <Route path="/User" element={<UserConfigurationsPage user={user} />} />
      <Route path="/conectmp" element={<ConectMpPage user={user} />} />
      <Route path="/tuturno/:name" element={<PrincipalPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </>
  );

  const userWithBusinessRoutes = (
    <>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={<PanelPage user={user} />} />
      <Route path="/calendar" element={<CalendarPage user={user} />} />
      <Route path="/User" element={<UserConfigurationsPage user={user} />} />
      <Route path="/conectmp" element={<ConectMpPage user={user} />} />
      <Route path="/tuturno/:name" element={<PrincipalPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </>
  );

  return (
    <Router>
      <Routes>
        {!userLog 
          ? publicRoutes 
          : !user?.emprendimiento 
            ? userWithoutBusinessRoutes 
            : userWithBusinessRoutes}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
