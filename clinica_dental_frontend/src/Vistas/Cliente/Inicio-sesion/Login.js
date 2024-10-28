import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as Tabs from '@radix-ui/react-tabs';
import LoginImg from '../../../assets/images/Login.jpeg';
import styles from './Login.module.css';  // Importar el CSS module correctamente
import Navbar from '../Inicio/Componentes/Navbar';  // Asegúrate de importar el Navbar

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  axios.get('http://localhost:8000/api/obtener-dentistas/', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error:', error);
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const token = localStorage.getItem('token');
    
    if (!isLoggedIn || !token) {
      navigate('/login');
    }
  }, [navigate]);
  

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        emailOrUsername,
        password,
      },
      {
        headers: {
          'Content-Type': 'application/json'  // Encabezado asegurando que se envíen los datos en formato JSON
        }
      });

      if (response.status === 200) {
        const { nombre, apellido, is_dentista } = response.data;

        localStorage.setItem('token', token); 
        localStorage.setItem('isLoggedIn', true); // Guardar la sesión
        localStorage.setItem('nombre', nombre);
        localStorage.setItem('apellido', apellido);
        localStorage.setItem('is_dentista', is_dentista);

        navigate(`/dashboard/${nombre}-${apellido}`);
      }
    } catch (err) {
      setError('Error en el inicio de sesión, por favor verifique sus credenciales.');
      console.error('Error en el inicio de sesión:', err);
    }
  };

  return (
    <div className={`${styles.login} bg-green-50`}>
      {/* Aquí agregamos el Navbar */}
      <Navbar />

      <div className={styles['min-h-screen']}>
        <div className={`${styles['login-container']} ${styles['overflow-hidden']}`}>
          <div className={styles['login-image']}>
            <img src={LoginImg} alt="Imagen de ejemplo" />
          </div>

          <Tabs.Root className={styles['TabsRoot']} defaultValue="tab1">
            <Tabs.List className={styles['TabsList']} aria-label="Manage your account">
              <Tabs.Trigger className={styles['TabsTrigger']} value="tab1">
                Iniciar Sesión
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content className={styles['TabsContent']} value="tab1">
              <form className={styles['form-tab']} onSubmit={handleLogin}>
                <fieldset className={styles['Fieldset']}>
                  <label className={styles['Label']} htmlFor="name">
                    Correo Electrónico
                  </label>
                  <input
                    type="text"
                    id="emailOrUsername"
                    className={styles['Input']}
                    placeholder="Ingrese su usuario o correo electrónico"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    required
                  />
                </fieldset>
                <fieldset className={styles['Fieldset']}>
                  <label className={styles['Label']}>
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="password"
                    className={styles['Input']}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingrese su Contraseña"
                    required
                  />
                </fieldset>
                <div className={styles['form-footer']}>
                  <button className={`${styles['Button']} ${styles['green']}`}>Iniciar Sesión</button>
                </div>
              </form>
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </div>
    </div>
  );
};

export default Login;
