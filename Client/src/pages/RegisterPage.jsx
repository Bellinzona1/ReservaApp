import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/RegisterPage.css";
import { useAppContext } from "../store/appContext";
import Swal from "sweetalert2"; // 🚀 Importamos SweetAlert2



export const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { handleRegister } = useAppContext();
    

    const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
        Swal.fire({
            title: "Error",
            text: "Todos los campos son obligatorios.",
            icon: "error",
            confirmButtonText: "Entendido",
        });
        return;
    }

    try {
        // 🚀 Intentamos registrar al usuario
        await handleRegister(name, email, password);

        // 🚀 Si todo sale bien, mostramos el mensaje de éxito
        Swal.fire({
            title: "¡Registro exitoso!",
            text: "Tu cuenta ha sido creada correctamente.",
            icon: "success",
            timer: 2000, // Se cierra automáticamente
            showConfirmButton: false,
        }).then(() => {
            navigate("/"); // Redirige a la página principal
        });

    } catch (error) {
        // 🚨 Si hay un error, mostramos la alerta de error
        Swal.fire({
            title: "Error en el registro",
            text: error.message || "Ocurrió un problema al crear tu cuenta.",
            icon: "error",
            confirmButtonText: "Intentar de nuevo",
        });
    }
};

    return (
        <div className="register-container">
            <h1>Registro</h1>
            <form className="register-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Correo Electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Registrarse</button>
            </form>
            <p>
                ¿Ya tienes una cuenta?{" "}
                <span className="login-link" onClick={() => navigate("/login")}>
                    Iniciar sesión
                </span>
            </p>
        </div>
    );
};
