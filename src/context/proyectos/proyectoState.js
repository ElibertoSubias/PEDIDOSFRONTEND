import React, { useReducer } from 'react';
// import {v4 as uuid} from 'uuid';

import proyectoContext from './proyectoContext';
import proyectoReducer from './proyectoReducer';
import { 
    FORMULARIO_PROYECTO, 
    OBTENER_PROYECTO,
    AGREGAR_PROYECTO,
    PROYECTO_ERROR,
    VALIDAR_FORMULARIO,
    PROYECTO_ACTUAL,
    ELIMINAR_PROYECTO
} from '../../types';

import clienteAxios from '../../config/axios';

const ProyectoState = props => {

    const initialState = {
        proyectos : [],
        formulario : false,
        errorformulario: false,
        proyecto: null,
        mensaje: null
    }

    // Dispath para ejecutar las acciones
    const [state, dispath] = useReducer(proyectoReducer, initialState);

    // Serie de funciones para el CRUD
    const mostrarFormulario = () => {
        dispath({
            type: FORMULARIO_PROYECTO  
        })
    }

    // Obtener los proyectos
    const obtenerProyectos = async () => {
        try {

            const resultado = await clienteAxios.get('/api/proyectos');

            dispath({
                type: OBTENER_PROYECTO,
                payload: resultado.data.proyectos
            })

        } catch (error) {

            const alerta = {
                msg: 'Hubo un error',
                categoria: 'alerta-error'
            }
            
            dispath({
                type: PROYECTO_ERROR,
                payload: alerta
            })

        }
    }

    // Agregar nuevo proyecto
    const agregarProyecto = async proyecto => {
        
        try {
            const resultado = await clienteAxios.post('/api/proyectos', proyecto);
            // console.log(resultado);
            // Insertar el proyecto en el State
            dispath({
                type: AGREGAR_PROYECTO,
                payload: resultado.data
            })
        } catch (error) {

            const alerta = {
                msg: 'Hubo un error',
                categoria: 'alerta-error'
            }
            
            dispath({
                type: PROYECTO_ERROR,
                payload: alerta
            })

        }

    }

    // Validar el formulario por errores
    const mostrarError = () => {
        dispath({
            type: VALIDAR_FORMULARIO
        })
    }

    // Selecciona el Proyecto que el usuario dio click
    const proyectoActual = proyectoId => {
        dispath({
            type: PROYECTO_ACTUAL,
            payload: proyectoId
        })
    }

    // Eliminar un proyecto
    const eliminarProyecto = async proyectoId => {
        try {
            
            await clienteAxios.delete(`/api/proyectos/${proyectoId}`);

            dispath({
                type: ELIMINAR_PROYECTO,
                payload: proyectoId
            });

        } catch (error) {

            const alerta = {
                msg: 'Hubo un error',
                categoria: 'alerta-error'
            }
            
            dispath({
                type: PROYECTO_ERROR,
                payload: alerta
            })

        }
    }

    return (
        <proyectoContext.Provider
            value={{
                proyectos: state.proyectos,
                formulario: state.formulario,
                errorformulario: state.errorformulario,
                proyecto: state.proyecto,
                mensaje: state.mensaje,
                mostrarFormulario,
                obtenerProyectos,
                agregarProyecto,
                mostrarError,
                proyectoActual,
                eliminarProyecto
            }}
        >
            {props.children}
        </proyectoContext.Provider>
    )
}

export default ProyectoState;