import React, { useState } from "react";
import "../Styles/TemaConfigurations.css";
import plantilla1 from "../assets/Plantilla1.png";
import plantilla2 from "../assets/Plantilla2.png";
import plantilla3 from "../assets/Plantilla3.png";
import plantilla4 from "../assets/Plantilla4.png";

export const TemaConfigurations = ({ onConfigChange }) => {
    const [selectedTema, setSelectedTema] = useState(1);

    const temas = [
        { id: 1, image: plantilla1, plantilla: "Plantilla 1" },
        { id: 2, image: plantilla2, plantilla: "Plantilla 2" },
        { id: 3, image: plantilla3, plantilla: "Plantilla 3" },
        { id: 4, image: plantilla4, plantilla: "Plantilla 4" },
    ];

    const handleSelectTema = (temaId) => {
        setSelectedTema(temaId);
        onConfigChange(temaId); // 🚀 Enviar selección al padre
    };

    return (
        <div className="TemaConfigurations">
            <p className="ConfigurationsTitle">Temas</p>

            <div className="Temas">
                {temas.map((tema) => (
                    <div
                        key={tema.id}
                        className={`tema ${selectedTema === tema.id ? "selected" : ""}`}
                        onClick={() => handleSelectTema(tema.id)}
                    >
                        <img src={tema.image} alt={`Tema ${tema.plantilla}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};
