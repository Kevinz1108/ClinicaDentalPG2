// src/Vistas/Dashboard/Pacientes/ComponenteDetallePagos.js
import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import styles from './RegistrarPago.module.css';

const ComponenteDetallePagos = ({
  detallePagos,
  tratamientos,
  selectedTratamiento,
  setSelectedTratamiento,
  pacienteNombre,
  pacienteApellido,
  handleModificar,
  handleGuardar,
  handleCerrar,
  handleEliminar,
  editPagoId,
  editAbono,
  setEditAbono,
  editTratamiento,
  setEditTratamiento,
  ocultarFiltro,
}) => {
  
  const handleChangeTratamiento = (e) => {
    setSelectedTratamiento(e.value);
  };

  const handleTratamientoChange = (e) => {
    setEditTratamiento(e.value);
  };

  const handleAbonoChange = (e) => {
    setEditAbono(e.value);
  };

  const formatFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
  };

  const pagosFiltrados = selectedTratamiento
    ? detallePagos.filter((pago) => Number(pago.tratamiento_id) === Number(selectedTratamiento))
    : detallePagos;

  return (
    <div className={styles.container}>
      <h4 className="mb-4" style={{ }}>Detalle de Pagos</h4>

      {!ocultarFiltro && (
        <div className={styles.field}>
          <label htmlFor="tratamiento">Filtrar por Tratamiento</label>
          <Dropdown
            id="tratamiento"
            value={selectedTratamiento}
            options={tratamientos}
            onChange={handleChangeTratamiento}
            optionValue="id"
            optionLabel="tratamiento_nombre"
            placeholder="Todos los Tratamientos"
            className="w-full"
          />
        </div>
      )}

      <DataTable value={pagosFiltrados} className="p-datatable-sm p-datatable-striped">
        <Column field="paciente" header="Nombre Paciente" body={() => `${pacienteNombre} ${pacienteApellido}`} />
        <Column field="tratamiento_nombre" header="Tratamiento" body={(rowData) => (
          editPagoId === rowData.id ? (
            <Dropdown
              value={editTratamiento || rowData.tratamiento_id}
              options={tratamientos}
              onChange={handleTratamientoChange}
              optionLabel="tratamiento_nombre"
              className="w-full"
            />
          ) : rowData.tratamiento_nombre
        )} />
        <Column field="fecha" header="Fecha" body={(rowData) => formatFecha(rowData.fecha)} />
        <Column field="monto" header="Monto" body={(rowData) => (
          editPagoId === rowData.id ? (
            <InputNumber
              value={editAbono || rowData.monto}
              onChange={(e) => handleAbonoChange(e)}
              mode="currency"
              currency="GTQ"
              className="w-full"
            />
          ) : `Q ${rowData.monto}`
        )} />
        <Column field="saldo" header="Saldo" body={(rowData) => {
          const totalPagado = detallePagos.reduce((acc, pago) => acc + pago.monto, 0);
          const saldoRestante = rowData.precio_tratamiento - totalPagado;
          return `Q ${saldoRestante.toFixed(2)}`;
        }} />
        <Column header="Acciones" body={(rowData) => (
          editPagoId === rowData.id ? (
            <>
              <Button label="Guardar" icon="pi pi-save" className="p-button-success mr-2" onClick={() => handleGuardar(rowData.id)} />
              <Button label="Cerrar" icon="pi pi-times" className="p-button-secondary" onClick={handleCerrar} />
            </>
          ) : (
            <>
              <Button label="Modificar" icon="pi pi-pencil" className="p-button-warning mr-2" onClick={() => handleModificar(rowData)} />
              <Button label="Eliminar" icon="pi pi-trash" className="p-button-danger" onClick={() => handleEliminar(rowData.id)} />
            </>
          )
        )} />
      </DataTable>
    </div>
  );
};

export default ComponenteDetallePagos;
