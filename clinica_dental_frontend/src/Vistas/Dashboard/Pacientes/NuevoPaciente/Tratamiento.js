import styles from './AgregarPaciente.module.css'; 
import React, { useState, useRef, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import axios from 'axios';

const Tratamiento = ({ formData, handleChange, especialidadId }) => {
    const [categorias, setCategorias] = useState([]);
    const [tratamientos, setTratamientos] = useState([]);
    const [selectedCategoria, setSelectedCategoria] = useState(null);
    const [selectedTratamiento, setSelectedTratamiento] = useState(null);
    const [cantidad, setCantidad] = useState(1);
    const [precioUnitario, setPrecioUnitario] = useState(0);
    const [notasTratamiento, setNotasTratamiento] = useState('');
    const [mostrarDialogoModificar, setMostrarDialogoModificar] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        if (especialidadId) {
            axios.get(`http://localhost:8000/api/categorias/${especialidadId}/`)
                .then(response => {
                    setCategorias(response.data);
                    console.log("Categorías recibidas: ", response.data);
                })
                .catch(error => console.error('Error al cargar categorías:', error));
        }
    }, [especialidadId]);

    useEffect(() => {
        if (selectedCategoria) {
            axios.get(`http://localhost:8000/api/tratamientos/${selectedCategoria}/`)
                .then(response => setTratamientos(response.data))
                .catch(error => console.error('Error al cargar tratamientos:', error));
        }
    }, [selectedCategoria]);

    const handleAgregarTratamiento = (e) => {
        e.preventDefault();
        
        console.log("ID de tratamiento seleccionado al agregar:", selectedTratamiento);

        if (!selectedTratamiento) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Seleccione un tratamiento válido', life: 3000 });
            return;
        }

        const nuevoTratamiento = {
            tipo_tratamiento: selectedTratamiento,  // Enviar solo el ID
            cantidad,
            precio_unitario: precioUnitario,
            subtotal: cantidad * precioUnitario,
            notas: notasTratamiento
        };

        const updatedTratamientos = [...(formData.tratamientos || []), nuevoTratamiento];
        handleChange({ target: { name: 'tratamientos', value: updatedTratamientos } });
        
        console.log("Tratamiento añadido al formData:", nuevoTratamiento);
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Tratamiento añadido temporalmente', life: 3000 });
        limpiarFormulario();
    };

    const limpiarFormulario = () => {
        setSelectedCategoria(null);
        setSelectedTratamiento(null);
        setCantidad(1);
        setPrecioUnitario(0);
        setNotasTratamiento('');
    };

    const confirmarModificarTratamiento = (tratamiento, index) => {
        setCantidad(tratamiento.cantidad);
        setPrecioUnitario(tratamiento.precio_unitario);
        setMostrarDialogoModificar(true);
    };

    const modificarTratamiento = (index) => {
        const updatedTratamientos = formData.tratamientos.map((tratamiento, i) =>
            i === index ? { ...tratamiento, cantidad, precio_unitario: precioUnitario } : tratamiento
        );

        handleChange({ target: { name: 'tratamientos', value: updatedTratamientos } });
        setMostrarDialogoModificar(false);
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Tratamiento modificado temporalmente', life: 3000 });
    };

    return (
        <div className="card p-4" style={{ maxWidth: '95%', margin: 'auto' }}>
            <Toast ref={toast} />
            <form className="p-fluid">
                <div className={styles.grid}>
                    <div className={styles.field}>
                        <label htmlFor="categoria">Categoria</label>
                        <Dropdown
                            id="categoria"
                            value={selectedCategoria}
                            options={categorias.map(cat => ({ label: cat.nombre, value: cat.id }))}
                            onChange={(e) => setSelectedCategoria(e.value)}
                            placeholder="Seleccione una categoría"
                        />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="tratamiento">Tratamiento</label>
                        <Dropdown
    id="tratamiento"
    value={selectedTratamiento}
    options={tratamientos.map(trat => ({ label: trat.nombre, value: trat.id }))} // Asegura que el valor sea solo el ID
    onChange={(e) => {
        setSelectedTratamiento(e.value); // Guarda solo el ID aquí
        const tratamientoSeleccionado = tratamientos.find(trat => trat.id === e.value);
        setPrecioUnitario(tratamientoSeleccionado ? tratamientoSeleccionado.precio : 0);  // Obtiene el precio del tratamiento
        console.log("ID de tratamiento seleccionado (solo ID):", e.value); // Verifica que solo el ID se guarde
    }}
    placeholder="Seleccione un tratamiento"
/>

                    </div>
                    <div className={styles.field}>
                        <label htmlFor="cantidad">Cantidad</label>
                        <InputText id="cantidad" value={cantidad} onChange={(e) => setCantidad(parseInt(e.target.value, 10))} />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="precioUnitario">Precio Unitario (Q)</label>
                        <InputText id="precioUnitario" value={precioUnitario} onChange={(e) => setPrecioUnitario(parseFloat(e.target.value))} />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="notasTratamiento">Notas</label>
                        <InputText id="notasTratamiento" value={notasTratamiento} onChange={(e) => setNotasTratamiento(e.target.value)} />
                    </div>
                </div>
                <Button label="Agregar Tratamiento" icon="pi pi-plus" onClick={handleAgregarTratamiento} className="mt-3" />
            </form>
            <DataTable value={formData.tratamientos || []} className="mt-5">
                <Column field="tipo_tratamiento" header="Tipo de Tratamiento" />
                <Column field="cantidad" header="Cantidad" />
                <Column field="precio_unitario" header="Precio Unitario (Q)" />
                <Column field="subtotal" header="Subtotal (Q)" />
                <Column field="notas" header="Notas" />
                <Column
                    body={(rowData, { rowIndex }) => (
                        <>
                            <Button label="Modificar" icon="pi pi-pencil" className="p-button-warning p-mr-2" onClick={() => confirmarModificarTratamiento(rowData, rowIndex)} />
                        </>
                    )}
                    header="Acciones"
                />
            </DataTable>
            <h4 className="text-right">Total: Q{formData.tratamientos ? formData.tratamientos.reduce((acc, t) => acc + t.subtotal, 0).toFixed(2) : '0.00'}</h4>
            <Dialog header="Modificar Tratamiento" visible={mostrarDialogoModificar} style={{ width: '50vw' }} onHide={() => setMostrarDialogoModificar(false)}>
                <div className="p-field">
                    <label htmlFor="cantidadModificar">Cantidad</label>
                    <InputText id="cantidadModificar" value={cantidad} onChange={(e) => setCantidad(parseInt(e.target.value, 10))} />
                </div>
                <div className="p-field">
                    <label htmlFor="precioUnitarioModificar">Precio Unitario (Q)</label>
                    <InputText id="precioUnitarioModificar" value={precioUnitario} onChange={(e) => setPrecioUnitario(parseFloat(e.target.value))} />
                </div>
                <Button label="Guardar Cambios" icon="pi pi-save" onClick={modificarTratamiento} />
            </Dialog>
        </div>
    );
};

export default Tratamiento;
