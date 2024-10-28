import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Message } from 'primereact/message';
import styles from './HistorialOdontologico.module.css';

const defaultDiagnostico = {
  dientes: 'Presentes',
  notas_dientes: '',
  caries: 'No',
  notas_caries: '',
  encias: 'Saludables',
  notas_encias: '',
  maloclusiones: 'Clase I',
  notas_maloclusiones: '',
  lesiones: 'Ninguna',
  notas_lesiones: '',
  hueso_maxilar: 'Sano',
  notas_hueso_maxilar: '',
};

const DiagnosticoPaciente = ({ pacienteId }) => {
  const [diagnostico, setDiagnostico] = useState(defaultDiagnostico);
  const [isEditing, setIsEditing] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!pacienteId) {
        setMensaje('Error: ID del paciente no proporcionado.');
        return;
    }

    setIsLoading(true);
    
    axios
        .get(`http://localhost:8000/api/obtener-diagnostico-paciente/${pacienteId}/`)
        .then((response) => {
            if (!response.data || response.data.message) {
                setIsEditing(true);
                setDiagnostico(defaultDiagnostico);
            } else {
                setDiagnostico({ ...defaultDiagnostico, ...response.data });
                setIsEditing(false);
            }
        })
        .catch((error) => {
            if (error.response && error.response.status === 404) {
                setIsEditing(true);
                setDiagnostico(defaultDiagnostico);
            } else {
                console.error('Error al obtener diagnóstico:', error);
                setMensaje('Error al cargar el diagnóstico.');
            }
        })
        .finally(() => setIsLoading(false));
}, [pacienteId]);


  const handleSaveChanges = () => {
    const diagnosticoData = {
      ...diagnostico,
      paciente: pacienteId,
    };

    axios
      .post(`http://localhost:8000/api/crear-actualizar-diagnostico-paciente/${pacienteId}/`, diagnosticoData)
      .then(() => {
        setMensaje('Diagnóstico guardado con éxito.');
        setIsEditing(false);
      })
      .catch((error) => {
        console.error('Error al guardar diagnóstico:', error.response?.data);
        setMensaje(`Error al guardar el diagnóstico: ${JSON.stringify(error.response?.data)}`);
      });
  };

  const handleEdit = () => setIsEditing(true);

  if (isLoading) {
    return <p>Cargando diagnóstico...</p>;
  }

  return (
    <div className={styles.diagnosticoPaciente}>
      <h3 className="text-center">Diagnóstico del Paciente</h3>
      <Divider />

      {mensaje && (
        <Message
          severity={mensaje.includes('éxito') ? 'success' : 'error'}
          text={mensaje}
          className="mb-4"
        />
      )}

      <div className={styles.grid}>
        <div className={styles.field}>
          <label>Dientes</label>
          <p>{diagnostico.dientes}</p>
          <strong>Notas:</strong> {diagnostico.notas_dientes || 'Ninguna'}
        </div>

        <div className={styles.field}>
          <label>Caries Visibles</label>
          <p>{diagnostico.caries}</p>
          <strong>Notas:</strong> {diagnostico.notas_caries || 'Ninguna'}
        </div>

        <div className={styles.field}>
          <label>Encías</label>
          <p>{diagnostico.encias}</p>
          <strong>Notas:</strong> {diagnostico.notas_encias || 'Ninguna'}
        </div>

        <div className={styles.field}>
          <label>Maloclusiones</label>
          <p>{diagnostico.maloclusiones}</p>
          <strong>Notas:</strong> {diagnostico.notas_maloclusiones || 'Ninguna'}
        </div>

        <div className={styles.field}>
          <label>Lesiones en la Mucosa Bucal</label>
          <p>{diagnostico.lesiones}</p>
          <strong>Notas:</strong> {diagnostico.notas_lesiones || 'Ninguna'}
        </div>

        <div className={styles.field}>
          <label>Estado del Hueso Maxilar</label>
          <p>{diagnostico.hueso_maxilar}</p>
          <strong>Notas:</strong> {diagnostico.notas_hueso_maxilar || 'Ninguna'}
        </div>
      </div>

      <Divider />
      <div className="mt-3">
        {isEditing ? (
          <>
            <Button label="Guardar Diagnóstico" icon="pi pi-check" onClick={handleSaveChanges} className="mr-2" />
            <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={() => setIsEditing(false)} />
          </>
        ) : (
          <Button label="Editar Diagnóstico" icon="pi pi-pencil" className="mt-3" onClick={handleEdit} />
        )}
      </div>
    </div>
  );
};

export default DiagnosticoPaciente;
