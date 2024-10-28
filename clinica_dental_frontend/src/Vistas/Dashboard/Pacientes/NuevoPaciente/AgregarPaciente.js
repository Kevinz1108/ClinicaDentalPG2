// src/Vistas/Dashboard/Pacientes/AgregarPaciente.js
import React, { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import axios from 'axios';
import DatosPaciente from './DatosPaciente';
import HistorialMedico from './HistorialMedico';
import HistorialOdontologico from './HistorialOdontologico';
import Tratamiento from './Tratamiento';
import Radiografia from './Radiografia';
import Pagos from './Pagos';
import Citas from './Citas';
import { departamentos, municipiosPorDepartamento } from '../../../Ubicaciones/ubicaciones'; // Ajusta la ruta si es necesario

import styles from './AgregarPaciente.module.css';


const AgregarPaciente = () => {
    const toast = useRef(null);
    const stepperRef = useRef(null);

    const [formData, setFormData] = useState({
        odontologo_id: 'ID_ESPECIALIDAD_SELECCIONADA',
        nombre: '', apellido: '', telefono: '', correo: '',
        departamento: '', municipio: '', direccion: '',
        fechaNacimiento: null, edad: '', genero: '', odontologo_id: '',
        historialOdontologico: { 
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
        },
        historial_medico: {
            enfermedades_sistemicas: 'Ninguna',
            alergias: 'Ninguna',
            detalle_alergia: '',
            tratamiento_medico: 'Ninguna',
            detalle_tratamiento: '',
            motivo_consulta: 'Revisión',
            
            tratamientos_previos: 'Ninguna'
        },
        radiografias: [],
        tratamientos: [],
        pagos: [],
        citas: []
    });

    const [loading, setLoading] = useState(false); 

    const [municipios, setMunicipios] = useState([]);

    const generos = [
        { label: 'Masculino', value: 'Masculino' },
        { label: 'Femenino', value: 'Femenino' }
    ];

    const ocupacion = [
        { label: 'Arquitecto', value: 'Arquitecto' },
        { label: 'Maestro', value: 'Maestro' }
    ];

    
    const handleChange = (e) => {
        const { name, value } = e.target;
       
    if (name in formData.historialOdontologico) {
        setFormData((prev) => ({
            ...prev,
            historialOdontologico: {
                ...prev.historialOdontologico,
                [name]: value
            }
        }));
    }
    // Si el campo pertenece a historial_medico
    else if (name in formData.historial_medico) {
        setFormData((prev) => ({
            ...prev,
            historial_medico: {
                ...prev.historial_medico,
                [name]: value
            }
        }));
    } 
    // Campos que no son parte de objetos anidados
    else {
        setFormData((prev) => ({ ...prev, [name]: value }));
    }
    };

    const handleDepartamentoChange = (e) => {
        const selectedDepartamento = e.value;
        setFormData((prev) => ({ ...prev, departamento: selectedDepartamento }));
        setMunicipios(municipiosPorDepartamento[selectedDepartamento] || []);
    };
    console.log(formData);

   


    const handleGuardarDatos = async () => {
        try {
            setLoading(true); 
            console.log("Datos enviados al servidor: ", formData);

         // Imprimir tratamientos para ver el valor de tipo_tratamiento
        formData.tratamientos.forEach((tratamiento, index) => {
            console.log(`Tratamiento ${index} - Tipo tratamiento (ID):`, tratamiento.tipo_tratamiento);
        });
            
            
            const formDataToSend = new FormData();
            
            // Datos del paciente
            formDataToSend.append('nombre', formData.nombre);
            formDataToSend.append('apellido', formData.apellido);
            formDataToSend.append('telefono', formData.telefono);
            formDataToSend.append('email', formData.correo);
            formDataToSend.append('departamento', formData.departamento);
            formDataToSend.append('municipio', formData.municipio);
            formDataToSend.append('direccion', formData.direccion);


            const fechaNacimiento = typeof formData.fechaNacimiento === 'string'
            ? new Date(formData.fechaNacimiento)
            : formData.fechaNacimiento;

            formDataToSend.append('fecha_nacimiento', fechaNacimiento ? fechaNacimiento.toISOString().split('T')[0] : '');
            formDataToSend.append('genero', formData.genero === 'Masculino' ? 'M' : 'F');
            formDataToSend.append('odontologo_id', formData.odontologo_id);
            formDataToSend.append('edad', formData.edad);
            formDataToSend.append('ocupacion', formData.ocupacion);
    
            // Enviar citas
            formData.citas.forEach((cita, index) => {
                formDataToSend.append(`citas[${index}][tipo_cita]`, cita.tipo_cita);
                formDataToSend.append(`citas[${index}][fecha_cita]`, cita.fecha_cita instanceof Date ? cita.fecha_cita.toISOString().split('T')[0] : cita.fecha_cita);
                formDataToSend.append(`citas[${index}][hora_inicio]`, cita.hora_inicio);
                formDataToSend.append(`citas[${index}][hora_fin]`, cita.hora_fin);
                formDataToSend.append(`citas[${index}][odontologo_id]`, cita.odontologo_id);
            });
    
            // Historial odontológico
            Object.keys(formData.historialOdontologico).forEach((key) => {
                formDataToSend.append(`historial_odontologico[${key}]`, formData.historialOdontologico[key]);
            });
    
            // Historial médico

            Object.keys(formData.historial_medico).forEach((key) => {
                formDataToSend.append(`historial_medico[${key}]`, formData.historial_medico[key]);
            });
    
            // Tratamientos
            formData.tratamientos.forEach((tratamiento, index) => {
                formDataToSend.append(`tratamientos[${index}][tipo_tratamiento]`, String(tratamiento.tipo_tratamiento)); 
                formDataToSend.append(`tratamientos[${index}][cantidad]`, String(tratamiento.cantidad));
                formDataToSend.append(`tratamientos[${index}][precio_unitario]`, String(tratamiento.precio_unitario));
                formDataToSend.append(`tratamientos[${index}][subtotal]`, String(tratamiento.subtotal));
            });
    
            // Radiografías
            formData.radiografias.forEach((radiografia, index) => {
                formDataToSend.append(`radiografias[${index}][imagen]`, radiografia.imagen);
                formDataToSend.append(`radiografias[${index}][fecha_tomada]`, radiografia.fecha_tomada);
                formDataToSend.append(`radiografias[${index}][notas]`, radiografia.notas);
            });
    
            // Enviar solicitud al backend para almacenar los datos del paciente
            const response = await axios.post('http://localhost:8000/api/registrar-paciente/', formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
    
          
    
            // Obtener `pacienteId` y `tratamientoId` desde la respuesta
            const pacienteId = response.data.paciente.id;
            const tratamientoId = response.data.tratamientos[0]?.id; // Verificar que el tratamiento ID esté presente
    
            if (!pacienteId || !tratamientoId) {
                console.error("ID de paciente o tratamiento no disponible");
                return;
            }
    
            // Procesar los pagos ahora que tenemos el ID del paciente y tratamiento
            for (const pago of formData.pagos) {
                const pagoData = new FormData();
    
                const fechaPago = typeof pago.fecha === 'string' ? new Date(pago.fecha) : pago.fecha;
                if (fechaPago instanceof Date && !isNaN(fechaPago)) {
                    pagoData.append('fecha', fechaPago.toISOString().split('T')[0]);
                } else {
                    console.error('Fecha de pago inválida:', pago.fecha);
                    continue;
                }
    
                pagoData.append('monto', pago.monto);
                pagoData.append('tratamiento_id', tratamientoId);
                console.log('Datos enviados con éxito:', response.data);
    
                try {
                    const pagoResponse = await axios.post(`http://localhost:8000/api/registrar-pago/${pacienteId}/`, pagoData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    console.log('Pago almacenado con éxito:', pagoResponse.data);
                } catch (error) {
                    console.error('Error al registrar el pago:', error.response?.data || error.message);
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Hubo un error al registrar el pago.',
                        life: 3000,
                    });
                }
            }
    
            toast.current.show({ severity: 'success', summary: 'Registro Exitoso', detail: 'Paciente registrado correctamente', life: 3000 });
        } catch (error) {
            console.error('Error al guardar los datos del paciente o pagos:', error.response?.data || error.message);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Hubo un error al registrar el paciente. Revisa los datos enviados.',
                life: 3000,
            });
        } finally {
            setLoading(false);
        }
    };
        
    

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevenir la recarga de la página
    };



    

    return (
        <div className={styles.card}>
            <Toast ref={toast} />
            <h2 className={styles.title}>Registrar Paciente</h2>
            <Divider />

            <Stepper ref={stepperRef} style={{ flexBasis: '50rem' }} orientation="vertical">
                <StepperPanel header="Registrar Paciente">
                    <form onSubmit={handleSubmit}>
                        <DatosPaciente
                            formData={formData}
                            handleChange={handleChange}
                            handleDepartamentoChange={handleDepartamentoChange}
                            departamentos={departamentos}
                            municipios={municipios}
                            generos={generos}
                        />
                        <div className="flex py-4 gap-2">
                            <Button label="Siguiente" icon="pi pi-arrow-right" onClick={() => stepperRef.current.nextCallback()} />
                        </div>
                    </form>
                </StepperPanel>

                <StepperPanel header="Historial Médico">
                    <form onSubmit={handleSubmit}>
                    <HistorialMedico
    formData={formData}
    handleChange={(e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            historial_medico: {
                ...prev.historial_medico,
                [name]: value
            }
        }));
    }}
/>
                        <div className="flex py-4 gap-2">
                            <Button label="Atrás" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                            <Button label="Siguiente" icon="pi pi-arrow-right" onClick={() => stepperRef.current.nextCallback()} />
                        </div>
                    </form>
                </StepperPanel>

                <StepperPanel header="Historial Odontológico">
                    <form onSubmit={handleSubmit}>
                    <HistorialOdontologico
    formData={formData}
    handleChange={(e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            historialOdontologico: {
                ...prev.historialOdontologico,
                [name]: value
            }
        }));
    }}
/>
                        <div className="flex py-4 gap-2">
                            <Button label="Atrás" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                            <Button label="Siguiente" icon="pi pi-arrow-right" onClick={() => stepperRef.current.nextCallback()} />
                        </div>
                    </form>
                </StepperPanel>

                <StepperPanel header="Radiografía">
                    <form onSubmit={handleSubmit}>
                        <Radiografia 
                        formData={formData} 
                        handleChange={handleChange}
                        />
                        <div className="flex py-4 gap-2">
                            <Button label="Atrás" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                            <Button label="Siguiente" icon="pi pi-arrow-right" onClick={() => stepperRef.current.nextCallback()} />
                        </div>
                    </form>
                </StepperPanel>

                <StepperPanel header="Asignar Tratamiento">
                    <form onSubmit={handleSubmit}>
                        <Tratamiento
                         formData={formData}
                         handleChange={handleChange}
                         especialidadId={formData.odontologo_id}
                        />
                        <div className="flex py-4 gap-2">
                            <Button label="Atrás" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                            <Button label="Siguiente" icon="pi pi-arrow-right" onClick={() => stepperRef.current.nextCallback()} />
                        </div>
                    </form>
                </StepperPanel>
            
                <StepperPanel header="Pago">
                    <form onSubmit={handleSubmit}>
                        <Pagos 
                        formData={formData}
                        handleChange={handleChange}
                        />
                        <div className="flex py-4 gap-2">
                            <Button label="Atrás" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                            <Button label="Siguiente" icon="pi pi-arrow-right" onClick={() => stepperRef.current.nextCallback()} />
                        </div>
                    </form>
                </StepperPanel>
            
                <StepperPanel header="Asignar Cita">
                    <form onSubmit={handleSubmit}>
                        <Citas 
                        formData={formData}
                        handleChange={handleChange}
                        />
                        <div className="flex py-4 gap-2">
                            <Button label="Atrás" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                            <Button severity="success" label="Guardar Datos" icon="pi pi-save" onClick={handleGuardarDatos} />
                        </div>
                    </form>
                </StepperPanel>
            </Stepper>
        </div>
    );
};

export default AgregarPaciente;
