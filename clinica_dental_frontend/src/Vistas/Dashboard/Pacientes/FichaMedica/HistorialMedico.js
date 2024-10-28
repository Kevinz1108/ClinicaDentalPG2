import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Message } from 'primereact/message';
import styles from './HistorialMedico.module.css';

const HistorialPaciente = ({ pacienteId }) => {
  const [historial, setHistorial] = useState({
    enfermedades_sistemicas: '',
    alergias: '',
    tratamiento_medico: '',
    motivo_consulta: '',
    tratamientos_previos: '',
    detalle_alergia: '',
    detalle_tratamiento: '',
    fecha_consulta: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (pacienteId) {
        setIsLoading(true);
        axios
            .get(`http://localhost:8000/api/obtener-historial-paciente/${pacienteId}/`)
            .then((response) => {
              
                if (response.data.message) {
                    setIsEditing(true);
                } else {
                    setHistorial(response.data[0] || {});
                    setIsEditing(false);
                }
            })
            .catch((error) => {
                console.error('Error al obtener historial:', error);
                setMensaje('Error al cargar el historial.');
            })
            .finally(() => setIsLoading(false));
    }
}, [pacienteId]);



  const handleEditClick = () => setIsEditing(true);

  const handleCancelEdit = () => setIsEditing(false);

  const handleSaveChanges = () => {
    const historialData = {
      ...historial,
      paciente: pacienteId,
    };

    axios
      .post(`http://localhost:8000/api/crear-actualizar-historial-paciente/${pacienteId}/`, historialData)
      .then(() => {
        setMensaje('Historial guardado con éxito.');
        setIsEditing(false);
      })
      .catch((error) => {
        console.error('Error al guardar historial:', error.response?.data);
        setMensaje(`Error al guardar el historial: ${JSON.stringify(error.response?.data)}`);
      });
  };

  if (isLoading) {
    return <p>Cargando historial...</p>;
  }

  const formatFecha = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const anio = date.getFullYear();
    return `${dia}/${mes}/${anio}`;
  };

  return (
    <div className={styles.historialPaciente}>
      {mensaje && (
        <Message severity={mensaje.includes('éxito') ? 'success' : 'error'} text={mensaje} className="mb-4" />
      )}

      <h3 className="text-center">Historial Médico</h3>
      <Divider />

      <div className={styles.grid}>
        <div className={styles.field}>
          <label>Enfermedades Sistémicas</label>
          <p>{historial.enfermedades_sistemicas || 'Ninguna'}</p>
        </div>
        <div className={styles.field}>
          <label>Alergias</label>
          <p>{historial.alergias || 'Ninguna'}</p>
          {historial.alergias !== 'Ninguna' && (
            <p><strong>Detalle:</strong> {historial.detalle_alergia || 'No especificado'}</p>
          )}
        </div>
        <div className={styles.field}>
          <label>Tratamientos Médicos en Curso</label>
          <p>{historial.tratamiento_medico || 'Ninguno'}</p>
          {historial.tratamiento_medico === 'Si' && (
            <p><strong>Detalle:</strong> {historial.detalle_tratamiento || 'No especificado'}</p>
          )}
        </div>
        <div className={styles.field}>
          <label>Motivo de Consulta</label>
          <p>{historial.motivo_consulta || 'No especificado'}</p>
        </div>
        <div className={styles.field}>
          <label>Fecha de Consulta</label>
          <p>{formatFecha(historial.fecha_consulta) || 'No especificada'}</p>
        </div>
        <div className={styles.field}>
          <label>Tratamientos Previos</label>
          <p>{historial.tratamientos_previos || 'Ninguno'}</p>
        </div>
      </div>

      <Divider />
      <div className="mt-3">
        {isEditing ? (
          <>
            <Button label="Guardar Historial" icon="pi pi-check" className="mr-2" onClick={handleSaveChanges} />
            <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={handleCancelEdit} />
          </>
        ) : (
          <Button label="Editar Historial" icon="pi pi-pencil" className="mt-3" onClick={handleEditClick} />
        )}
      </div>
    </div>
  );
};

export default HistorialPaciente;
