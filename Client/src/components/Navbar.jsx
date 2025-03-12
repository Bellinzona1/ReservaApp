import React, { useState, useEffect, useRef } from "react";
import "../Styles/Navbar.css";
import photoDesignTool from "../assets/DesignTool.png";
import estrellas from "../assets/estrellas.png";
import calendar from "../assets/calendar.png";
import tarjeta from "../assets/tarjeta.png";
import dinero from "../assets/dinero.png";
import configuracion from "../assets/configuracion.png";
import menuIcon from "../assets/menu.png";

export const Navbar = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null); // 🚀 Referencia al navbarMobile

    // 🚀 Manejar clics fuera del menú para cerrarlo
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    return (
        <div className="Navbar">
            {/* 🚀 Botón de menú hamburguesa */}
            <div className="navbarMobileMenu" onClick={() => setIsOpen(!isOpen)}>
                <img src={menuIcon} alt="Menú" />
            </div>

            {/* 🚀 Menú lateral que se muestra si `isOpen` es true */}
            <div ref={menuRef} className={`navbarMobile ${isOpen ? "active" : ""}`}>
                <div className="TitleApp">
                    <img src={photoDesignTool} alt="Logo" />
                    <h1>Design Tool</h1>
                </div>

                <div className="optionsContainer">
                    <div className="option">
                        <img src={estrellas} alt="Apariencia" />
                        <a href="/home">Apariencia</a>
                    </div>
                    <div className="option">
                        <img src={calendar} alt="Calendario" />
                        <a href="/home">Calendario</a>
                    </div>
                    <div className="option">
                        <img src={tarjeta} alt="Medios de pago" />
                        <a href="/home">Medios de pago</a>
                    </div>
                    <div className="option">
                        <img src={dinero} alt="Recaudación" />
                        <a href="/home">Recaudación</a>
                    </div>
                </div>

                <div className="userContainer">
                    <div className="userInfo">
                        <img src={user.imageProfile} alt="Perfil" />
                        <div className="userNameStat">
                            <p>{user.name}</p>
                            <p className="accountStatus">{user.accountStatus}</p>
                        </div>
                        <img src={configuracion} alt="Configuración" className="configuracionUser" />
                    </div>
                </div>
            </div>
        </div>
    );
};
