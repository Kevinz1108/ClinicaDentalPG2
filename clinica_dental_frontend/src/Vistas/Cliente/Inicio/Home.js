import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
//import Carrusel from './Componentes/Carrusel';
//import PlanesDePago from './Componentes/PlanesDePago';
//import Footer from './Componentes/Footer';
import Navbar from './Componentes/Navbar';
import Carousel from './Componentes/Carrusel';
import PlanesPago from './Componentes/PlanesDePago';
import styles from './Home.module.css';


const Home = () => {
  const location = useLocation();
  
  useEffect(() => {
    const scrollToSection = (sectionId) => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    };

    if (location.state?.scrollTo) {
      scrollToSection(location.state.scrollTo);
    }
  }, [location]);

  return (
    <div className={`${styles.home} bg-green-50`} >
        

      <Navbar/>
      <Carousel/>
      <PlanesPago/>

    </div>
  );
};

export default Home;


