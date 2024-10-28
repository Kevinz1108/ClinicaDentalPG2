import React, { useState, useRef}from 'react';
import axios from 'axios';
import styles from './DatosPaciente.module.css';

import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button';

const DatosPaciente = ({ selectedPaciente, obtenerPacientes }) => {
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedPaciente, setEditedPaciente] = useState(null);
    const toast = useRef(null);
    if (!selectedPaciente) return <p>Seleccione un paciente para ver los detalles.</p>;

    // Asignar el dentista relacionado al paciente
    const dentistaAsignado = selectedPaciente.odontologo || {};
    const handleShowModal = () => {
        setEditedPaciente(selectedPaciente);
        setShowModal(true);
        setIsEditing(false);
    };
    const formatFecha = (fecha) => {
        if (!fecha) return '';
        const date = new Date(fecha);
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const anio = date.getFullYear();
        return `${dia}/${mes}/${anio}`;
      };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditedPaciente(null);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedPaciente({ ...editedPaciente, [name]: value });
    };

    const handleConfirmSave = () => {
        confirmDialog({
            message: '¿Guardar cambios del paciente?',
            header: 'Actualización De Datos',
            icon: 'pi pi-exclamation-triangle',
            accept: () => handleSaveChanges(),
            acceptLabel: 'Sí',
            rejectLabel: 'No',
        });
    };

    const handleSaveChanges = () => {
        if (!editedPaciente?.id) {
            console.error('ID del paciente no encontrado');
            return;
        }
        axios.put(`http://localhost:8000/api/actualizar-paciente/${editedPaciente.id}/`, editedPaciente)
            .then((response) => {
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Paciente actualizado con éxito', life: 3000 });
                setShowModal(false);
                obtenerPacientes();
            })
            .catch((error) => {
                console.error('Error al actualizar paciente:', error);
            });
    };

    const handleDelete = () => {
        confirmDialog({
            message: `¿Está seguro de que desea eliminar al paciente ${selectedPaciente.nombre} ${selectedPaciente.apellido}?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            accept: () => {
                axios.delete(`http://localhost:8000/api/eliminar-paciente/${selectedPaciente.id}/`)
                    .then(response => {
                        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Paciente eliminado con éxito', life: 3000 });
                        obtenerPacientes();
                    })
                    .catch(error => {
                        console.error('Error al eliminar paciente:', error);
                        toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el paciente', life: 3000 });
                    });
            }
        });
    };

    return (
        <div className={styles.container}>
            {/* Card para datos del paciente */}
            <div className={`${styles.card}`}>
                <h3>Datos del Paciente</h3>
                <div className={styles.grid}>
                    <div className={styles.field}>
                        <label>Nombre</label>
                        <p>{selectedPaciente.nombre}</p>
                    </div>
                    <div className={styles.field}>
                        <label>Apellido</label>
                        <p>{selectedPaciente.apellido}</p>
                    </div>
                    <div className={styles.field}>
                        <label>Teléfono</label>
                        <p>{selectedPaciente.telefono}</p>
                    </div>
                    <div className={styles.field}>
                        <label>Correo Electrónico</label>
                        <p>{selectedPaciente.email}</p>
                    </div>
                    <div className={styles.field}>
                        <label>Departamento</label>
                        <p>{selectedPaciente.departamento}</p>
                    </div>
                    <div className={styles.field}>
                        <label>Municipio</label>
                        <p>{selectedPaciente.municipio}</p>
                    </div>
                    <div className={styles.field}>
                        <label>Dirección</label>
                        <p>{selectedPaciente.direccion}</p>
                    </div>
                    <div className={styles.field}>
                        <label>Fecha de Nacimiento</label>
                        <p>{formatFecha(selectedPaciente.fecha_nacimiento)}</p>
                    </div>
                    <div className={styles.field}>
                        <label>Edad</label>
                        <p>{selectedPaciente.edad}</p>
                    </div>
                    <div className={styles.field}>
                        <label>Género</label>
                        <p>{selectedPaciente.genero}</p>
                    </div>
                </div>
                                {/* Botones de acciones */}
                <div className={styles.actionButtons}>
                    <Button 
                        icon="pi pi-pencil" 
                        label='Modificar'
                        severity="warning" 
                        onClick={handleShowModal} 
                        className="mr-2" 
                    />
                    <Button 
                        icon="pi pi-trash" 
                        label='Eliminar'
                        severity="danger" 
                        onClick={handleDelete} 
                    />
                </div>
            </div>

            {/* Card para datos del dentista asignado */}
            <div className={`${styles.cardDentista}`}>
                <h3>Datos del Dentista Asignado</h3>
                <div className={styles.grid}>
                    <div className={styles.field}>
                        <label>Nombre</label>
                        <p>{dentistaAsignado.nombre || 'No asignado'}</p>
                    </div>
                    <div className={styles.field}>
                        <label>Apellido</label>
                        <p>{dentistaAsignado.apellido || 'No asignado'}</p>
                    </div>
                    <div className={styles.field}>
                        <label>Teléfono</label>
                        <p>{dentistaAsignado.telefono || 'No asignado'}</p>
                    </div>
                    <div className={styles.field}>
                        <label>Correo Electrónico</label>
                        <p>{dentistaAsignado.correo || 'No asignado'}</p>
                    </div>
                </div>
                {/* Botones de acciones */}
                <div className={styles.actionButtons}>
                    <Button 
                        icon="pi pi-arrow-right-arrow-left" 
                        label='Cambiar Dentista'
                        severity="warning" 
                        onClick={handleShowModal} 
                        className="mr-2" 
                    />

                </div>
            </div>
                        {/* Modal de edición */}
                        <Dialog header="Detalles del Paciente" visible={showModal} onHide={handleCloseModal}>
    {selectedPaciente && (
        <form className={styles.dialogGrid}> {/* Aplica el estilo de grid aquí */}
            <div className={styles.field}>
                <label htmlFor="nombre">Nombre</label>
                <InputText
                    id="nombre"
                    name="nombre"
                    value={selectedPaciente.nombre}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                />
            </div>
            <div className={styles.field}>
                <label htmlFor="apellido">Apellido</label>
                <InputText
                    id="apellido"
                    name="apellido"
                    value={selectedPaciente.apellido}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                />
            </div>
            <div className={styles.field}>
                <label htmlFor="email">Correo Electrónico</label>
                <InputText
                    id="email"
                    name="email"
                    value={selectedPaciente.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                />
            </div>
            <div className={styles.field}>
                <label htmlFor="telefono">Teléfono</label>
                <InputText
                    id="telefono"
                    name="telefono"
                    value={selectedPaciente.telefono}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                />
            </div>
            <div className={styles.field}>
                <label htmlFor="fecha_nacimiento">Fecha De Nacimiento</label>
                <InputText
                    id="fecha_nacimiento"
                    name="fecha_nacimiento"
                    value={formatFecha(selectedPaciente.fecha_nacimiento)}
                    disabled={!isEditing}
                />
            </div>
            <div className={styles.field}>
                <label htmlFor="edad">Edad</label>
                <InputText
                    id="edad"
                    name="edad"
                    value={selectedPaciente.edad}
                    disabled={!isEditing}
                />
            </div>
            <div className={styles.field}>
                <label htmlFor="direccion">Departamento</label>
                <InputText
                    id="direccion"
                    name="direccion"
                    value={selectedPaciente.direccion}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                />
            </div>
            <div className={styles.field}>
                <label htmlFor="direccion">Municipio</label>
                <InputText
                    id="direccion"
                    name="direccion"
                    value={selectedPaciente.direccion}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                />
            </div>
            <div className={styles.field}>
                <label htmlFor="direccion">Dirección</label>
                <InputText
                    id="direccion"
                    name="direccion"
                    value={selectedPaciente.direccion}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                />
            </div>
            <div className={styles.field}>
                <label htmlFor="genero">Género</label>
                <InputText
                    id="genero"
                    name="genero"
                    value={selectedPaciente.genero}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                />
            </div>
        </form>
    )}
    <div className="mt-3">
        {isEditing ? (
            <>
                <Button label="Guardar" severity="success" icon="pi pi-save" onClick={handleConfirmSave} />
                <Button label="Cancelar" severity="danger" icon="pi pi-times" onClick={() => setIsEditing(false)} />
            </>
        ) : (
            <Button label="Editar" severity="warning" icon="pi pi-pencil" onClick={handleEdit} />
        )}
    </div>
</Dialog>

        </div>
    );
};

export default DatosPaciente;
