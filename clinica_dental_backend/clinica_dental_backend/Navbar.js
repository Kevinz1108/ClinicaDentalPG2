import React from 'react';
import { Menubar } from 'primereact/menubar';

import { Button } from 'primereact/button';
        
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import styles from './Navbar.module.css';  // Importar el CSS Module
import logo from '../../../../assets/logo-odontologia.png';

import { useNavigate } from 'react-router-dom';

export default function BasicDemo() {
    const navigate = useNavigate();

    // Logo a la izquierda
    const start = (
        <div className={styles.logo}>
            <img
            src={logo} // Logo
            alt="Clinica Dental Logo"
            className="navbar-logo"
            style={{width:"2.5rem", marginRight:"10px"}}
          />
            
            <span 
            style={{ marginRight: '10rem' }}
            className='font-italic'
            >Odontología Especializada</span>
        </div>
    );

    // Botón "Iniciar Sesión" a la derecha
    const end = (
        <div className={styles.menuEnd}>
            <Button className="
            pi pi-sign-in 
            border-round-2xl
            text-900	
            hover:text-yellow-400 
            vertical-align-middle
            bg-purple-50
            "
            label=" Iniciar Sesión" severity="success" />
        </div>
    );

    const items = [
        
        { label: 'Inicio', icon: 'pi pi-home' },
        { label: 'Nuestro Equipo', icon: 'pi pi-users' },
        { label: 'Planes De Pago', icon: 'pi pi-wallet' },
        { label: 'Contacto', icon: 'pi pi-envelope' },
        { label: 'Agendar Cita', icon: 'pi pi-calendar' },
    ];

    return (
        <div className={styles.navbarContainer}>
            <Menubar
                start={start}
                model={items }
                end={end}
                 className="bg-teal-50 text-900 text-lg shadow-4  flip animation-duration-1000 "
                style={{ borderRadius: '10px', margin: '20px' }}
            />
        </div>
    );
}
