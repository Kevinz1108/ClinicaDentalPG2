import React, { useState, useEffect } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';

import DashboardPaciente from './DashboardPaciente';
import DatosPaciente from './DatosPaciente';
import HistorialPaciente from './HistorialMedico';
import DiagnosticoPaciente from './HistorialOdontologico';
import RadiografiaPaciente from './RadiografiaPaciente';
import TratamientoPaciente from './TratamientoPaciente';

import Pagos from './Pago';

import CitasAgendadas from './Cita';
import styles from './FichasClinicas.module.css';

const FichasClinicas = ({ formData, handleChange, departamentos, generos }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedPaciente, setSelectedPaciente] = useState(null);
    const [pacientes, setPacientes] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/obtener-pacientes/')
            .then(response => {
                const pacienteConFormato = response.data.map(paciente => ({
                    ...paciente,
                    displayName: `${paciente.nombre} ${paciente.apellido} - Telefono ${paciente.telefono}`
                }));
                setPacientes(pacienteConFormato);
            })
            .catch(error => {
                console.error('Error al obtener la lista de pacientes:', error);
            });
    }, []);

    const items = [
       // { label: 'Dashboard', icon: 'pi pi-user' },
        { label: 'Datos Del Paciente', icon: 'pi pi-user' },
        { label: 'Historial Médico', icon: 'pi pi-book-medical' },
        { label: 'Historial Odontológico', icon: 'pi pi-tooth' },
        { label: 'Radiografías', icon: 'pi pi-image' },
        { label: 'Tratamiento', icon: 'pi pi-briefcase-medical' },
        { label: 'Pago', icon: 'pi pi-wallet' },
        { label: 'Citas', icon: 'pi pi-calendar' }
    ];

    const handlePacienteChange = (e) => {
        const pacienteSeleccionado = pacientes.find(p => p.id === e.value);
        setSelectedPaciente(pacienteSeleccionado || null);
        
    };

    const renderContent = () => {
        if (!selectedPaciente) {
            return <p>Seleccione un paciente para ver su información.</p>;
        }

        switch (activeIndex) {

            case 0:
                return <DatosPaciente selectedPaciente={selectedPaciente} />;
            case 1:
                return <HistorialPaciente pacienteId={selectedPaciente.id} />;
            case 2:
                return <DiagnosticoPaciente pacienteId={selectedPaciente.id} />;
            case 3:
                return <RadiografiaPaciente pacienteId={selectedPaciente.id} />;
            case 4:
                return <TratamientoPaciente pacienteId={selectedPaciente.id} />;
            case 5:
                return <Pagos pacienteId={selectedPaciente.id} />;
            case 6:
                return <CitasAgendadas pacienteId={selectedPaciente.id}/>;
            default:
                return null;
        }
    };

    return (
        <div className="card">
            <div className={styles.field}>
                <label htmlFor="paciente">Paciente</label>
                <Dropdown
                    value={selectedPaciente?.id || null}
                    onChange={handlePacienteChange}
                    options={pacientes}
                    optionLabel="displayName"
                    optionValue="id"
                    placeholder="Seleccione un paciente"
                    className="w-full mb-4"
                    filter
                />
            </div>

            <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />

            <div className={styles.tabContent}>
                {renderContent()}
            </div>
        </div>
    );
};

export default FichasClinicas;
