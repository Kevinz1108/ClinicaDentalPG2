import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import axios from 'axios';

import styles from './CrearCargo.module.css';

const CrearCargo = () => {
  const [cargos, setCargos] = useState([]);
  const [editCargoId, setEditCargoId] = useState(null);
  const [editedNombre, setEditedNombre] = useState('');
  const [cargoNuevo, setCargoNuevo] = useState('');
  const toast = React.useRef(null);

  // Obtener lista de cargos al cargar el componente
  useEffect(() => {
    const fetchCargos = async () => {
      try {
        const response = await axios.get('http://localhost:8000/cargos/');
        setCargos(response.data);
      } catch (error) {
        console.error('Error al obtener los cargos:', error);
      }
    };
    fetchCargos();
  }, []);

  // Manejar el cambio del input para el nuevo cargo
  const handleInputChange = (e) => {
    setCargoNuevo(e.target.value);
  };

  // Crear un nuevo cargo
  const handleCrearCargo = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:8000/api/cargos/crear/', { nombre: cargoNuevo });
      setCargos([...cargos, response.data]);
      setCargoNuevo('');
      toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Cargo creado con éxito', life: 3000 });
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al crear el cargo', life: 3000 });
    }
  };

  // Manejar edición de cargo
  const handleModificar = (id, nombre) => {
    setEditCargoId(id);
    setEditedNombre(nombre);
  };

  // Guardar la edición de un cargo
  const handleGuardarEdicion = async (id) => {
    try {
      await axios.put(`http://localhost:8000/cargos/${id}/editar/`, { nombre: editedNombre });
      const updatedCargos = cargos.map((cargo) => (cargo.id === id ? { ...cargo, nombre: editedNombre } : cargo));
      setCargos(updatedCargos);
      setEditCargoId(null);
      toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Cargo modificado con éxito', life: 3000 });
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al modificar el cargo', life: 3000 });
    }
  };

  // Cancelar la edición
  const handleCancelarEdicion = () => {
    setEditCargoId(null);
    setEditedNombre('');
  };

  // Eliminar un cargo
  const handleEliminar = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/cargos/${id}/eliminar/`);
      const updatedCargos = cargos.filter((cargo) => cargo.id !== id);
      setCargos(updatedCargos);
      toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Cargo eliminado con éxito', life: 3000 });
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el cargo', life: 3000 });
    }
  };

  return (
    <div className={styles.card}>
      <Toast ref={toast} />
      <h3 style={{  }}>Gestionar Roles o Cargos</h3>

      {/* Formulario para crear un nuevo cargo */}
      <form onSubmit={handleCrearCargo} className="mb-4">
        <div className="p-field">
          <label htmlFor="cargoNuevo" style={{ }}>Nombre del Rol o Cargo</label>
          <InputText
            id="cargoNuevo"
            value={cargoNuevo}
            onChange={handleInputChange}
            placeholder="Ingrese el nombre del cargo"
            required
            className="w-full mb-2"
          />
        </div>
        <Button label="Crear Cargo" type="submit" style={{ borderColor: '#b4c8dc' }} />
      </form>

      {/* Tabla para listar los cargos */}
      <DataTable value={cargos} responsiveLayout="scroll">
        <Column field="nombre" header="Nombre del Rol o Cargo" body={(rowData) =>
          editCargoId === rowData.id ? (
            <InputText
              value={editedNombre}
              onChange={(e) => setEditedNombre(e.target.value)}
            />
          ) : (
            rowData.nombre
          )
        } />
        <Column
          header="Acciones"
          body={(rowData) =>
            editCargoId === rowData.id ? (
              <>
                <Button icon="pi pi-save" className="p-button-success mr-2" onClick={() => handleGuardarEdicion(rowData.id)} />
                <Button icon="pi pi-times" className="p-button-secondary" onClick={handleCancelarEdicion} />
              </>
            ) : (
              <>
                <Button icon="pi pi-pencil" className="p-button-warning mr-2" onClick={() => handleModificar(rowData.id, rowData.nombre)} />
                <Button icon="pi pi-trash" className="p-button-danger" onClick={() => handleEliminar(rowData.id)} />
              </>
            )
          }
        />
      </DataTable>
    </div>
  );
};

export default CrearCargo;
