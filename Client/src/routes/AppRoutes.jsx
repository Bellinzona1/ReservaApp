import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "../pages/HomePage.jsx";
import { LoginPage } from "../pages/LoginPage.jsx";
import { useAppContext } from "../store/appContext.jsx";
import { RegisterPage } from "../pages/RegisterPage.jsx";
import { PrincipalPage } from "../pages/PrincipalPage.jsx";


const AppRoutes = () => {

    const { user, setUser, theme, userLog } = useAppContext();


    if (userLog === null) {
        return (
            <Router>
                <Routes>
                    <Route path="*" element={<Navigate to="/login" replace />} />
                    <Route path="/Register" element={<RegisterPage></RegisterPage>} />
                    <Route path="/Login" element={<LoginPage></LoginPage>} />
                    <Route path="/tuturno/:name" element={<PrincipalPage></PrincipalPage>} />
                </Routes>
            </Router>
        );
    } else {
        return (
            <Router>
                <Routes>
                    <Route path="*" element={<Navigate to="/" replace />} />
                    <Route path="/tuturno/:id" element={<PrincipalPage></PrincipalPage>} />
                    <Route path="/" element={<HomePage></HomePage>} />
                </Routes>
            </Router>
        );
    }
};

export default AppRoutes;
