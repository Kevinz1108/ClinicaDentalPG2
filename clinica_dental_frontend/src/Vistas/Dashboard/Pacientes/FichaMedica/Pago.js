// src/Vistas/Dashboard/Pacientes/Saldos.js
import React, { useRef,useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast'; 
import axios from 'axios';
import styles from './Pagos.module.css';
import PagoResumen from './PagoResumen';
import PagoDetalle from './PagoDetalle';

import 'react-toastify/dist/ReactToastify.css';

const Pagos = ({ ocultarFiltro, pacienteId, mostrarTitulo }) => {
    const [pacientes, setPacientes] = useState([]);
    const [selectedPaciente, setSelectedPaciente] = useState(pacienteId || '');
    const [saldoData, setSaldoData] = useState([]);
    const [detallePagos, setDetallePagos] = useState([]);
    const [saldoTotal, setSaldoTotal] = useState(0);
    const [pacienteNombre, setPacienteNombre] = useState('');
    const [pacienteApellido, setPacienteApellido] = useState('');
    const [tratamientos, setTratamientos] = useState([]);
    const [selectedTratamiento, setSelectedTratamiento] = useState('');
    const [editPagoId, setEditPagoId] = useState(null);
    const [editAbono, setEditAbono] = useState('');
    const [editTratamiento, setEditTratamiento] = useState('');
    const toast = useRef(null);

    useEffect(() => {
        if (!pacienteId) {  
            axios.get('http://localhost:8000/api/obtener-pacientes/')
                .then(response => {
                    const pacienteConFormato = response.data.map(paciente => ({
                        ...paciente,
                        displayName:`${paciente.nombre} ${paciente.apellido} - Telefono ${paciente.telefono}`
                    }));
                    setPacientes(pacienteConFormato);
                })
                .catch(error => {
                    console.error('Error al obtener la lista de pacientes:', error);
                });
        }
    }, [pacienteId]);

    const fetchSaldoPaciente = () => {
        if (selectedPaciente) {
            axios.get(`http://localhost:8000/api/pacientes/${selectedPaciente}/saldo/`)
                .then(response => {
                    setSaldoData(response.data.saldos);
                    const paciente = pacientes.find(p => p.id === parseInt(selectedPaciente));
                    if (paciente) {
                        setPacienteNombre(paciente.nombre);
                        setPacienteApellido(paciente.apellido);
                    }
    
                    // Revisar el id y tratamiento_nombre
                    const tratamientosUnicos = response.data.saldos.map(item => ({
                        id: item.tratamiento_id || 'undefined-id',  // Revisar si id es nulo
                        tratamiento_nombre: item.tratamiento_nombre || 'Tratamiento sin nombre',
                    })).filter(item => item.id !== 'undefined-id');  // Filtrar elementos sin id válido
    
                    setTratamientos(tratamientosUnicos);
                })
                .catch(error => {
                    console.error('Error al obtener el saldo del paciente:', error);
                    toast.current.show('Error al obtener el saldo del paciente.');
                });
        }
    };
    

    useEffect(() => {
        if (selectedPaciente) {
            axios.get(`http://localhost:8000/api/pacientes/${selectedPaciente}/pagos/`)
                .then(response => {
                    setDetallePagos(response.data.pagos);
                })
                .catch(error => {
                    console.error('Error al obtener los pagos del paciente:', error);
                    toast.current.show('Error al obtener los pagos del paciente.');
                });
        }
    }, [selectedPaciente]);

    useEffect(() => {
        if (selectedPaciente) {
            fetchSaldoPaciente();
        }
    }, [selectedPaciente, pacientes]);

    useEffect(() => {
        if (saldoData.length > 0) {
            const total = saldoData.reduce((acc, item) => acc + item.saldo, 0);
            setSaldoTotal(total);
        }
    }, [saldoData]);

    const handlePacienteChange = (e) => {
        setSelectedPaciente(e.value);
        setSelectedTratamiento('');
    };

    const handleModificar = (pago) => {
        setEditPagoId(pago.id);
        setEditAbono(pago.monto);
        setEditTratamiento(pago.tratamiento_id);
    };

    const handleGuardar = async (pagoId) => {
        try {
            const response = await axios.put(`http://localhost:8000/api/pagos/${pagoId}/modificar/`, {
                tratamiento_id: editTratamiento,
                monto: editAbono,
            });

            if (response.status === 200) {
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Pago modificado con éxito', life: 3000 });
                const pagosActualizados = detallePagos.map(pago => 
                    pago.id === pagoId ? { ...pago, tratamiento_id: editTratamiento, monto: editAbono } : pago
                );
                setDetallePagos(pagosActualizados);
                setEditPagoId(null);
                fetchSaldoPaciente();
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al modificar el pago', life: 3000 });
            }
        } catch (error) {
            console.error('Error al modificar el pago:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al guardar los cambios', life: 3000 });
        }
    };

    const handleCerrar = () => {
        setEditPagoId(null);
    };

    const handleEliminar = (pagoId) => {
        axios.delete(`http://localhost:8000/api/pagos/${pagoId}/eliminar/`)
            .then(() => {
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Pago eliminado con éxito', life: 3000 });
                setDetallePagos(detallePagos.filter(pago => pago.id !== pagoId));
                fetchSaldoPaciente();
            })
            .catch(error => {
                console.error('Error al eliminar el pago:', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el pago', life: 3000 });
            });
    };

    return (
        <div className={styles.container}>
            <Toast ref={toast} />

            {!pacienteId && !ocultarFiltro && (
                <div className={styles.field}>
                    <label htmlFor="paciente">Seleccionar Paciente</label>
                    <Dropdown
                        value={selectedPaciente}
                        onChange={handlePacienteChange}
                        options={pacientes}
                        optionLabel="displayName"
                        optionValue='id'
                        placeholder="Seleccione un paciente"
                        className="w-full"
                        filter
                    />
                </div>
            )}

            {selectedPaciente && (
                <>
                    <div className={styles.saldoTotal}>
                        <h4>Saldo Total: Q {saldoTotal.toFixed(2)}</h4>
                    </div>

                    <PagoResumen
                        saldoData={saldoData}
                        pacienteNombre={pacienteNombre}
                        pacienteApellido={pacienteApellido}
                    />

                    <PagoDetalle
                        detallePagos={detallePagos}
                        tratamientos={tratamientos}
                        selectedTratamiento={selectedTratamiento}
                        setSelectedTratamiento={setSelectedTratamiento}
                        pacienteNombre={pacienteNombre}
                        pacienteApellido={pacienteApellido}
                        handleModificar={handleModificar}
                        handleGuardar={handleGuardar}
                        handleCerrar={handleCerrar}
                        handleEliminar={handleEliminar}
                        editPagoId={editPagoId}
                        editAbono={editAbono}
                        setEditAbono={setEditAbono}
                        editTratamiento={editTratamiento}
                        setEditTratamiento={setEditTratamiento}
                    />
                </>
            )}
        </div>
    );
};

export default Pagos;
