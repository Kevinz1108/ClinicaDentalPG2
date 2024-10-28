import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';

const Radiografia = ({ formData, handleChange }) => {
    const [selectedRadiografia, setSelectedRadiografia] = useState(null);
    const [showUploadDialog, setShowUploadDialog] = useState(false);
    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const toast = useRef(null);

    const handleFileUpload = (event) => {
        const file = event.files[0];
        setSelectedFile(file);
        handleChange({ target: { name: 'radiografiasNombreArchivo', value: file.name } });
    };

    const handleAddRadiografia = () => {
        if (!selectedFile) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Selecciona un archivo de radiografía.', life: 3000 });
            return;
        }
    
        const newRadiografia = {
            imagen: selectedFile,
            nombre_archivo: selectedFile.name,
            notas: formData.radiografiasNotas || '',
            fecha_tomada: formData.radiografiasFecha || ''
        };

    // Agregar la nueva radiografía a formData
    const updatedRadiografias = [...(formData.radiografias || []), newRadiografia];
    handleChange({ target: { name: 'radiografias', value: updatedRadiografias } });
    setShowUploadDialog(false);
    setSelectedFile(null); // Limpiar el archivo seleccionado
    toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Radiografía añadida temporalmente', life: 3000 });
};

    const handleEditRadiografia = (radiografia, index) => {
        setSelectedRadiografia(radiografia);
        handleChange({ target: { name: 'radiografiasNotas', value: radiografia.notas } });
        handleChange({ target: { name: 'radiografiasFecha', value: radiografia.fecha_tomada } });
        setShowEditDialog(true);
    };

    const handleSaveEdit = (index) => {
        const updatedRadiografias = formData.radiografias.map((radiografia, i) =>
            i === index
                ? { ...radiografia, fecha_tomada: formData.radiografiasFecha, notas: formData.radiografiasNotas }
                : radiografia
        );
        handleChange({ target: { name: 'radiografias', value: updatedRadiografias } });
        setShowEditDialog(false);
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Radiografía modificada temporalmente', life: 3000 });
    };

    return (
        <div className="card p-4" style={{ maxWidth: '95%', margin: 'auto' }}>
            <Toast ref={toast} />
            <h3 className="text-center">Radiografías del Paciente</h3>

            <Button label="Subir nueva radiografía" icon="pi pi-upload" className="mt-3" onClick={() => setShowUploadDialog(true)} />

            <DataTable value={formData.radiografias || []} className="mt-5">
                <Column field="nombre_archivo" header="Nombre de Radiografía" />
                
                <Column field="notas" header="Notas" />
                <Column
                    body={(rowData, { rowIndex }) => (
                        <>
                            
                            <Button label="Modificar" icon="pi pi-pencil" className="p-button-warning p-mr-2" onClick={() => handleEditRadiografia(rowData, rowIndex)} />
                        </>
                    )}
                    header="Acciones"
                />
            </DataTable>
{/* Diálogo para subir nueva radiografía */}
<Dialog header="Subir Nueva Radiografía" visible={showUploadDialog} style={{ width: '50vw' }} onHide={() => setShowUploadDialog(false)}>
    <div className="flex py-4 gap-2">
        <FileUpload name="demo[]" customUpload uploadHandler={handleFileUpload} mode="basic" accept="image/*" auto chooseLabel="Seleccionar Archivo" />
    </div>
    
    {/* Mostrar el nombre del archivo seleccionado */}
    <div className="flex py-4 gap-2 p-field">
        <label htmlFor="nombreArchivo">Nombre Radiografía</label>
        <p id="nombreArchivo">
            {selectedFile ? selectedFile.name : "No se ha seleccionado un archivo"}
        </p>
    </div>

    <div className="flex py-4 gap-2 p-field">
        <label htmlFor="notas">Notas</label>
        <InputText id="notas" value={formData.radiografiasNotas || ''} onChange={(e) => handleChange({ target: { name: 'radiografiasNotas', value: e.target.value } })} />
    </div>
    
    <Button label="Subir" icon="pi pi-check" onClick={handleAddRadiografia} />
</Dialog>


            {/* Diálogo para ver detalles de radiografía */}
            <Dialog header="Detalles de la Radiografía" visible={showDetailDialog} style={{ width: '50vw' }} onHide={() => setShowDetailDialog(false)}>
                {selectedRadiografia && (
                    <div>
                        <img src={selectedRadiografia.src} alt="Radiografía" style={{ width: '100%' }} />
                        <p><strong>Fecha tomada:</strong> {selectedRadiografia.fecha_tomada}</p>
                        <p><strong>Notas:</strong> {selectedRadiografia.notas || 'Sin notas'}</p>
                    </div>
                )}
            </Dialog>

            {/* Diálogo para modificar radiografía */}
            <Dialog header="Modificar Radiografía" visible={showEditDialog} style={{ width: '50vw' }} onHide={() => setShowEditDialog(false)}>
                <div className="p-field">
                    <label htmlFor="fechaModificar">Fecha de la Radiografía</label>
                    <InputText id="fechaModificar" value={formData.radiografiasFecha || ''} onChange={(e) => handleChange({ target: { name: 'radiografiasFecha', value: e.target.value } })} />
                </div>
                <div className="p-field">
                    <label htmlFor="notasModificar">Notas</label>
                    <InputText id="notasModificar" value={formData.radiografiasNotas || ''} onChange={(e) => handleChange({ target: { name: 'radiografiasNotas', value: e.target.value } })} />
                </div>
                <FileUpload name="demo[]" customUpload uploadHandler={handleFileUpload} mode="basic" accept="image/*" auto chooseLabel="Seleccionar Archivo" />
                <Button label="Guardar Cambios" icon="pi pi-save" onClick={() => handleSaveEdit(selectedRadiografia.id)} />
            </Dialog>
        </div>
    );
};

export default Radiografia;
