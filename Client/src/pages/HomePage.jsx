import React, { useEffect, useState } from "react";
import { useAppContext } from "../store/appContext";
import { EmprendimientoCreateById, getEmprendimientoByUserId, putEmprendimientoByUserId } from "../service/emprendimientosService";
import "../Styles/HomePage.css";
import { Navbar } from "../components/Navbar";
import { AparienciaConfigurations } from "../components/AparienciaConfigurations";
import { TemaConfigurations } from "../components/TemaConfigurations";
import { ClipLoader } from "react-spinners";
import Swal from "sweetalert2";
import { Navigate, useNavigate } from "react-router-dom";
import { MeProfile } from "../service/userServiceN";

export const HomePage = () => {
    const { user, userLog, setUser } = useAppContext();
    const [loading, setLoading] = useState(true);
    const [emprendimiento, setEmprendimiento] = useState(null);

    // 🚀 Estado para almacenar la configuración
    const [configData, setConfigData] = useState({
        apariencia: {},
        tema: null,
    });

    const navigate = useNavigate();


    useEffect(() => {
        if (!userLog?.userId) return;
        if (user) return;

        // Obtener perfil del usuario
        MeProfile(userLog.userId)
            .then((data) => {
                setUser(data);
                return getEmprendimientoByUserId(userLog.userId); // Luego obtener emprendimiento
            })
            .then((emprendimientoData) => {
                if (emprendimientoData) {
                    setEmprendimiento(emprendimientoData);
                    setConfigData({
                        apariencia: {
                            nombreEmprendimiento: emprendimientoData.nombre || "",
                            descripcion: emprendimientoData.descripcion || "",
                            imagen: emprendimientoData.imagen || "",
                            dominio: emprendimientoData.dominio || "",
                        },
                        tema: emprendimientoData.plantilla || null,
                    });
                }
            })
            .catch((error) => console.error("Error en la carga de datos:", error))
            .finally(() => setLoading(false));
    }, [userLog]);

    // 🚀 Función para actualizar la configuración
    const handleConfigChange = (key, value) => {
        setConfigData((prevConfig) => ({
            ...prevConfig,
            [key]: value,
        }));
    };

    // ✅ Función para guardar un nuevo emprendimiento
    const handleSaveChanges = async () => {
        if (!userLog?.userId) {
            Swal.fire("Error", "No hay usuario logueado.", "error");
            return;
        }

        const emprendimientoData = {
            nombre: configData.apariencia.nombreEmprendimiento,
            descripcion: configData.apariencia.descripcion,
            imagen: configData.apariencia.imagen,
            dominio: configData.apariencia.dominio,
            plantilla: configData.tema,
        };

        try {
            await EmprendimientoCreateById(user._id, emprendimientoData);

            Swal.fire({
                title: "¡Emprendimiento creado!",
                text: "Tu emprendimiento ha sido creado correctamente.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
            });

            setEmprendimiento(emprendimientoData); // Ahora ya existe el emprendimiento
        } catch (error) {
            Swal.fire({
                title: "Error en el Emprendimiento",
                text: error.message || "Ocurrió un problema, intenta más tarde.",
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
            });
        }
    };

    // ✅ Función para editar un emprendimiento existente
    const handleEditChanges = async () => {
        if (!userLog?.userId) {
            Swal.fire("Error", "No hay usuario logueado.", "error");
            return;
        }

        const emprendimientoData = {
            nombre: configData.apariencia.nombreEmprendimiento,
            descripcion: configData.apariencia.descripcion,
            subdominio: "subdominio",
            dominio: configData.apariencia.dominio,
            plantilla: configData.tema,
        };

        try {
            await putEmprendimientoByUserId(user._id, emprendimientoData);

            Swal.fire({
                title: "¡Emprendimiento Editado!",
                text: "Tu emprendimiento ha sido editado correctamente.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
            });

            setEmprendimiento(emprendimientoData);
        } catch (error) {
            Swal.fire({
                title: "Error en el Emprendimiento",
                text: error.message || "Ocurrió un problema, intenta más tarde.",
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
            });
        }
    };


    const handleCopyLink = () => {
        if (!emprendimiento?.dominio) {
            alert("No hay dominio disponible.");
            return;
        }

        const link = `${window.location.origin}/tuturno/${emprendimiento.dominio}`;

        navigator.clipboard.writeText(link)
            .then(Swal.fire({
                title: "Se copió el enlace",
                icon: "success",
                toast: true,
                position: "top",
                timer: 2000,
                showConfirmButton: false,
            }))
            .catch((error) => console.error("Error al copiar el enlace:", error));
    };

    return (
        <div className="home">
            {loading ? (
                <div className="spinner-container">
                    <ClipLoader size={50} color="#26D8DA" />
                    <p>Cargando usuario...</p>
                </div>
            ) : user ? (
                <div className="home">
                    <Navbar user={user} />
                    <div className="homeUses">
                        <AparienciaConfigurations
                            emprendimiento={emprendimiento}
                            onConfigChange={(data) => handleConfigChange("apariencia", data)}
                        />
                        <TemaConfigurations
                            emprendimiento={emprendimiento}
                            onConfigChange={(temaId) => handleConfigChange("tema", temaId)}
                        />

                        {emprendimiento && (

                            <a onClick={handleCopyLink} className="btnCompartLink">
                                Compartir link
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="18" cy="5" r="3"></circle>
                                    <circle cx="6" cy="12" r="3"></circle>
                                    <circle cx="18" cy="19" r="3"></circle>
                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                                </svg>
                            </a>





                        )}

                        <button className="btn-volver" onClick={() => navigate("/admin")}>
                            Panel de control
                        </button>

                        {emprendimiento ? (
                            <button className="btnGuardarHomePage" onClick={handleEditChanges}>
                                Editar Cambios
                            </button>
                        ) : (
                            <button className="btnGuardarHomePage" onClick={handleSaveChanges}>
                                Guardar cambios
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <p>Error al cargar usuario.</p>
            )}
        </div>
    );
};
