// src/Vistas/Dashboard/Pacientes/AgendarCita.js
import React, { useState, useEffect, useRef } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import styles from './AgendarCita.module.css';

const AgendarCita = () => {
    const [pacientes, setPacientes] = useState([]);
    const [odontologos, setOdontologos] = useState([]);
    const [selectedOdontologo, setSelectedOdontologo] = useState('');
    const [tipoCita, setTipoCita] = useState('');
    const [fechaCita, setFechaCita] = useState(null);
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFin, setHoraFin] = useState('');
    const [selectedPaciente, setSelectedPaciente] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        obtenerDatos();
    }, []);

    const obtenerDatos = async () => {
        try {
            const [pacientesRes, odontologosRes] = await Promise.all([
                axios.get('http://localhost:8000/api/obtener-pacientes/'),
                axios.get('http://localhost:8000/api/obtener-dentistas/'),
            ]);

            const pacientesConFormato = pacientesRes.data.map((paciente) => ({
                ...paciente,
                displayName: `${paciente.nombre} ${paciente.apellido} - Tel: ${paciente.telefono}`,
            }));

            const odontologosConFormato = odontologosRes.data.map((odontologo) => ({
                ...odontologo,
                displayName: `Dr ${odontologo.nombre} ${odontologo.apellido}`,
            }));

            setPacientes(pacientesConFormato);
            setOdontologos(odontologosConFormato);
        } catch (error) {
            console.error('Error al obtener datos:', error);
        }
    };

    const handlePacienteSelect = (e) => {
        setSelectedPaciente(e.value);
    };

    const handleHoraInicioChange = (e) => {
        const horaInicioSeleccionada = e.value;
        setHoraInicio(horaInicioSeleccionada);
        const [horas, minutos] = horaInicioSeleccionada.split(':').map(Number);
        let nuevaHora = horas;
        let nuevosMinutos = minutos + 15;
        if (nuevosMinutos >= 60) {
            nuevaHora += 1;
            nuevosMinutos -= 60;
        }
        const horaFinAutomatica = `${nuevaHora.toString().padStart(2, '0')}:${nuevosMinutos.toString().padStart(2, '0')}`;
        setHoraFin(horaFinAutomatica);
    };

    const generarHorasIntervalo = () => {
        const horas = [];
        for (let h = 8; h < 18; h++) {
            for (let m = 0; m < 60; m += 15) {
                const hora = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                horas.push(hora);
            }
        }
        return horas;
    };

    const showError = (campo) => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: `El campo ${campo} es obligatorio.`, life: 3000 });
    };

    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Cita agendada con éxito.', life: 3000 });
    };

    const handleCitaSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPaciente) {
            showError('Paciente');
            return;
        }
        if (!selectedOdontologo) {
            showError('Odontólogo');
            return;
        }
        if (!tipoCita) {
            showError('Tipo de Cita');
            return;
        }
        if (!fechaCita) {
            showError('Fecha de Cita');
            return;
        }
        if (!horaInicio) {
            showError('Hora de Inicio');
            return;
        }
        if (!horaFin) {
            showError('Hora de Fin');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/api/agendar-cita/', {
                paciente: selectedPaciente.id,
                tipo_cita: tipoCita,
                fecha_cita: fechaCita.toISOString().split('T')[0],
                hora_inicio: horaInicio,
                hora_fin: horaFin,
                odontologo: selectedOdontologo.id,
            });
            showSuccess();
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            showError('Agendar Cita');
            console.error('Error al agendar cita:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <Toast ref={toast} />
            <form onSubmit={handleCitaSubmit} className={styles.form}>
                <div className={styles.field}>
                    <label htmlFor="paciente">Paciente</label>
                    <Dropdown
                        value={selectedPaciente}
                        onChange={handlePacienteSelect}
                        options={pacientes}
                        optionLabel="displayName"
                        placeholder="Seleccionar paciente..."
                        className="w-full"
                        filter
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="odontologo">Odontólogo</label>
                    <Dropdown
                        value={selectedOdontologo}
                        onChange={(e) => setSelectedOdontologo(e.value)}
                        options={odontologos}
                        optionLabel="displayName"
                        placeholder="Seleccionar odontólogo..."
                        className="w-full"
                        filter
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="tipoCita">Tipo de Cita</label>
                    <Dropdown
                        value={tipoCita}
                        onChange={(e) => setTipoCita(e.value)}
                        options={[
                            { label: 'Consulta', value: 'Consulta' },
                            { label: 'Limpieza', value: 'Limpieza' },
                            { label: 'Ortodoncia', value: 'Ortodoncia' },
                        ]}
                        placeholder="Seleccionar tipo de cita..."
                        className="w-full"
                    />
                </div>

                <div className="flex py-2 gap-5">
                    <div className={styles.field}>
                        <label htmlFor="fechaCita">Fecha de Cita</label>
                        <Calendar
                            value={fechaCita}
                            onChange={(e) => setFechaCita(e.value)}
                            dateFormat="dd/mm/yy"
                            showIcon
                            className="w-full"
                        />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="horaInicio">Hora de Inicio</label>
                        <Dropdown
                            value={horaInicio}
                            onChange={handleHoraInicioChange}
                            options={generarHorasIntervalo()}
                            placeholder="Seleccionar hora de inicio..."
                            className="w-full"
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="horaFin">Hora de Fin</label>
                        <Dropdown
                            value={horaFin}
                            onChange={(e) => setHoraFin(e.value)}
                            options={generarHorasIntervalo()}
                            placeholder="Seleccionar hora de fin..."
                            className="w-full"
                        />
                    </div>
                </div>

                <Button
                    label={loading ? 'Cargando...' : 'Agendar Cita'}
                    icon="pi pi-check"
                    loading={loading}
                    disabled={loading}
                    className="w-full mt-4"
                    type="submit"
                />
            </form>
        </div>
    );
};

export default AgendarCita;
