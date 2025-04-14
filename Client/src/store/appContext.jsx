import { createContext, useContext, useEffect, useState } from "react";
import { login, logout, Register } from "../service/authService";
import { jwtDecode } from "jwt-decode"; 

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userLog, setUserLog] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token); // 📌 Decodifica el token
        setUserLog(decodedUser);
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        handleLogout();
      }
    }
  }, []);



  const handleLogin = async (email, password) => {
    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token);
      const decodedUser = jwtDecode(data.token); // 🚀 Decodificar token
      setUserLog(decodedUser);
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error en el Login");
    }
  };

  const handleRegister = async (name, email, password) => {
    try {
      const data = await Register(name, email, password);
      localStorage.setItem("token", data.token);
      const decodedUser = jwtDecode(data.token); // 🚀 Decodificar token
      setUserLog(decodedUser);
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error en el registro");
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    setUser(null);
    setUserLog(null);
  };

  return (
    <AppContext.Provider value={{ user, handleLogin, handleLogout, handleRegister, userLog, setUser }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
