import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Divider } from 'primereact/divider';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import styles from './RadiografiaPaciente.module.css';

const RadiografiaPaciente = ({ pacienteId }) => {
  const [radiografias, setRadiografias] = useState([]);
  const [selectedRadiografia, setSelectedRadiografia] = useState(null);
  const [showZoomDialog, setShowZoomDialog] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [radiografiaToDelete, setRadiografiaToDelete] = useState(null);
  const [notas, setNotas] = useState('');
  const [nombreArchivo, setNombreArchivo] = useState('');
  const [newRadiografia, setNewRadiografia] = useState(null);
  const toast = useRef(null);

  const handleShowConfirmDelete = (radiografia) => {
    setRadiografiaToDelete(radiografia);
    setShowConfirmDelete(true);
  };

  const handleDeleteRadiografia = () => {
    if (radiografiaToDelete) {
      axios.delete(`http://localhost:8000/api/radiografias/eliminar/${radiografiaToDelete.id}/`)
        .then(() => {
          setRadiografias(radiografias.filter(r => r.id !== radiografiaToDelete.id));
          toast.current.show({ severity: 'success', summary: 'Radiografía eliminada', life: 3000 });
          setShowConfirmDelete(false);
        })
        .catch(() => {
          toast.current.show({ severity: 'error', summary: 'Error al eliminar la radiografía', life: 3000 });
        });
    }
  };

  useEffect(() => {
    if (!pacienteId) {
      console.warn("pacienteId no está definido.");
      return;
    }
  
    axios.get(`http://localhost:8000/api/radiografias/${pacienteId}/`)
      .then(response => {
        const formattedRadiografias = response.data.map(radiografia => ({
          ...radiografia,
          src: radiografia.imagen_url,  // Usar imagen_url
        }));
        setRadiografias(formattedRadiografias);
      })
      .catch(() => {
        toast.current.show({ severity: 'error', summary: 'Error al cargar radiografías', life: 3000 });
      });
  }, [pacienteId]);


  const handleFileChange = (e) => {
    setNewRadiografia(e.target.files[0]);
    setNombreArchivo(e.target.files[0]?.name || '');
  };

  const handleRadiografiaClick = (radiografia) => {
    setSelectedRadiografia(radiografia);
    setNotas(radiografia.notas || '');
    setShowZoomDialog(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newRadiografia) {
      toast.current.show({ severity: 'warn', summary: 'Selecciona una radiografía antes de subir', life: 3000 });
      return;
    }

    const formData = new FormData();
    formData.append('imagen', newRadiografia);
    formData.append('notas', notas);
    formData.append('paciente_id', pacienteId);
    formData.append('nombre_archivo', nombreArchivo);

    axios.post(`http://localhost:8000/api/radiografias/subir/${pacienteId}/`, formData)
      .then(() => {
        setRadiografias(prev => [...prev, {
          id: Date.now(),
          imagen: newRadiografia,
          notas,
          fecha_tomada: new Date().toISOString(),
          nombre_archivo: nombreArchivo,
          src: URL.createObjectURL(newRadiografia)
        }]);
        setNewRadiografia(null);
        setNombreArchivo('');
        setNotas('');
        toast.current.show({ severity: 'success', summary: 'Radiografía subida', life: 3000 });
      })
      .catch(() => {
        toast.current.show({ severity: 'error', summary: 'Error al subir radiografía', life: 3000 });
      });
  };

  const swiperSettings = {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 3,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
    pagination: { clickable: true },
    modules: [EffectCoverflow, Pagination],
    className: 'mySwiper',
  };

  return (
    <div className={styles.radiografiaContainer}>
      <Toast ref={toast} />
      <h3 className="text-center mb-4" style={{ color: '#b4c8dc' }}>Ficha de Radiografía</h3>
      <Divider />

      <form onSubmit={handleSubmit} className="mb-4">
        <div className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor="formFile">Subir nueva radiografía</label>
            <InputText type="file" onChange={handleFileChange} />
          </div>
          <div className={styles.field}>
            <label htmlFor="formNotas">Notas de la radiografía</label>
            <InputTextarea
              rows={2}
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Agregar notas sobre la radiografía"
            />
          </div>
        </div>
        <Button label="Subir Radiografía" icon="pi pi-upload" type="submit" className="mt-2" />
      </form>

      <Swiper {...swiperSettings}>
        {radiografias.map((radiografia) => (
          <SwiperSlide key={radiografia.id}>
            <div className={styles.radiografiaThumbnail}>
              <img
                src={radiografia.src}
                alt={`Radiografía del ${radiografia.fecha_tomada}`}
                style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                onClick={() => handleRadiografiaClick(radiografia)}
              />
              <p className={styles.thumbnailText}>{radiografia.nombre_archivo.split('.').slice(0, -1).join('.')}</p>
              <p className={styles.thumbnailText}>
                Tomada el: {new Date(radiografia.fecha_tomada).toLocaleDateString()}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <Dialog
        header="Detalles de la radiografía"
        visible={showZoomDialog}
        style={{ width: '50vw' }}
        onHide={() => setShowZoomDialog(false)}
      >
        {selectedRadiografia && (
          <div className={styles.zoomContainer}>
            <p>Fecha de subida: {selectedRadiografia.fecha_tomada}</p>
            <img src={selectedRadiografia.src} alt="Radiografía detallada" className={styles.zoomedImage} />
            <InputTextarea
              rows={3}
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              readOnly
              className="mt-3"
            />
          </div>
        )}
      </Dialog>

      <Dialog
        header="Confirmar eliminación"
        visible={showConfirmDelete}
        style={{ width: '30vw' }}
        footer={() => (
          <div>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={() => setShowConfirmDelete(false)} />
            <Button label="Eliminar" icon="pi pi-trash" className="p-button-danger" onClick={handleDeleteRadiografia} />
          </div>
        )}
        onHide={() => setShowConfirmDelete(false)}
      >
        <p>¿Estás seguro de que deseas eliminar esta radiografía?</p>
      </Dialog>

      <div className="mt-4">
        <h4>Historial de Radiografías</h4>
        <DataTable value={radiografias} responsiveLayout="scroll">
          <Column field="nombre_archivo" header="Nombre de Radiografía" body={(rowData) => rowData.nombre_archivo.split('.').slice(0, -1).join('.')} />
          <Column field="imagen" header="Radiografía" body={(rowData) => <img src={rowData.src} alt="Radiografía" style={{ width: '100px' }} />} />
          <Column field="fecha_tomada" header="Fecha" body={(rowData) => new Date(rowData.fecha_tomada).toLocaleDateString()} />
          <Column field="notas" header="Notas" body={(rowData) => rowData.notas || 'Sin Notas'} />
          <Column
            header="Acciones"
            body={(rowData) => (
              <>
                <Button icon="pi pi-pencil" onClick={() => handleRadiografiaClick(rowData)} className="mr-2 p-button-warning" />
                <Button icon="pi pi-trash" onClick={() => handleShowConfirmDelete(rowData)} className="p-button-danger" />
              </>
            )}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default RadiografiaPaciente;
