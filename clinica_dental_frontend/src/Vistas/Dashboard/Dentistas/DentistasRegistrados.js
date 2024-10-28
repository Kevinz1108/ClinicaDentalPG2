// src/Vistas/Dashboard/Dentistas/DentistasRegistrados.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import 'primereact/resources/themes/lara-light-indigo/theme.css';  // Tema de PrimeReact
import 'primereact/resources/primereact.min.css';  // Estilos de PrimeReact
import 'primeicons/primeicons.css';  // Iconos
import styles from './DentistasRegistrados.module.css';  // Asegúrate de tener un archivo CSS para estilos personalizados

const DentistasRegistrados = () => {
    const [dentistas, setDentistas] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedDentista, setSelectedDentista] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const toast = useRef(null);

    const [especialidades, setEspecialidades] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/obtener-dentistas/')
            .then((response) => {
                setDentistas(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error al obtener dentistas:', error);
                setLoading(false);
            });
        obtenerEspecialidades();
    }, []);

    const obtenerEspecialidades = () => {
        axios.get('http://localhost:8000/api/especialidades/')
            .then((response) => {
                setEspecialidades(response.data);
            })
            .catch((error) => {
                console.error('Error al obtener especialidades:', error);
            });
    };

    const dentistasFiltrados = dentistas.filter((dentista) =>
        dentista.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        dentista.apellido.toLowerCase().includes(filtro.toLowerCase())
    );

    const handleShowModal = (dentista) => {
        setSelectedDentista(dentista);
        setShowModal(true);
        setIsEditing(false);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedDentista(null);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedDentista({ ...selectedDentista, [name]: value });
    };

    const handleConfirmSave = () => {
        confirmDialog({
            message: '¿Guardar cambios del dentista?',
            header: 'Actualización De Datos',
            icon: 'pi pi-exclamation-triangle',
            accept: () => handleSaveChanges(),
            acceptLabel: 'Sí',
            rejectLabel: 'No',
        });
    };

    const handleSaveChanges = () => {
        if (!selectedDentista?.id) {
            console.error('ID del dentista no encontrado');
            return;
        }
        axios.put(`http://localhost:8000/api/editar-dentista/${selectedDentista.id}/`, selectedDentista)
            .then((response) => {
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Dentista actualizado con éxito', life: 3000 });
                setShowModal(false);
                setDentistas((prevDentistas) =>
                    prevDentistas.map((dentista) =>
                        dentista.id === selectedDentista.id ? selectedDentista : dentista
                    )
                );
            })
            .catch((error) => {
                console.error('Error al actualizar dentista:', error);
            });
    };

    const handleDelete = (rowData) => {
        confirmDialog({
            message: `¿Está seguro de que desea eliminar al dentista ${rowData.nombre} ${rowData.apellido}?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            accept: () => {
                axios.delete(`http://localhost:8000/api/eliminar-dentista/${rowData.id}/`)
                    .then(response => {
                        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Dentista eliminado con éxito', life: 3000 });
                        setDentistas((prevDentistas) =>
                            prevDentistas.filter((dentista) => dentista.id !== rowData.id)
                        );
                    })
                    .catch(error => {
                        console.error('Error al eliminar dentista:', error);
                        toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el dentista', life: 3000 });
                    });
            }
        });
    };

    const formatPassword = (password) => {
        return password ? '•'.repeat(5) : 'Sin contraseña';
    };

    const renderRoles = (roles) => {
        if (!roles || typeof roles !== 'object') {
            return 'Sin roles asignados';
        }

        return Object.entries(roles)
            .filter(([role, hasRole]) => hasRole)
            .map(([role]) => role.charAt(0).toUpperCase() + role.slice(1))
            .join(', ');
    };

    const combineNameAndSurname = (rowData) => {
        return `${rowData.nombre} ${rowData.apellido}`;
    };

    return (
        <Container className="dentistas-registrados mt-5">
            <Toast ref={toast} />
            <ConfirmDialog />

            <Row>
                <Col>
                    <h2 className="text-center mb-4">Dentistas Registrados</h2>
                    <InputText
                        placeholder="Buscar dentista por nombre o apellido"
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className={`${styles.mb4} w-full`}
                    />

                    {loading ? (
                        <div className="spinner-container text-center">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </Spinner>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <DataTable
                                value={dentistasFiltrados}
                                responsiveLayout="scroll"
                                paginator
                                rows={5}
                                emptyMessage="Sin registro de Dentistas"
                            >
                                <Column
                                    field="nombre"
                                    header="Nombre"
                                    body={combineNameAndSurname}
                                />
                                <Column field="correo" header="Correo Electrónico" />
                                <Column field="telefono" header="Teléfono" />
                                <Column field="colegiado" header="Número de Colegiado" />
                                <Column 
                                    field="especialidad_nombre" 
                                    header="Especialización"
                                    
                                    />
                                <Column
                                    field="roles"
                                    header="Roles"
                                    body={(rowData) => renderRoles(rowData.roles)}
                                />
                                <Column
                                    field="contrasena"
                                    header="Contraseña"
                                    body={(rowData) => formatPassword(rowData.contrasena)}
                                />
                                <Column
                                    header="Acción"
                                    body={(rowData) => (
                                        <>
                                            <Button 
                                                icon="pi pi-pencil"
                                                severity="warning"
                                                onClick={() => handleShowModal(rowData)}
                                                className="mr-2"
                                            />
                                            <Button 
                                                icon="pi pi-trash"
                                                severity="danger"
                                                onClick={() => handleDelete(rowData)}
                                            />
                                        </>
                                    )}
                                />
                            </DataTable>
                        </div>
                    )}
                </Col>
            </Row>

            <Dialog header="Detalles del Dentista" visible={showModal} onHide={handleCloseModal}>
                {selectedDentista && (
                    <form>
                        <div className={styles.field}>
                            <label htmlFor="nombre">Nombre</label>
                            <InputText
                                id="nombre"
                                name="nombre"
                                value={selectedDentista.nombre}
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
                                value={selectedDentista.apellido}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                required
                            />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="correo">Correo Electrónico</label>
                            <InputText
                                id="correo"
                                name="correo"
                                value={selectedDentista.correo}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="telefono">Teléfono</label>
                            <InputText
                                id="telefono"
                                name="telefono"
                                value={selectedDentista.telefono}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                required
                            />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="colegiado">Número de Colegiado</label>
                            <InputText
                                id="colegiado"
                                name="colegiado"
                                value={selectedDentista.colegiado}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className={styles.field}>
    <label htmlFor="especializacion">Especialización</label>
    {isEditing ? (
        <Dropdown
            id="especializacion"
            name="especializacion"
            value={selectedDentista.especialidad}
            options={especialidades}
            optionLabel="nombre"  // Ajusta este campo según cómo esté definido en el modelo
            optionValue="id"
            onChange={(e) => setSelectedDentista({ ...selectedDentista, especialidad: e.value })}
            placeholder="Seleccionar especialidad"
            className="w-full"
        />
    ) : (
        <InputText
            id="especializacion"
            name="especializacion"
            value={selectedDentista.especialidad_nombre}
            disabled
        />
    )}
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
        </Container>
    );
};

export default DentistasRegistrados;
