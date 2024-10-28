import React, { useState, useEffect, useRef } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import styles from './AgregarPaciente.module.css';

const Citas = ({ formData, handleChange }) => {
    const [tipoCita, setTipoCita] = useState(formData?.citas[0]?.tipo_cita || '');
    const [fechaCita, setFechaCita] = useState(formData?.citas[0]?.fecha_cita || null);
    const [horaInicio, setHoraInicio] = useState(formData?.citas[0]?.hora_inicio || '');
    const [horaFin, setHoraFin] = useState(formData?.citas[0]?.hora_fin || '');

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

    useEffect(() => {
        const nuevaCita = {
            tipo_cita: tipoCita,
            fecha_cita: fechaCita,
            hora_inicio: horaInicio,
            hora_fin: horaFin,
            odontologo_id: formData.odontologo_id,  // Se agrega el odontólogo seleccionado automáticamente
        };
    
        // Actualizar la cita en formData (reemplazar la cita existente)
        const updatedCitas = [...formData.citas];
        updatedCitas[0] = nuevaCita; // Reemplazar la cita en lugar de agregar una nueva
        handleChange({ target: { name: 'citas', value: updatedCitas } });
    }, [tipoCita, fechaCita, horaInicio, horaFin]);

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

    return (
        <div className={styles.container}>
            <form className={styles.form}>
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

                <div className="flex py-2 gap-2">
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
            </form>
        </div>
    );
};

export default Citas;
