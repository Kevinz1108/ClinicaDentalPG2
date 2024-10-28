import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import axios from 'axios';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import styles from './ListaTratamientos.module.css'; // CSS Module para estilo personalizado

const ListaTratamientos = () => {
    const [tratamientos, setTratamientos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Cargar tratamientos desde la API
        axios.get('http://localhost:8000/api/tipos-tratamiento/')
            .then(response => {
                setTratamientos(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al cargar tratamientos:', error);
                setLoading(false);
            });
    }, []);

    const renderActions = (rowData) => (
        <>
            <Button
                icon="pi pi-pencil"
                severity="warning"
                onClick={() => handleEdit(rowData)}
                className="mr-2"
            />
            <Button
                icon="pi pi-trash"
                severity="danger"
                onClick={() => handleDelete(rowData)}
            />
        </>
    );

    const handleEdit = (rowData) => {
        console.log("Edit treatment:", rowData);
        // Implementar la lógica de edición aquí
    };

    const handleDelete = (rowData) => {
        console.log("Delete treatment:", rowData);
        // Implementar la lógica de eliminación aquí
    };

    return (
        <div className={styles.card}>
            <h2 className={styles.title}>Lista de Tratamientos Registrados</h2>

            <DataTable
                value={tratamientos}
                responsiveLayout="scroll"
                paginator
                rows={5}
                loading={loading}
                emptyMessage="Sin registro de Tratamientos"
            >
                <Column field="nombre" header="Nombre" />
                <Column field="categoria" header="Categoría" />
                <Column field="especialidad" header="Especialidad" />
                <Column 
                        field="precio" 
                        header="Precio (Q)" 
                        body={(rowData) => 
                            typeof rowData.precio === 'number' 
                                ? rowData.precio.toFixed(2) 
                                : 'N/A' // Muestra 'N/A' si no hay precio
                        } 
                    />
                <Column header="Acción" body={renderActions} />
            </DataTable>
        </div>
    );
};

export default ListaTratamientos;
