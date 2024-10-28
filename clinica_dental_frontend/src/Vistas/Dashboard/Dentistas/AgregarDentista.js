import React, { useState, useRef, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import { Fieldset } from 'primereact/fieldset';
import axios from 'axios';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import styles from './AgregarDentista.module.css';

const AgregarDentista = () => {
    const toast = useRef(null);
    const [errores, setErrores] = useState({});
    const [especialidades, setEspecialidades] = useState([]);
    const [formData, setFormData] = useState({
        nombre: '', apellido: '', correo: '', telefono: '',
        colegiado: '', especialidad: '', nombre_usuario: '',
        contrasena: '', confirmarContrasena: '', roles: {
            propietario: false, administrador: false, supervisor: false, colaborador: false
        }
    });

    useEffect(() => {
        axios.get('http://localhost:8000/api/especialidades/')
            .then(response => setEspecialidades(response.data))
            .catch(error => console.error('Error al cargar especialidades:', error));
    }, []);

    const validarTelefono = (telefono) => {
        const regexGuatemala = /^[23456]\d{7}$/;
        return regexGuatemala.test(telefono);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData({
                ...formData,
                roles: { ...formData.roles, [name]: checked },
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validarTelefono(formData.telefono)) {
            setErrores({ telefono: 'El número de teléfono no es válido para Guatemala.' });
            return;
        }

        if (formData.contrasena !== formData.confirmarContrasena) {
            setErrores({ contrasena: 'Las contraseñas no coinciden.' });
            return;
        }

        setErrores({});

        const token = localStorage.getItem('token');

        axios.post('http://localhost:8000/api/registrar-dentista/', formData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            console.log(response.data);
            toast.current.show({
                severity: 'success',
                summary: 'Registro Exitoso',
                detail: 'Dentista registrado correctamente',
                life: 3000,
            });
        })
        .catch((error) => {
            console.error('Error al registrar el dentista:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Ocurrió un error al registrar el dentista.',
                life: 3000,
            });
        });
    };

    return (
        <div className={styles.card}>
            <Toast ref={toast} />
            <h2 className={styles.title}>Registrar Dentista</h2>
            <Divider />

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.grid}>
                    <div className={styles.field}>
                        <label htmlFor="nombre">Nombre</label>
                        <InputText id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} maxLength={100} required />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="apellido">Apellido</label>
                        <InputText id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} maxLength={100} required />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="correo">Correo Electrónico</label>
                        <InputText id="correo" name="correo" value={formData.correo} onChange={handleChange} required />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="telefono">Teléfono</label>
                        <InputText id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} maxLength={15} required />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="colegiado">Número de Colegiado</label>
                        <InputText id="colegiado" name="colegiado" value={formData.colegiado} onChange={handleChange} maxLength={50} required />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="especialidad">Especialidad</label>
                        <Dropdown 
                            id="especialidad" 
                            value={formData.especialidad} 
                            options={especialidades.map(e => ({ label: e.nombre, value: e.id }))}
                            onChange={(e) => setFormData({ ...formData, especialidad: e.value })}
                            placeholder="Seleccione una Especialidad"
                            maxLength={100}
                            required
                        />
                    </div>
                    <div className={`${styles.field} ${styles['full-width']}`}>
                        <label htmlFor="nombre_usuario">Nombre de Usuario</label>
                        <InputText id="nombre_usuario" name="nombre_usuario" value={formData.nombre_usuario} maxLength={50} onChange={handleChange} required />
                    </div>

                    <div className={styles.passwordRow}>
                        <div className={styles.field}>
                            <label htmlFor="contrasena">Contraseña</label>
                            <Password id="contrasena" name="contrasena" value={formData.contrasena} onChange={handleChange} maxLength={50} toggleMask required />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="confirmarContrasena">Confirmar Contraseña</label>
                            <Password id="confirmarContrasena" name="confirmarContrasena" value={formData.confirmarContrasena}
                                onChange={handleChange} toggleMask required />
                        </div>
                    </div>
                </div>

                <Fieldset legend="Roles y Permisos">
                    <div className={styles.checkboxGroup}>
                        {['propietario', 'administrador', 'supervisor', 'colaborador'].map((role) => (
                            <div key={role} className="p-field-checkbox">
                                <Checkbox inputId={role} name={role} checked={formData.roles[role]} onChange={handleChange} />
                                <label htmlFor={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</label>
                            </div>
                        ))}
                    </div>
                </Fieldset>

                <Button type="submit" label="Registrar Dentista" icon="pi pi-check" className="mt-4 w-full" />
            </form>
        </div>
    );
};

export default AgregarDentista;
