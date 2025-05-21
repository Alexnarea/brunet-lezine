import React from 'react';
import { Anchor, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <div style={{ padding: '20px' }}>
        <Anchor
          direction="horizontal"
          items={[
            { key: 'intro', href: '#intro', title: 'Inicio' },
            { key: 'features', href: '#features', title: 'Características' },
            { key: 'access', href: '#access', title: 'Acceso' },
          ]}
        />
      </div>

      <div id="intro" style={{ height: '100vh', backgroundColor: '#f6ffed', textAlign: 'center', paddingTop: 100 }}>
        <h1>Bienvenido a la Evaluación Brunet-Lézine</h1>
        <p>Una herramienta moderna para facilitar evaluaciones de desarrollo infantil.</p>
      </div>

      <div id="features" style={{ height: '100vh', backgroundColor: '#e6f7ff', textAlign: 'center', paddingTop: 100 }}>
        <h2>Características</h2>
        <ul style={{ listStyle: 'none' }}>
          <li>✔ Registro de niños</li>
          <li>✔ Evaluaciones interactivas</li>
          <li>✔ Resultados automáticos</li>
        </ul>
      </div>

      <div id="access" style={{ height: '100vh', backgroundColor: '#fffbe6', textAlign: 'center', paddingTop: 100 }}>
        <h2>Acceso al sistema</h2>
        <Button type="primary" onClick={() => navigate('/children')}>Ir a Gestión de Niños</Button>
      </div>
    </>
  );
};

export default HomePage;
