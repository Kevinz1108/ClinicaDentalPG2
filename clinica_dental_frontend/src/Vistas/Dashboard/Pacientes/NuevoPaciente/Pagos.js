import React, { useState, useRef } from 'react';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import styles from './AgregarPaciente.module.css';

const Pagos = ({ formData, handleChange }) => {
    const [abonoFecha, setAbonoFecha] = useState(null);
    const [abonoMonto, setAbonoMonto] = useState(null);
    const toast = useRef(null);

    const handleAbonoChange = () => {
        if (!abonoFecha || !abonoMonto) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Por favor, ingresa fecha y monto del abono',
                life: 3000,
            });
            return;
        }

        const nuevoAbono = {
            fecha: abonoFecha.toISOString().split('T')[0], // Formato de fecha
            monto: abonoMonto,
        };

        // Actualizar los pagos en formData
        const updatedPagos = [...(formData.pagos || []), nuevoAbono];
        handleChange({ target: { name: 'pagos', value: updatedPagos } });

        toast.current.show({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Abono añadido',
            life: 3000,
        });

        // Resetear los valores después de abonar
        setAbonoFecha(null);
        setAbonoMonto(null);
    };

    return (
        <div className="card p-4" style={{ maxWidth: '95%', margin: 'auto' }}>
            <Toast ref={toast} />

            <div className={styles.field}>
                <label htmlFor="fecha">Fecha de Abono</label>
                <Calendar
                    id="fecha"
                    value={abonoFecha}
                    onChange={(e) => setAbonoFecha(e.value)}
                    dateFormat="dd/mm/yy"
                    showIcon
                    style={{ width: '100%' }}
                />
            </div>

            <div className={styles.field}>
                <label htmlFor="monto">Monto del Abono</label>
                <InputNumber
                    id="monto"
                    value={abonoMonto}
                    onValueChange={(e) => setAbonoMonto(e.value)}
                    mode="currency"
                    currency="GTQ"
                    minFractionDigits={2}
                    style={{ width: '100%' }}
                />
            </div>

            <Button label="Agregar Abono" onClick={handleAbonoChange} className="p-mt-2" />

            {formData.pagos && formData.pagos.length > 0 && (
                <div className="p-mt-4">
                    <h4>Pagos Realizados</h4>
                    <DataTable value={formData.pagos}>
                        <Column field="fecha" header="Fecha" />
                        <Column field="monto" header="Monto" />
                    </DataTable>
                </div>
            )}
        </div>
    );
};

export default Pagos;
