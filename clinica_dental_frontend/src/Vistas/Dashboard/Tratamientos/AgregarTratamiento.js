import React, { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import axios from 'axios';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import styles from './AgregarTratamiento.module.css';

const AgregarTratamiento = () => {
    const [especialidades, setEspecialidades] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [tratamientos, setTratamientos] = useState([]);
    const [selectedEspecialidad, setSelectedEspecialidad] = useState(null);
    const [selectedCategoria, setSelectedCategoria] = useState(null);
    const [selectedTratamiento, setSelectedTratamiento] = useState(null);
    const [formData, setFormData] = useState({
        nombre_tratamiento: '',
        descripcion: '',
        precio_unitario: '',
        categoria: '',
    });
    const [errores, setErrores] = useState({});
    const toast = useRef(null); // Definir la referencia correctamente

    useEffect(() => {
        axios.get('http://localhost:8000/api/especialidades/')
            .then(response => setEspecialidades(response.data))
            .catch(error => console.error('Error al cargar especialidades:', error));
    }, []);

    const handleEspecialidadChange = (e) => {
        setSelectedEspecialidad(e.value);
        setSelectedCategoria(null);
        setSelectedTratamiento(null);

        axios.get(`http://localhost:8000/api/categorias/${e.value}/`)
            .then(response => setCategorias(response.data))
            .catch(error => console.error('Error al cargar categorías:', error));
    };

    const handleCategoriaChange = (e) => {
        setSelectedCategoria(e.value);
        setSelectedTratamiento(null);

        axios.get(`http://localhost:8000/api/tratamientos/${e.value}/`)
            .then(response => setTratamientos(response.data))
            .catch(error => console.error('Error al cargar tratamientos:', error));
    };

    const handleGuardarTratamiento = () => {
        console.log("Tratamiento seleccionado:", selectedTratamiento);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validaciones básicas
        if (!formData.nombre_tratamiento || !formData.precio_unitario || !formData.categoria) {
            setErrores({ mensaje: 'Todos los campos son obligatorios.' });
            return;
        }

        setErrores({});

        const token = localStorage.getItem('token');

        axios.post('http://localhost:8000/api/registrar-tratamiento/', formData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            console.log(response.data);
            toast.current.show({ // Asegúrate de usar `toast.current.show`
                severity: 'success',
                summary: 'Registro Exitoso',
                detail: 'Tratamiento registrado correctamente',
                life: 3000,
            });

            setFormData({
                nombre_tratamiento: '',
                descripcion: '',
                precio_unitario: '',
                categoria: '',
            });
        })
        .catch((error) => {
            console.error('Error al registrar el tratamiento:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Ocurrió un error al registrar el tratamiento.',
                life: 3000,
            });
        });
    };

    return (
        <div className={styles.cardTratamiento}>
            <Toast ref={toast} /> {/* Asegúrate de que el Toast esté renderizado */}
            <h2 className={styles.title}>Registrar Tratamiento</h2>
            <Divider />

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.grid}>
                    <div className={styles.field}>
                        <label htmlFor="especialidad">Especialidad</label>
                        <Dropdown
                            id="especialidad" 
                            name="especialidad" 
                            value={selectedEspecialidad}
                            options={especialidades.map(e => ({ label: e.nombre, value: e.id }))}
                            onChange={handleEspecialidadChange}
                            placeholder="Seleccione una Especialidad"
                            maxLength={100}
                            required
                        />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="categoria">Categoría</label>
                        <Dropdown 
                            id="categoria" 
                            name="categoria" 
                            value={selectedCategoria}
                            options={categorias.map(c => ({ label: c.nombre, value: c.id }))}
                            onChange={handleCategoriaChange}
                            placeholder="Seleccione una categoría"
                            maxLength={100}
                            required
                        />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="tratamiento">Tratamiento</label>
                        <Dropdown 
                            id="tratamiento" 
                            name="tratamiento" 
                            value={selectedTratamiento}
                            options={tratamientos.map(c => ({ label: c.nombre, value: c.id }))}
                            onChange={(e) => setSelectedTratamiento(e.value)}
                            placeholder="Seleccione un tratamiento"
                            maxLength={100}
                            required
                        />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="precio_unitario">Precio Unitario (Q)</label>
                        <InputText id="precio_unitario" name="precio_unitario" value={formData.precio_unitario} onChange={handleChange} type="number" step="0.01" min="0" required />
                    </div>
                </div>

                <Button type="submit" label="Registrar Tratamiento" icon="pi pi-check" className="mt-4 w-full" onClick={handleGuardarTratamiento} disabled={!selectedTratamiento}/>
            </form>
        </div>
    );
};

export default AgregarTratamiento;
