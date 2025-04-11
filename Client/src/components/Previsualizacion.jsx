import React, { useEffect, useRef } from 'react'
import '../Styles/Previsualizacion.css'
import { PrincipalPage } from '../pages/PrincipalPage';

export const Previsualizacion = ({handlePrevisualuzar, user}) => {

     const formPrev = useRef(null);
    
      useEffect(() => {
        if (formPrev.current) {
            formPrev.current.scrollIntoView({ behavior: "smooth", block: "start" });
            formPrev.current.focus(); // También enfoca el input
        }

        console.log(user)
      }, []);



  return (
    <div className='crearContainer containerPre' ref={formPrev}>




        <div className="previsualizacion">

            <PrincipalPage emprendimientoPre={user.emprendimiento}></PrincipalPage>






        </div>


        <button className='btn-volver volverPre' onClick={handlePrevisualuzar}>volver</button>

















        
    </div>
  )
}
