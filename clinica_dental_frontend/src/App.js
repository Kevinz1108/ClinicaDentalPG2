import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Vistas/Cliente/Inicio/Home';
import Login from './Vistas/Cliente/Inicio-sesion/Login';
import Dashboard from './Vistas/Dashboard/Dashboard';
import AgregarDentista from './Vistas/Dashboard/Dentistas/AgregarDentista';
import PacientesRegistrados from './Vistas/Dashboard/Pacientes/Pacientes Registrados/PacientesRegistrados'



function App() {
  return (
    <Router>
      <div className="App">
      <header className="App-header">
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/Dashboard/*" element={<Dashboard />} />
  <Route path="/agregardentista" element={<AgregarDentista />} />
  <Route path="/pacientes-registrados" element={<PacientesRegistrados/>} />
</Routes>
</header>
      </div>
    </Router>
  );
}

export default App;
