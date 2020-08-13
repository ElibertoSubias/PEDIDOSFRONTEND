import React, { useReducer } from 'react';
import TareaContext from './tareaContext';
import tareaReducer from './tareaReducer';
// import {v4 as uuid} from 'uuid';
import clienteAxios from '../../config/axios';

import { 
    TAREAS_PROYECTO,
    AGREGAR_TAREA,
    VALIDAR_TAREA,
    ELIMINAR_TAREA,
    TAREA_ACTUAL,
    ACTUALIZAR_TAREA,
    LIMPIAR_TAREA
} from '../../types';

const TareaState = props => {
    const initialState = {
        tareasproyecto: [],
        errortarea: false,
        tareaseleccionada: null
    }

    // Crear dispatch y state
    const [state, dispath] = useReducer(tareaReducer, initialState);

    // Crear las funciones

    // Obtener las tareas de un proyecto
    const obtenerTareas = async proyecto => {
        // console.log(proyecto);
        try {

            if (proyecto) {

                const resultado = await clienteAxios.get('/api/tareas', { params: {proyecto}});
                // console.log(resultado);
                dispath({
                    type: TAREAS_PROYECTO,
                    payload: resultado.data.tareas
                });
                
            }

        } catch (error) {
            console.log(error);
        }

    }

    // Agregar una tarea al proyecto seleccionado
    const agregarTarea = async tarea => {
        
        try {

            const respuesta = await clienteAxios.post('/api/tareas', tarea);
            
            dispath({
                type: AGREGAR_TAREA,
                payload: respuesta.data.tarea
            });

        } catch (error) {
            console.log(error);
        }

    }

    // Valida y muestra un error en caso de que sea necesario
    const validarTarea = () => {
        dispath({
            type: VALIDAR_TAREA
        })
    }

    // Eliminar tarea por id
    const eliminarTarea = async (id, proyecto) => {
        
        try {

            await clienteAxios.delete(`/api/tareas/${id}`, { params: { proyecto }});
            
            dispath({
                type: ELIMINAR_TAREA,
                payload: id
            })

        } catch (error) {
            console.log(error);
        }

    }

    // Editar o modificar una tarea
    const actualizarTarea = async tarea => {
        
        try {

            const resultado = await clienteAxios.put(`/api/tareas/${tarea._id}`, tarea);
            // console.log(resultado.data.tarea);

            dispath({
                type: ACTUALIZAR_TAREA,
                payload: resultado.data.tarea
            })
            
        } catch (error) {
            console.log(error);
        }

    }

    // Extraer una tarea para edición
    const guardarTareaActual = tarea => {
        dispath({
            type: TAREA_ACTUAL,
            payload: tarea
        })
    }

    // Eliminar la tareaseleccionada
    const limpiarTarea = () => {
        dispath({
            type: LIMPIAR_TAREA
        })
    }

    return (
        <TareaContext.Provider
            value={{
                tareasproyecto : state.tareasproyecto,
                errortarea: state.errortarea,
                tareaseleccionada: state.tareaseleccionada,
                obtenerTareas,
                agregarTarea,
                validarTarea,
                eliminarTarea,
                guardarTareaActual,
                actualizarTarea,
                limpiarTarea
            }}
        >
            {props.children}
        </TareaContext.Provider>
    )
}

export default TareaState;