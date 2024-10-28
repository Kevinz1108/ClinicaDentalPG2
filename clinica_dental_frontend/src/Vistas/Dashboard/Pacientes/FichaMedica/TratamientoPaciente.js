import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Divider } from 'primereact/divider';
import axios from 'axios';
import styles from './TratamientoPaciente.module.css';

const TratamientoPaciente = ({ pacienteId }) => {
  const [tratamientos, setTratamientos] = useState([]);
  const [tipoTratamiento, setTipoTratamiento] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precioUnitario, setPrecioUnitario] = useState('');
  const [notasTratamiento, setNotasTratamiento] = useState('');
  const [total, setTotal] = useState(0);
  const [mostrarModalNuevoTratamiento, setMostrarModalNuevoTratamiento] = useState(false);
  const [mostrarModalModificar, setMostrarModalModificar] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [nuevoTratamiento, setNuevoTratamiento] = useState('');
  const [nuevoPrecio, setNuevoPrecio] = useState(0);
  const [nuevoPrecioModal, setNuevoPrecioModal] = useState(precioUnitario);
  const [tratamientosDisponibles, setTratamientosDisponibles] = useState([]);
  const [tratamientoSeleccionado, setTratamientoSeleccionado] = useState(null);
  const toast = useRef(null);

  // Obtener tratamientos del paciente
  const fetchTratamientos = useCallback(() => {
    axios.get(`http://localhost:8000/api/obtener-tratamientos-paciente/${pacienteId}/`)
      .then((response) => {
        setTratamientos(response.data.tratamientos || []);
      })
      .catch((error) => {
        console.error('Error al obtener los tratamientos:', error);
      });
  }, [pacienteId]);

  // Obtener tipos de tratamiento
  const fetchTiposTratamiento = useCallback(() => {
    axios.get('http://localhost:8000/api/tipos-tratamiento/')
      .then((response) => {
        const tratamientosOrdenados = response.data.sort((a, b) => a.nombre.localeCompare(b.nombre));
        setTratamientosDisponibles(tratamientosOrdenados);
      })
      .catch((error) => {
        console.error('Error al obtener los tipos de tratamiento:', error);
      });
  }, []);

  useEffect(() => {
    fetchTratamientos();
    fetchTiposTratamiento();
  }, [fetchTratamientos, fetchTiposTratamiento]);

  // Calcular el total de los tratamientos
  useEffect(() => {
    const nuevoTotal = tratamientos.reduce((acc, tratamiento) => acc + Number(tratamiento.subtotal || 0), 0);
    setTotal(nuevoTotal);
  }, [tratamientos]);

  const handleAgregarNuevoTratamiento = () => {
    const tratamientoExiste = tratamientosDisponibles.some(
      (trat) => trat.nombre.toLowerCase() === nuevoTratamiento.toLowerCase()
    );

    if (tratamientoExiste) {
      toast.current.show({ severity: 'error', summary: 'El tratamiento ya existe en la lista.' });
      return;
    }

    if (nuevoTratamiento && nuevoPrecio > 0) {
      axios.post('http://localhost:8000/api/tipos-tratamiento/agregar/', {
        nombre: nuevoTratamiento,
        precio: nuevoPrecio,
      })
        .then((response) => {
          setTratamientosDisponibles(prev => [...prev, response.data]);
          setNuevoTratamiento('');
          setNuevoPrecio('');
          setMostrarModalNuevoTratamiento(false);
          toast.current.show({ severity: 'success', summary: 'Tratamiento agregado.' });
        })
        .catch((error) => {
          console.error('Error al agregar el nuevo tratamiento:', error);
        });
    } else {
      toast.current.show({ severity: 'warn', summary: 'Nombre y precio válidos requeridos.' });
    }
  };

  const agregarTratamiento = () => {
    if (tipoTratamiento && cantidad > 0 && precioUnitario > 0) {
      const subtotal = cantidad * precioUnitario;
      const nuevoTratamiento = {
        tipo_tratamiento: tipoTratamiento,
        cantidad,
        precio_unitario: precioUnitario,
        subtotal,
        notas: notasTratamiento,
      };

      axios.post(`http://localhost:8000/api/guardar-tratamiento-paciente/${pacienteId}/`, {
        tratamientos: [nuevoTratamiento],
      })
        .then(() => {
          fetchTratamientos();
          limpiarFormulario();
          toast.current.show({ severity: 'success', summary: 'Tratamiento agregado.' });
        })
        .catch(() => {
          toast.current.show({ severity: 'error', summary: 'Error al agregar tratamiento.' });
        });
    }
  };

  const confirmarEliminarTratamiento = (tratamiento) => {
    setTratamientoSeleccionado(tratamiento);
    setMostrarModalEliminar(true);
  };

  const eliminarTratamiento = () => {
    if (tratamientoSeleccionado) {
      axios.delete(`http://localhost:8000/api/eliminar-tratamiento/${tratamientoSeleccionado.id}/`)
        .then(() => {
          fetchTratamientos();
          setMostrarModalEliminar(false);
          toast.current.show({ severity: 'success', summary: 'Tratamiento eliminado.' });
        })
        .catch(() => {
          toast.current.show({ severity: 'error', summary: 'Error al eliminar tratamiento.' });
        });
    }
  };

  const modificarTratamiento = (tratamiento) => {
    setTratamientoSeleccionado(tratamiento);
    setNuevoPrecioModal(tratamiento.precio_unitario);
    setCantidad(tratamiento.cantidad);
    setMostrarModalModificar(true);
  };

  const guardarModificacion = () => {
    if (tratamientoSeleccionado) {
      const datosModificados = {
        cantidad,
        precio_unitario: nuevoPrecioModal,
        notas: tratamientoSeleccionado.notas,
      };

      axios.put(`http://localhost:8000/api/modificar-tratamiento/${tratamientoSeleccionado.id}/`, datosModificados)
        .then(() => {
          fetchTratamientos();
          setMostrarModalModificar(false);
          toast.current.show({ severity: 'success', summary: 'Tratamiento modificado.' });
        })
        .catch(() => {
          toast.current.show({ severity: 'error', summary: 'Error al modificar tratamiento.' });
        });
    }
  };

  const limpiarFormulario = () => {
    setTipoTratamiento('');
    setCantidad('');
    setPrecioUnitario('');
    setNotasTratamiento('');
  };

  return (
    <div className={styles.tratamientoPacienteContainer}>
      <Toast ref={toast} />
      <h3 className="text-center mb-4">Tratamiento del Paciente</h3>
      <Divider />

      <form className="mb-4">
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Tipo de Tratamiento</label>
            <Dropdown
              value={tipoTratamiento}
              options={tratamientosDisponibles}
              onChange={(e) => {
                const selectedTratamiento = tratamientosDisponibles.find(trat => trat.nombre === e.value);
                setTipoTratamiento(e.value);
                setPrecioUnitario(selectedTratamiento ? selectedTratamiento.precio : '');
                setCantidad(1);
              }}
              placeholder="Seleccionar..."
              optionLabel="nombre"
              className="w-full"
            />
          </div>
          <div className={styles.field}>
            <label>Cantidad</label>
            <InputText
              type="number"
              value={cantidad}
              min="1"
              onChange={(e) => setCantidad(parseInt(e.target.value))}
            />
          </div>
          <div className={styles.field}>
            <label>Precio Unitario</label>
            <InputText
              type="number"
              value={precioUnitario}
              readOnly
            />
          </div>
          <div className={styles.field}>
            <label>Notas</label>
            <InputTextarea
              rows={2}
              value={notasTratamiento}
              onChange={(e) => setNotasTratamiento(e.target.value)}
              placeholder="Agregar notas"
            />
          </div>
        </div>
        <Button label="Agregar Tratamiento" icon="pi pi-plus" onClick={agregarTratamiento} className="mt-2" />
      </form>

      <DataTable value={tratamientos} responsiveLayout="scroll" className="mt-4">
        <Column field="tipo_tratamiento" header="Tipo de Tratamiento" />
        <Column field="cantidad" header="Cantidad" />
        <Column field="precio_unitario" header="Precio Unitario" />
        <Column field="subtotal" header="Subtotal" />
        <Column field="notas" header="Notas" body={(rowData) => rowData.notas || 'Sin notas'} />
        <Column
          header="Acciones"
          body={(rowData) => (
            <>
              <Button icon="pi pi-pencil" onClick={() => modificarTratamiento(rowData)} className="mr-2 p-button-warning" />
              <Button icon="pi pi-trash" onClick={() => confirmarEliminarTratamiento(rowData)} className="p-button-danger" />
            </>
          )}
        />
      </DataTable>

      <h4 className="text-right mt-3">Costo Total de Tratamientos: Q{Number(total).toFixed(2)}</h4>

      <Dialog
        header="Agregar Nuevo Tratamiento"
        visible={mostrarModalNuevoTratamiento}
        style={{ width: '30vw' }}
        onHide={() => setMostrarModalNuevoTratamiento(false)}
      >
        <div className={styles.field}>
          <label>Nombre del Tratamiento</label>
          <InputText value={nuevoTratamiento} onChange={(e) => setNuevoTratamiento(e.target.value)} />
        </div>
        <div className={styles.field}>
          <label>Precio</label>
          <InputText type="number" value={nuevoPrecio} onChange={(e) => setNuevoPrecio(parseFloat(e.target.value))} />
        </div>
        <Button label="Agregar" icon="pi pi-check" onClick={handleAgregarNuevoTratamiento} className="mt-3" />
      </Dialog>

      <Dialog
        header="Modificar Tratamiento"
        visible={mostrarModalModificar}
        style={{ width: '30vw' }}
        onHide={() => setMostrarModalModificar(false)}
      >
        <div className={styles.field}>
          <label>Cantidad</label>
          <InputText type="number" value={cantidad} onChange={(e) => setCantidad(parseInt(e.target.value))} />
        </div>
        <div className={styles.field}>
          <label>Nuevo Precio Unitario</label>
          <InputText type="number" value={nuevoPrecioModal} onChange={(e) => setNuevoPrecioModal(parseFloat(e.target.value))} />
        </div>
        <Button label="Guardar Cambios" icon="pi pi-check" onClick={guardarModificacion} className="mt-3" />
      </Dialog>

      <Dialog
        header="Confirmar Eliminación"
        visible={mostrarModalEliminar}
        style={{ width: '30vw' }}
        onHide={() => setMostrarModalEliminar(false)}
      >
        <p>¿Estás seguro de que deseas eliminar el tratamiento "{tratamientoSeleccionado?.tipo_tratamiento}"?</p>
        <Button label="Eliminar" icon="pi pi-trash" onClick={eliminarTratamiento} className="mt-3 p-button-danger" />
      </Dialog>
    </div>
  );
};

export default TratamientoPaciente;
