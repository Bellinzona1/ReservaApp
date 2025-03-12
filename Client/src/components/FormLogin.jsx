import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 🚀 Importa useNavigate
import "../Styles/FormLogin.css";
import { useAppContext } from "../store/appContext";
import Swal from "sweetalert2"; // 🚀 Importamos SweetAlert2


export const FormLogin = () => {
    const { handleLogin } = useAppContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate(); // 🚀 Hook para navegar

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
             Swal.fire({
                        title: "Error",
                        text: "Todos los campos son obligatorios.",
                        icon: "error",
                        confirmButtonText: "Entendido",
                    });
            return;
        }

        try {
            await handleLogin(email, password);
            navigate("/"); // 🚀 Redirige al usuario a la página principal


        } catch {

             Swal.fire({
                        title: "Error al iniciar sesion",
                        text:"Revisa tu usuario y contraseña",
                        icon: "error",
                        confirmButtonText: "Intentar de nuevo",
                    });
        }
    };

    return (
        <form className="formLogin" onSubmit={onSubmit}>
            <h1>Inicio de Sesión</h1>

            <div className="datosContainer">
                <input
                    type="text"
                    id="email"
                    name="email"
                    placeholder="Email"
                    className="inputFormLogin"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    className="inputFormLogin secondbtnLogin"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <label htmlFor="">¿Olvidaste tu contraseña?</label>

                <button type="submit" className="buttonIniciarSesion">
                    Iniciar Sesión
                </button>

                {/* 🚀 Redirigir al usuario a /register */}
                <button type="button" className="buttonRegistrarse" onClick={() => navigate("/Register")}>
                    Registrarse
                </button>
            </div>

            <div className="otrasOpciones">
                <p>O continúa con:</p>

                <div className="googleOption">
                    <img
                        src="https://png.pngtree.com/png-vector/20230817/ourmid/pngtree-google-internet-icon-vector-png-image_9183287.png"
                        alt="Google"
                    />
                </div>
            </div>
        </form>
    );
};
