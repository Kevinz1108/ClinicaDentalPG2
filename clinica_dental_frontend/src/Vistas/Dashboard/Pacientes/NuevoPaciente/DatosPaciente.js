import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import axios from 'axios';
import { municipiosPorDepartamento } from '../../../Ubicaciones/ubicaciones';
import styles from './AgregarPaciente.module.css';

const DatosPaciente = ({ formData, handleChange, departamentos, generos, ocupacion }) => {
    const [municipios, setMunicipios] = useState([]);
    const [odontologos, setOdontologos] = useState([]);
    const [ocupaciones, setOcupaciones] = useState([{ label: 'Arquitecto', value: 'Arquitecto' }, { label: 'Maestro', value: 'Maestro' }]);
    const [nuevaOcupacion, setNuevaOcupacion] = useState(''); // Estado para la nueva ocupación
    const [mostrarCampoNuevaOcupacion, setMostrarCampoNuevaOcupacion] = useState(false);

    // Función para calcular la edad
    const calcularEdad = (fechaNacimiento) => {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    };

    useEffect(() => {
        if (formData.fechaNacimiento) {
            const edadCalculada = calcularEdad(formData.fechaNacimiento);
            handleChange({ target: { name: 'edad', value: edadCalculada } });
        }
    }, [formData.fechaNacimiento]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/obtener-dentistas/')
            .then(response => setOdontologos(response.data))
            .catch(error => console.error('Error al obtener los odontólogos:', error));
    }, []);

    const handleDepartamentoChange = (e) => {
        const selectedDepartamento = e.value;
        handleChange({ target: { name: 'departamento', value: selectedDepartamento } });
        setMunicipios(municipiosPorDepartamento[selectedDepartamento] || []);
    };
    const handleOcupacionChange = (e) => {
        const selectedOcupacion = e.value;

        if (selectedOcupacion === 'agregar') {
            setMostrarCampoNuevaOcupacion(true); // Mostrar campo de entrada para la nueva ocupación
        } else {
            setMostrarCampoNuevaOcupacion(false);
            handleChange({ target: { name: 'ocupacion', value: selectedOcupacion } });
        }
    };

    const agregarOcupacion = async () => {
        if (nuevaOcupacion.trim()) {
            const nuevaOcupacionObj = { label: nuevaOcupacion, value: nuevaOcupacion };

            // Guardar la nueva ocupación en el backend
            try {
                await axios.post('http://localhost:8000/api/agregar-ocupacion/', { nombre: nuevaOcupacion });
                setOcupaciones([...ocupaciones, nuevaOcupacionObj]);
                handleChange({ target: { name: 'ocupacion', value: nuevaOcupacion } });
            } catch (error) {
                console.error('Error al guardar la nueva ocupación:', error);
            }

            setNuevaOcupacion('');
            setMostrarCampoNuevaOcupacion(false);
        }
    };

    return (
        <form className={styles.grid}>
            <div className={styles.field}>
                <label htmlFor="nombre">Nombre</label>
                <InputText id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
            </div>
            <div className={styles.field}>
                <label htmlFor="apellido">Apellido</label>
                <InputText id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} required />
            </div>
            <div className={styles.field}>
                <label htmlFor="telefono">Teléfono</label>
                <InputText id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} required />
            </div>
            <div className={styles.field}>
                <label htmlFor="correo">Correo Electrónico</label>
                <InputText id="correo" name="correo" value={formData.correo} onChange={handleChange} required />
            </div>
            <div className={styles.field}>
                <label htmlFor="departamento">Departamento</label>
                <Dropdown id="departamento" value={formData.departamento} options={departamentos} onChange={handleDepartamentoChange} placeholder="Seleccione un departamento" />
            </div>
            <div className={styles.field}>
                <label htmlFor="municipio">Municipio</label>
                <Dropdown id="municipio" value={formData.municipio} options={municipios} onChange={(e) => handleChange({ target: { name: 'municipio', value: e.value } })} placeholder="Seleccione un municipio" />
            </div>
            <div className={`${styles.field} ${styles.fullWidth}`}>
                <label htmlFor="direccion">Dirección</label>
                <InputText id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} required />
            </div>
            <div className={styles.field}>
                <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
                <Calendar 
                    id="fechaNacimiento" 
                    name="fechaNacimiento" 
                    value={formData.fechaNacimiento ? new Date(formData.fechaNacimiento) : null} 
                    onChange={(e) => handleChange({ target: { name: 'fechaNacimiento', value: e.value.toISOString().split('T')[0] } })} 
                    dateFormat="dd/mm/yy" 
                    showIcon />
            </div>
            <div className={styles.field}>
                <label htmlFor="edad">Edad</label>
                <InputText id="edad" name="edad" value={formData.edad} readOnly />
            </div>
            <div className={styles.field}>
                <label htmlFor="genero">Género</label>
                <Dropdown id="genero" value={formData.genero} options={generos} onChange={(e) => handleChange({ target: { name: 'genero', value: e.value } })} placeholder="Seleccione un género" />
            </div>
            <div className={styles.field}>
                <label htmlFor="ocupacion">Ocupación</label>
                <Dropdown 
                    id="ocupacion" 
                    value={formData.ocupacion} 
                    options={[...ocupaciones, { label: 'Agregar nueva ocupación...', value: 'agregar' }]} 
                    onChange={handleOcupacionChange} 
                    placeholder="Seleccione una ocupación" 
                />
                {mostrarCampoNuevaOcupacion && (
                    <div className={styles.field}>
                        <InputText 
                            placeholder="Escriba nueva ocupación" 
                            value={nuevaOcupacion} 
                            onChange={(e) => setNuevaOcupacion(e.target.value)} 
                        />
                        <button type="button" onClick={agregarOcupacion}>Guardar ocupación</button>
                    </div>
                     )}
                    </div>
            <div className={styles.field}>
                <label htmlFor="odontologo">Odontólogo Asignado</label>
                <Dropdown id="odontologo" value={formData.odontologo_id} options={odontologos.map((odontologo) => ({ label: `${odontologo.nombre} ${odontologo.apellido}`, value: odontologo.id }))} onChange={(e) => handleChange({ target: { name: 'odontologo_id', value: e.value } })} placeholder="Seleccione un odontólogo" />
            </div>
        </form>
    );
};

export default DatosPaciente;
