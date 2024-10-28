// src/Vistas/Dashboard/Pacientes/NuevoPaciente/PacientesRegistrados.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import 'primereact/resources/themes/lara-light-indigo/theme.css';  // Tema de PrimeReact
import 'primereact/resources/primereact.min.css';  // Estilos de PrimeReact
import 'primeicons/primeicons.css';  // Iconos
import styles from '../NuevoPaciente/AgregarPaciente.module.css';  // Asegúrate de tener un archivo CSS para estilos personalizados

const PacientesRegistrados = () => {
  const [pacientes, setPacientes] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();

  const obtenerPacientes = () => {
    axios.get('http://localhost:8000/api/obtener-pacientes/')
      .then((response) => {
        setPacientes(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener pacientes:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    obtenerPacientes();
  }, []);

  const pacientesFiltrados = pacientes.filter((paciente) =>
    paciente.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    paciente.apellido.toLowerCase().includes(filtro.toLowerCase())
  );

  const handleShowModal = (paciente) => {
    setSelectedPaciente(paciente);
    setShowModal(true);
    setIsEditing(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPaciente(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedPaciente({ ...selectedPaciente, [name]: value });
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
    if (!selectedPaciente?.id) {
      console.error('ID del paciente no encontrado');
      return;
    }
    axios.put(`http://localhost:8000/api/actualizar-paciente/${selectedPaciente.id}/`, selectedPaciente)
      .then((response) => {
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Paciente actualizado con éxito', life: 3000 });
        setShowModal(false);
        obtenerPacientes();
      })
      .catch((error) => {
        console.error('Error al actualizar paciente:', error);
      });
  };

  const handleDelete = (rowData) => {
    confirmDialog({
      message: `¿Está seguro de que desea eliminar al paciente ${rowData.nombre} ${rowData.apellido}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        axios.delete(`http://localhost:8000/api/eliminar-paciente/${rowData.id}/`)
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

  const formatFecha = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const anio = date.getFullYear();
    return `${dia}/${mes}/${anio}`;
  };

  return (
    <Container className="usuarios-registrados mt-5">
      <Toast ref={toast} />
      <ConfirmDialog />
      
      <Row>
        <Col>
          <h2 className="text-center mb-4">Pacientes Registrados</h2>
          <InputText
            placeholder="Buscar paciente por nombre o apellido"
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
                value={pacientesFiltrados}
                responsiveLayout="scroll"
                paginator
                rows={5}
                emptyMessage="Sin registro de Pacientes"
              >
                <Column field="nombre" header="Nombre"></Column>
                <Column field="apellido" header="Apellido"></Column>
                <Column field="email" header="Correo Electrónico"></Column>
                <Column field="telefono" header="Teléfono"></Column>
                <Column
                  field="fecha_nacimiento"
                  header="Fecha de Nacimiento"
                  body={(rowData) => formatFecha(rowData.fecha_nacimiento)}
                ></Column>
                <Column field="direccion" header="Dirección"></Column>
                <Column field="genero" header="Género"></Column>
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
                ></Column>
              </DataTable>
            </div>
          )}
        </Col>
      </Row>

      <Dialog header="Detalles del Paciente" visible={showModal} onHide={handleCloseModal}>
        {selectedPaciente && (
          <form>
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
    </Container>
  );
};

export default PacientesRegistrados;
