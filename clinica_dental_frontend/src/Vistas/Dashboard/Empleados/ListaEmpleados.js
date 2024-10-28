import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import styles from './ListaEmpleados.module.css';

const ListaEmpleados = () => {
    const toast = useRef(null);
    const [empleados, setEmpleados] = useState([]);
    const [cargos, setCargos] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedEmpleado, setSelectedEmpleado] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8000/api/empleados/')
            .then((response) => {
                setEmpleados(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error al obtener empleados:', error);
                setLoading(false);
            });
        obtenerCargos();
    }, []);

    const obtenerCargos = () => {
        axios.get('http://localhost:8000/api/cargos/')
            .then((response) => {
                setCargos(response.data);
            })
            .catch((error) => {
                console.error('Error al obtener cargos:', error);
            });
    };

    const empleadosFiltrados = empleados.filter((empleado) =>
        empleado.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        empleado.apellido.toLowerCase().includes(filtro.toLowerCase())
    );

    const handleShowModal = (empleado) => {
        setSelectedEmpleado(empleado);
        setShowModal(true);
        setIsEditing(false);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedEmpleado(null);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedEmpleado({ ...selectedEmpleado, [name]: value });
    };

    const handleConfirmSave = () => {
        confirmDialog({
            message: '¿Guardar cambios del empleado?',
            header: 'Actualización De Datos',
            icon: 'pi pi-exclamation-triangle',
            accept: () => handleSaveChanges(),
            acceptLabel: 'Sí',
            rejectLabel: 'No',
        });
    };

    const handleSaveChanges = () => {
        if (!selectedEmpleado?.id) {
            console.error('ID del empleado no encontrado');
            return;
        }
        axios.put(`http://localhost:8000/api/empleados/${selectedEmpleado.id}/editar/`, selectedEmpleado)
            .then(() => {
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Empleado actualizado con éxito', life: 3000 });
                setShowModal(false);
                setEmpleados((prevEmpleados) =>
                    prevEmpleados.map((empleado) =>
                        empleado.id === selectedEmpleado.id ? selectedEmpleado : empleado
                    )
                );
            })
            .catch((error) => {
                console.error('Error al actualizar empleado:', error);
            });
    };

    const handleDelete = (rowData) => {
        confirmDialog({
            message: `¿Está seguro de que desea eliminar al empleado ${rowData.nombre} ${rowData.apellido}?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            accept: () => {
                axios.delete(`http://localhost:8000/api/empleados/${rowData.id}/eliminar/`)
                    .then(() => {
                        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Empleado eliminado con éxito', life: 3000 });
                        setEmpleados((prevEmpleados) =>
                            prevEmpleados.filter((empleado) => empleado.id !== rowData.id)
                        );
                    })
                    .catch((error) => {
                        console.error('Error al eliminar empleado:', error);
                        toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el empleado', life: 3000 });
                    });
            }
        });
    };

    return (
        <Container className="empleados-registrados mt-5">
            <Toast ref={toast} />
            <ConfirmDialog />

            <Row>
                <Col>
                    <h2 className="text-center mb-4">Empleados Registrados</h2>
                    <InputText
                        placeholder="Buscar empleado por nombre o apellido"
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
                                value={empleadosFiltrados}
                                responsiveLayout="scroll"
                                paginator
                                rows={5}
                                emptyMessage="Sin registro de Empleados"
                            >
                                <Column field="nombre" header="Nombre" />
                                <Column field="apellido" header="Apellido" />
                                <Column field="correo" header="Correo Electrónico" />
                                <Column field="telefono" header="Teléfono" />
                                <Column
    field="rol"
    header="Rol o Cargo"
    body={(rowData) => {
        const rolEncontrado = cargos.find(cargo => cargo.id === rowData.rol);
        return rolEncontrado ? rolEncontrado.nombre : 'Rol no asignado';
    }}
/>

                                <Column field="usuario" header="Nombre de Usuario" />
                                <Column
                                    field="contrasena"
                                    header="Contraseña"
                                    body={() => '••••••••'}
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

            <Dialog header="Detalles del Empleado" visible={showModal} onHide={handleCloseModal}>
                {selectedEmpleado && (
                    <form>
                        <div className={styles.field}>
                            <label htmlFor="nombre">Nombre</label>
                            <InputText
                                id="nombre"
                                name="nombre"
                                value={selectedEmpleado.nombre}
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
                                value={selectedEmpleado.apellido}
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
                                value={selectedEmpleado.correo}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="telefono">Teléfono</label>
                            <InputText
                                id="telefono"
                                name="telefono"
                                value={selectedEmpleado.telefono}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                required
                            />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="rol">Rol o Cargo</label>
                            {isEditing ? (
                                <Dropdown 
                                id="rol" 
                                value={formData.rol} 
                                options={roles.map(r => ({ label: r.nombre, value: r.id }))}  // Cambiar value a r.id
                                onChange={(e) => setFormData({ ...formData, rol: e.value })}
                                placeholder="Seleccione un Rol"
                                required
                            />
                            
                            
                            ) : (
                                <InputText
                                    id="rol"
                                    name="rol"
                                    value={selectedEmpleado.rol_nombre}
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

export default ListaEmpleados;
