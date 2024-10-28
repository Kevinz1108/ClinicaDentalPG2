import React, { useRef } from 'react';
import{Routes, Route, useNavigate} from 'react-router-dom';
import styles from './Dashboard.module.css';
import { PanelMenu } from 'primereact/panelmenu';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Avatar } from 'primereact/avatar';
import logo from '../../assets/logo-odontologia.png';
import { Badge } from 'primereact/badge';

import AgregarDentista from './Dentistas/AgregarDentista';
import DentistasRegistrados from './Dentistas/DentistasRegistrados';

import AgregarPaciente from './Pacientes/NuevoPaciente/AgregarPaciente';
import PacientesRegistrados from '../Dashboard/Pacientes/Pacientes Registrados/PacientesRegistrados';
import FichasClinicas from './Pacientes/FichaMedica/FichasClinicas';

import AgendarCita from './Citas/AgendarCita';
import CitasAgendadas from '../Dashboard/Citas/CitasAgendadas';

import RegistrarPago from './Saldos/RegistrarPago';
import Saldos from './Saldos/Saldos';

import AgregarTratamiento from './Tratamientos/AgregarTratamiento';
import ListaTratamientos from './Tratamientos/ListaTratamientos';

import CrearCargo from './Empleados/CrearCargo';
import RegistrarEmpleado from './Empleados/RegistrarEmpleados';
import ListaEmpleados from './Empleados/ListaEmpleados';



const Dashboard = () => {
    const toast = useRef(null);
    const navigate=useNavigate();

    const items = [

        {
            label: 'Dentistas',
            icon: 'pi pi-users',
            items: [
                { 
                    label: 'Agregar Dentista',
                    icon: 'pi pi pi-plus',
                    command: () => navigate('agregar-dentista')
                },
                { 
                    label: 'Dentistas Registrados', 
                    icon: 'pi pi-users',
                    command: () => navigate('dentistas-registrados')
                }
            ]
        },
        {
            label: 'Pacientes',
            icon: 'pi pi-address-book',
            items: [
                { 
                    label: 'Agregar Paciente',
                    icon: 'pi pi pi-plus' ,
                    command:()=> navigate('agregar-paciente')
                },
                { 
                    label: 'Pacientes Registrados', 
                    icon: 'pi pi-users',
                    command:()=> navigate('pacientes-registrados')
                 },
                { 
                    label: 'Fichas Clinicas', 
                    icon: 'pi pi-folder',
                    command:()=> navigate('fichas-clinicas')
                 },
            ]
        },
        {
            label: 'Citas',
            icon: 'pi pi-calendar',
            items: [
                { 
                    label: 'Agregar Cita', 
                    icon: 'pi pi-plus',
                    command:()=> navigate('agendar-cita')
                 },
                { 
                    label: 'Citas Agendadas', 
                    icon: 'pi pi-calendar',
                    command:()=> navigate('citas-agendadas') 
                }
            ]
        },
        {
            label: 'Saldos',
            icon: 'pi pi-money-bill',
            items: [
                { 
                    label: 'Hacer Pago',
                    icon: 'pi pi-plus',
                    command:()=> navigate('registrar-pago')
                },
                { 
                    label: 'Ver Pagos', 
                    icon: 'pi pi-wallet',
                    command:()=> navigate('ver-pagos')
                
                }
            ]
        },
        {
            label: 'Tratamientos',
            icon: 'pi pi-inbox',
            items: [
                { 
                    label: 'Agregar Tratamiento',
                    icon: 'pi pi-plus',
                    command:()=> navigate('agregar-tratamiento')
                },
                { 
                    label: 'Lista Tratamientos', 
                    icon: 'pi pi-file-edit',
                    command:()=> navigate('lista-tratamientos')
                
                }
            ]
        },
        {
            label: 'Empleados',
            icon: 'pi pi-users',
            items: [

                { 
                    label: 'Registrar Empleado', 
                    icon: 'pi pi-users',
                    command:()=> navigate('registrar-empleado') 
                },
                { 
                    label: 'Lista de Empleados', 
                    icon: 'pi pi-list' ,
                    command:()=> navigate('lista-empleados') 
                },
                { 
                    label: 'Crear Rol o Cargo', 
                    icon: 'pi pi-plus' ,
                    command:()=> navigate('crear-cargo')
                },
            ]
        },
        { label: 'Cerrar Sesión', icon: 'pi pi-sign-out' }
    ];

    const startContent = (
        <div className="flex align-items-center gap-2">
            <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" size="large" shape="circle" />
            <span className="font-bold text-black">Dra. Karen Juárez</span>
            
        </div>
    );

    const centerContent = (
        <div className="flex align-items-center gap-3">

        </div>
    );

    const endContent = (
        <div className="flex align-items-center gap-2">
             <button className="p-link text-black h-3rem w-3rem border-circle">
             <i className="pi pi-bell p-overlay-badge" style={{ fontSize: '1.5rem' }}>
                <Badge value="2"></Badge>
            </i>
            </button>
            
            <button className="p-link text-black h-3rem w-3rem border-circle">
            <i className="pi pi-calendar p-overlay-badge" style={{ fontSize: '1.5rem' }}>
                <Badge value="5+" severity="danger"></Badge>
            </i>
            </button>
            <button className="p-link text-black h-3rem w-3rem border-circle">
            <i className="pi pi-envelope p-overlay-badge" style={{ fontSize: '1.5rem' }}>
                <Badge severity="danger"></Badge>
            </i>
            </button>
            <button className="p-link text-black h-3rem w-3rem border-circle">
            <i className="pi pi-ellipsis-v " style={{ fontSize: '1.5rem' }}></i>
            </button>
        </div>
        
    );

    return (
        <div className={`${styles.dashboardContainer}  bg-green-100`}>
            <div className={styles.sidebar}>
                <div className={styles.logo}>
                    <img src={logo} alt="Logo" />
                    <span>Odontología Especializada</span>
                </div>
                <PanelMenu model={items} className={styles.panelMenu} />
            </div>
            <div className={styles.content}>
                <Toolbar
                    
                    start={startContent}
                    end={endContent}
                    className="bg-gray-900 shadow-2"
                    style={{
                        borderRadius: '1rem',
                        marginBottom: '1rem',
                        backgroundImage: 'linear-gradient(to right, var(--bluegray-50), var(--bluegray-50))'
                    }}
                />
                <Routes>
                    <Route path='/' element={<h1>Bienvenido al Dashboard</h1>}/>
                    <Route path='agregar-dentista' element={<AgregarDentista/>}/>
                    <Route path='dentistas-registrados' element={<DentistasRegistrados/>}/>
                    
                    <Route path='agregar-paciente' element={<AgregarPaciente/>}/>
                    <Route path='pacientes-registrados' element={<PacientesRegistrados/>}/>
                    <Route path='fichas-clinicas' element={<FichasClinicas/>}/>
                    
                    <Route path='agendar-cita' element={<AgendarCita/>}/>
                    <Route path='citas-agendadas' element={<CitasAgendadas/>}/>
                    
                    <Route path='registrar-pago' element={<RegistrarPago/>}/>
                    <Route path='ver-pagos' element={<Saldos/>}/>
                    
                    <Route path='agregar-tratamiento' element={<AgregarTratamiento/>}/>
                    <Route path='modificar-tratamiento' element={<FichasClinicas/>}/>
                    <Route path='lista-tratamientos' element={<ListaTratamientos/>}/>
                
                    <Route path='crear-cargo' element={<CrearCargo/>}/>
                    <Route path='registrar-empleado' element={<RegistrarEmpleado/>}/>
                    <Route path='lista-empleados' element={<ListaEmpleados/>}/>
                </Routes>
                
                <Toast ref={toast} />
            </div>
        </div>
    );
};

export default Dashboard;
