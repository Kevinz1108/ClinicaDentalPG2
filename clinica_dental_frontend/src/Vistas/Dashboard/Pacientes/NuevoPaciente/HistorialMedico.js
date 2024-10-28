import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import styles from './AgregarPaciente.module.css'; // Estilo existente de AgregarPaciente

const HistorialMedico = ({ formData, handleChange }) => {

    const enfermedades = [
        { label: 'Diabetes', value: 'Diabetes' },
        { label: 'Hipertensión', value: 'Hipertensión' },
        { label: 'Otra', value: 'Otra' },
        { label: 'Ninguna', value: 'Ninguna' }
    ];

    const alergias = [
        { label: 'Medicamentos', value: 'Medicamentos' },
        { label: 'Alimentos', value: 'Alimentos' },
        { label: 'Ninguna', value: 'Ninguna' }
    ];

    const tratamientosMedicos = [
        { label: 'Sí', value: 'Si' },
        { label: 'Ninguna', value: 'Ninguna' }
    ];

    const motivosConsulta = [
        { label: 'Dolor', value: 'Dolor' },
        { label: 'Revisión', value: 'Revisión' },
        { label: 'Tratamiento Estético', value: 'Tratamiento Estético' }
    ];

    const tratamientosPrevios = [
        { label: 'Extracciones', value: 'Extracciones' },
        { label: 'Ortodoncia', value: 'Ortodoncia' },
        { label: 'Endodoncia', value: 'Endodoncia' },
        { label: 'Ninguna', value: 'Ninguna' }
    ];

    return (
        <div className="card p-4" style={{ maxWidth: '95%', margin: 'auto', background: 'white', borderRadius: '1rem' }}>
            <div className={styles.grid}>
                <div className={styles.field}>
                    <label htmlFor="enfermedades_sistemicas">Enfermedades Sistémicas</label>
                    <Dropdown
                        id="enfermedades_sistemicas"
                        value={formData.historial_medico.enfermedades_sistemicas}
                        options={enfermedades}
                        onChange={(e) => handleChange({ target: { name: 'enfermedades_sistemicas', value: e.value } })}
                        placeholder="Seleccione una opción"
                    />
                </div>
                <div className={styles.field}>
                    <label htmlFor="alergias">Alergias</label>
                    <Dropdown
                        id="alergias"
                        value={formData.historial_medico.alergias}
                        options={alergias}
                        onChange={(e) => handleChange({ target: { name: 'alergias', value: e.value } })}
                        placeholder="Seleccione una opción"
                    />
                    {formData.historial_medico.alergias !== 'Ninguna' && (
                        <InputText
                            name="detalle_alergia"
                            placeholder="Especificar alergia"
                            value={formData.historial_medico.detalle_alergia}
                            onChange={handleChange}
                        />
                    )}
                </div>
                <div className={styles.field}>
                    <label htmlFor="tratamiento_medico">Tratamientos Médicos en Curso</label>
                    <Dropdown
                        id="tratamiento_medico"
                        value={formData.historial_medico.tratamiento_medico}
                        options={tratamientosMedicos}
                        onChange={(e) => handleChange({ target: { name: 'tratamiento_medico', value: e.value } })}
                        placeholder="Seleccione una opción"
                    />
                    {formData.historial_medico.tratamiento_medico === 'Si' && (
                        <InputText
                            name="detalle_tratamiento"
                            placeholder="Especificar tratamiento"
                            value={formData.historial_medico.detalle_tratamiento}
                            onChange={handleChange}
                        />
                    )}
                </div>

                <div className={styles.field}>
                    <label htmlFor="motivo_consulta">Motivo de Consulta</label>
                    <Dropdown
                        id="motivo_consulta"
                        value={formData.historial_medico.motivo_consulta}
                        options={motivosConsulta}
                        onChange={(e) => handleChange({ target: { name: 'motivo_consulta', value: e.value } })}
                        placeholder="Seleccione una opción"
                    />
                </div>



                <div className={styles.field}>
                    <label htmlFor="tratamientos_previos">Tratamientos Previos</label>
                    <Dropdown
                        id="tratamientos_previos"
                        value={formData.historial_medico.tratamientos_previos}
                        options={tratamientosPrevios}
                        onChange={(e) => handleChange({ target: { name: 'tratamientos_previos', value: e.value } })}
                        placeholder="Seleccione una opción"
                    />
                </div>
            </div>
        </div>
    );
};


export default HistorialMedico;
