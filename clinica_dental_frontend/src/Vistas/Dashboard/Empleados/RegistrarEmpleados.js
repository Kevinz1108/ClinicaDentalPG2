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
import styles from './RegistrarEmpleado.module.css';

const RegistrarEmpleado = () => {
    const toast = useRef(null);
    const [roles, setRoles] = useState([]);
    const [errores, setErrores] = useState({});
    const [formData, setFormData] = useState({
        nombre: '', apellido: '', correo: '', telefono: '', rol: '',
        usuario: '', contrasena: '', confirmarContrasena: '', permisos: {
            propietario: false, administrador: false, supervisor: false, colaborador: false
        }
    });

    useEffect(() => {
        axios.get('http://localhost:8000/api/cargos/')
            .then(response => setRoles(response.data))
            .catch(error => console.error('Error al cargar roles:', error));
    }, []);

    const validarTelefono = (telefono) => {
        const regexGuatemala = /^[2345679]\d{7}$/;
        return regexGuatemala.test(telefono);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData({
                ...formData,
                permisos: { ...formData.permisos, [name]: checked },
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

        axios.post('http://localhost:8000/api/registrar-empleado/', formData, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(() => {
            toast.current.show({
                severity: 'success',
                summary: 'Registro Exitoso',
                detail: 'Empleado registrado correctamente',
                life: 3000,
            });
            setFormData({
                nombre: '', apellido: '', correo: '', telefono: '', rol: '',
                usuario: '', contrasena: '', confirmarContrasena: '', permisos: {
                    propietario: false, administrador: false, supervisor: false, colaborador: false
                }
            });
        })
        .catch(() => {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Ocurrió un error al registrar el empleado.',
                life: 3000,
            });
        });
    };

    return (
        <div className={styles.card}>
            <Toast ref={toast} />
            <h2 className={styles.title}>Registrar Empleado</h2>
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
                        <label htmlFor="rol">Rol o Cargo</label>
                        <Dropdown 
    id="rol" 
    value={formData.rol} 
    options={roles.map(r => ({ label: r.nombre, value: r.id }))}  // Cambiar value a r.id
    onChange={(e) => setFormData({ ...formData, rol: e.value })}
    placeholder="Seleccione un Rol"
    required
/>

                    </div>
                    <div className={`${styles.field} ${styles['full-width']}`}>
                        <label htmlFor="usuario">Nombre de Usuario</label>
                        <InputText id="usuario" name="usuario" value={formData.usuario} maxLength={50} onChange={handleChange} required />
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

                <Fieldset legend="Permisos de Usuario">
                    <div className={styles.checkboxGroup}>
                        {['propietario', 'administrador', 'supervisor', 'colaborador'].map((permiso) => (
                            <div key={permiso} className="p-field-checkbox">
                                <Checkbox inputId={permiso} name={permiso} checked={formData.permisos[permiso]} onChange={handleChange} />
                                <label htmlFor={permiso}>{permiso.charAt(0).toUpperCase() + permiso.slice(1)}</label>
                            </div>
                        ))}
                    </div>
                </Fieldset>

                <Button type="submit" label="Registrar Empleado" icon="pi pi-check" className="mt-4 w-full" />
            </form>
        </div>
    );
};

export default RegistrarEmpleado;
