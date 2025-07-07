import React from 'react';
import { Card, Row, Col, Button } from 'antd';

const modules = [
  { title: 'Usuarios', description: 'Gestión de usuarios', icon: '👤' },
  { title: 'Niños', description: 'Registro y seguimiento', icon: '👶' },
  { title: 'Evaluadores', description: 'Control de evaluadores', icon: '👩‍🏫' },
  { title: 'Evaluaciones', description: 'Administración de pruebas', icon: '📊' },
  { title: 'Ítems de Test', description: 'Ítems y preguntas', icon: '📋' },
  { title: 'Reportes', description: 'Visualización de reportes', icon: '📈' },
];

const DashboardModules: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]}>
        {modules.map((mod, index) => (
          <Col xs={24} sm={12} md={8} lg={6} xl={4} key={index}>
            <Card
              hoverable
              style={{ textAlign: 'center', borderRadius: '10px' }}
            >
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>{mod.icon}</div>
              <h3>{mod.title}</h3>
              <p>{mod.description}</p>
              <Button type="primary">Ir</Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default DashboardModules;
