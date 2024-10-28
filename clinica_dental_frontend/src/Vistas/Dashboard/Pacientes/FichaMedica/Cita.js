import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es'; // Importar localización en español para moment.js
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import { Button, Table, Form } from 'react-bootstrap';
import styles from './Citas.module.css';
 
const localizer = momentLocalizer(moment); // Configurar la localización del calendario con moment.js en español

const CitasAgendadas = forwardRef((props, ref) => {
  const { pacienteId } = props; // Obtener el pacienteId de las props
  const [citas, setCitas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [odontologos, setOdontologos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filtroFecha, setFiltroFecha] = useState('');
  const [editingRow, setEditingRow] = useState(null);
  const [formData, setFormData] = useState({});

  const obtenerDatos = async () => {
    try {
      const [citasRes, pacientesRes, odontologosRes] = await Promise.all([
        axios.get('http://localhost:8000/api/obtener-citas/'),
        axios.get('http://localhost:8000/api/obtener-pacientes/'),
        axios.get('http://localhost:8000/api/obtener-dentistas/'),
      ]);
      setCitas(citasRes.data);
      setPacientes(pacientesRes.data);
      setOdontologos(odontologosRes.data);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    moment.locale('es');
    obtenerDatos();
  }, []);

  useImperativeHandle(ref, () => ({
    obtenerDatos,
  }));

  const handleEdit = (cita) => {
    setEditingRow(cita.id);
    setFormData(cita);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`http://localhost:8000/api/actualizar-cita/${id}/`, formData);
      setEditingRow(null);
      obtenerDatos();
    } catch (error) {
      console.error('Error al actualizar la cita:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/eliminar-cita/${id}/`);
      obtenerDatos();
    } catch (error) {
      console.error('Error al eliminar la cita:', error);
    }
  };

  const handleClose = () => {
    setEditingRow(null);
  };
  console.log('pacienteId:', pacienteId);
console.log('filtroFecha:', filtroFecha);
console.log('citas:', citas);  // Todas las citas antes del filtrado


const citasFiltradas = citas.filter((cita) =>
  (!filtroFecha || moment(cita.fecha_cita).isSame(filtroFecha, 'day')) &&
  cita.paciente === pacienteId
);


  const handleFechaChange = (e) => {
    setFiltroFecha(e.target.value);
  };

  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo.start);
    setFiltroFecha(moment(slotInfo.start).format('YYYY-MM-DD'));
  };

  return (
    <div className={styles.container}>
      <h1 className="mb-4" style={{ justifyContent: 'center' }}>Citas Agendadas</h1>

      <Form.Group controlId="filtroFecha" className="mt-4">
        <Form.Label style={{ color: '#b4c8dc' }}>Filtrar por fecha</Form.Label>
        <Form.Control
          type="date"
          value={filtroFecha}
          onChange={handleFechaChange}
          className="mb-4"
        />
      </Form.Group>

      <div className="mt-4">
        <h5>Citas para {filtroFecha ? moment(filtroFecha).format('DD/MM/YYYY') : 'todas las fechas'}</h5>
        <Table striped bordered hover responsive>
          <thead style={{ backgroundColor: '#b4c8dc' }}>
            <tr>
              <th>Paciente</th>
              <th>Tipo de Cita</th>
              <th>Fecha de Cita</th>
              <th>Hora Inicio</th>
              <th>Hora Fin</th>
              <th>Odontólogo a Cargo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citasFiltradas.length > 0 ? (
              citasFiltradas.map((cita) => (
                <tr key={cita.id}>
                  {editingRow === cita.id ? (
                    <>
                      <td>
                        <Form.Control
                          as="select"
                          name="paciente"
                          value={formData.paciente || ''}
                          onChange={handleChange}
                        >
                          <option value="">Seleccione un paciente...</option>
                          {pacientes.map((paciente) => (
                            <option key={paciente.id} value={paciente.id}>
                              {`${paciente.nombre} ${paciente.apellido}`}
                            </option>
                          ))}
                        </Form.Control>
                      </td>

                      <td>
                        <Form.Control
                          as="select"
                          name="tipo_cita"
                          value={formData.tipo_cita || ''}
                          onChange={handleChange}
                        >
                          <option value="">Seleccione el tipo de cita...</option>
                          <option value="Consulta">Consulta</option>
                          <option value="Limpieza">Limpieza</option>
                          <option value="Ortodoncia">Ortodoncia</option>
                        </Form.Control>
                      </td>

                      <td>
                        <Form.Control
                          type="date"
                          name="fecha_cita"
                          value={formData.fecha_cita || ''}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="time"
                          name="hora_inicio"
                          value={formData.hora_inicio || ''}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="time"
                          name="hora_fin"
                          value={formData.hora_fin || ''}
                          onChange={handleChange}
                        />
                      </td>

                      <td>
                        <Form.Control
                          as="select"
                          name="odontologo"
                          value={formData.odontologo || ''}
                          onChange={handleChange}
                        >
                          <option value="">Seleccione un odontólogo...</option>
                          {odontologos.map((odontologo) => (
                            <option key={odontologo.id} value={odontologo.id}>
                              {`${odontologo.nombre} ${odontologo.apellido}`}
                            </option>
                          ))}
                        </Form.Control>
                      </td>

                      <td>
                        <Button variant="success" size="sm" onClick={() => handleSave(cita.id)}>Guardar</Button>{' '}
                        <Button variant="secondary" size="sm" onClick={handleClose}>Cerrar</Button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{cita.paciente_nombre}</td>
                      <td>{cita.tipo_cita}</td>
                      <td>{moment(cita.fecha_cita).format('DD/MM/YYYY')}</td>
                      <td>{cita.hora_inicio}</td>
                      <td>{cita.hora_fin}</td>
                      <td>{cita.odontologo_nombre}</td>
                      <td>
                        <Button variant="warning" size="sm" onClick={() => handleEdit(cita)}>Editar</Button>{' '}
                        <Button variant="danger" size="sm" onClick={() => handleDelete(cita.id)}>Eliminar</Button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No hay citas para la fecha seleccionada
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <Calendar
        localizer={localizer}
        events={citasFiltradas.map((cita) => ({
          title: `${cita.paciente_nombre} - ${cita.tipo_cita}`,
          start: new Date(`${cita.fecha_cita}T${cita.hora_inicio}`),
          end: new Date(`${cita.fecha_cita}T${cita.hora_fin}`),
          allDay: false,
          odontologo: cita.odontologo_nombre,
        }))}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500
        }}
        views={['month']} // Solo la vista de mes está disponible
        defaultView="month"
        onSelectSlot={handleSelectSlot} // Seleccionar día en el calendario
        selectable
        messages={{
          next: 'Sig.',
          previous: 'Ant.',
          today: 'Hoy',
          month: 'Mes',
          noEventsInRange: 'No hay eventos en este rango.',
        }}
      />
    </div>
  );
});

export default CitasAgendadas;
