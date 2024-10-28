// src/Vistas/Dashboard/Pacientes/RegistrarPago.js
import React, { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import styles from './RegistrarPago.module.css';

const RegistrarPago = () => {
    const [pacientes, setPacientes] = useState([]);
    const [tratamientos, setTratamientos] = useState([]);
    const [selectedPaciente, setSelectedPaciente] = useState('');
    const [selectedTratamiento, setSelectedTratamiento] = useState('');
    const [abonoFecha, setAbonoFecha] = useState(new Date());
    const [abonoMonto, setAbonoMonto] = useState('');
    const toast = useRef(null);

    useEffect(() => {
        // Obtener lista de pacientes
        axios.get('http://localhost:8000/api/obtener-pacientes/')
            .then(response => {
                const pacienteConFormato = response.data.map(paciente => ({
                    ...paciente,
                    displayName: `${paciente.nombre} ${paciente.apellido} - Teléfono ${paciente.telefono}`
                }));
                setPacientes(pacienteConFormato);
            })
            .catch(error => {
                console.error('Error al obtener la lista de pacientes:', error);
            });
    }, []);

    useEffect(() => {
        if (selectedPaciente) {
            // Obtener tratamientos del paciente seleccionado
            axios.get(`http://localhost:8000/api/obtener-tratamientos-paciente/${selectedPaciente}/`)
                .then(response => {
                    setTratamientos(response.data.tratamientos);
                })
                .catch(error => {
                    console.error('Error al obtener los tratamientos:', error);
                });
        }
    }, [selectedPaciente]);

    const handleAbonar = () => {
        if (selectedPaciente && selectedTratamiento && abonoFecha && abonoMonto) {
            // Guardar el abono en la base de datos
            axios.post(`http://localhost:8000/api/pacientes/${selectedPaciente}/abonar/`, {
                tratamiento_id: selectedTratamiento,
                fecha: abonoFecha.toISOString().split('T')[0],
                monto: parseFloat(abonoMonto),
            })
                .then(() => {
                    toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Abono realizado con éxito', life: 3000 });
                    setAbonoFecha(new Date());
                    setAbonoMonto('');
                    setSelectedTratamiento('');
                })
                .catch(error => {
                    console.error('Error al realizar el abono:', error);
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al realizar el abono', life: 3000 });
                });
        } else {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'Complete todos los campos para realizar el abono', life: 3000 });
        }
    };

    return (
        <div className={styles.container}>
            <Toast ref={toast} />
            <h3 className="text-center mb-4" style={{ color: '#b4c8dc' }}>Registrar Pago</h3>

            <div className={styles.field}>
                <label htmlFor="paciente">Paciente</label>
                <Dropdown
                    value={selectedPaciente}
                    onChange={(e) => {
                        setSelectedPaciente(e.value);
                        setSelectedTratamiento('');
                    }}
                    options={pacientes}
                    optionLabel="displayName"
                    optionValue="id"
                    placeholder="Seleccione un paciente"
                    className="w-full"
                    filter
                />
            </div>

            <div className={styles.field}>
                <label htmlFor="tratamiento">Tratamiento</label>
                <Dropdown
                    value={selectedTratamiento}
                    onChange={(e) => setSelectedTratamiento(e.value)}
                    options={tratamientos}
                    optionLabel="tratamiento_nombre"
                    optionValue="id"
                    placeholder="Seleccione un tratamiento"
                    className="w-full"
                />
            </div>

            <div className={styles.field}>
                <label htmlFor="fecha">Fecha de Abono</label>
                <Calendar
                    value={abonoFecha}
                    onChange={(e) => setAbonoFecha(e.value)}
                    dateFormat="dd/mm/yy"
                    showIcon
                    className="w-full"
                />
            </div>

            <div className={styles.field}>
                <label htmlFor="monto">Monto</label>
                <InputText
                    value={abonoMonto}
                    onChange={(e) => setAbonoMonto(e.target.value)}
                    placeholder="Q"
                    className="w-full"
                />
            </div>

            <Button
                label="Abonar"
                icon="pi pi-check"
                onClick={handleAbonar}
                className="w-full mt-4"
                style={{ backgroundColor: '#b4c8dc', borderColor: '#b4c8dc' }}
            />
        </div>
    );
};

export default RegistrarPago;
