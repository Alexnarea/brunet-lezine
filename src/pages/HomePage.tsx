import React from 'react';
import { Carousel, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; // Para el CSS del carrusel

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '0' }}>
      <Carousel arrows autoplay dotPosition="bottom" className="custom-carousel">
        {/* Slide 1 */}
        <div className="carousel-slide slide-1">
          <div className="overlay">
            <h1>Bienvenido a la Evaluación Brunet-Lézine</h1>
            <p>Una herramienta moderna para facilitar evaluaciones de desarrollo infantil.</p>
            <Button type="primary" size="large" onClick={() => navigate('/children')}>
              Ir a Gestión de Niños
            </Button>
          </div>
        </div>

        {/* Slide 2 */}
        <div className="carousel-slide slide-2">
          <div className="overlay">
            <h2>Características</h2>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '18px' }}>
              <li>✔ Registro de niños</li>
              <li>✔ Evaluaciones interactivas</li>
              <li>✔ Resultados automáticos</li>
            </ul>
            <Button type="primary" size="large" onClick={() => navigate('/evaluacion')}>
              Ir a Evaluaciones
            </Button>
          </div>
        </div>

        {/* Slide 3 */}
        <div className="carousel-slide slide-3">
          <div className="overlay">
            <h2>Gestión de Tutores</h2>
            <p>Administra los tutores asignados a cada nivel educativo.</p>
            <Button type="primary" size="large" onClick={() => navigate('/tutores')}>
              Ir a Gestión de Tutores
            </Button>
          </div>
        </div>
      </Carousel>
    </div>
  );
};

export default HomePage;
