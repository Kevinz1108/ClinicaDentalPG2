// src/Vistas/Dashboard/Pacientes/ComponenteResumenSaldos.js
import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import styles from './Pagos.module.css';

const PagoResumen = ({ saldoData, pacienteNombre, pacienteApellido, ocultarFiltro }) => {

    const formatCurrency = (value) => {
        return `Q ${value.toFixed(2)}`;
    };

    return (
        <div className={styles.container}>
            <h4 className="mb-4" style={{ }}>Resumen de Saldos</h4>
            
            <DataTable value={saldoData} className="p-datatable-sm p-datatable-striped" responsiveLayout="scroll">
                <Column field="paciente" header="Nombre Paciente" body={() => `${pacienteNombre} ${pacienteApellido}`} />
                <Column field="tratamiento_nombre" header="Tratamientos" />
                <Column field="precio_tratamiento" header="Precio Tratamiento" body={(rowData) => formatCurrency(rowData.precio_tratamiento)} />
                <Column field="abono" header="Abono" body={(rowData) => formatCurrency(rowData.abono)} />
                <Column field="saldo" header="Saldo" body={(rowData) => formatCurrency(rowData.saldo)} />

                {saldoData.length === 0 && (
                    <tr>
                        <td colSpan="5" className="text-center">No hay datos de saldo para este paciente.</td>
                    </tr>
                )}
            </DataTable>
        </div>
    );
};

export default PagoResumen;
