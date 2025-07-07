import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Typography, Statistic } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  UserOutlined, SmileOutlined, TeamOutlined, BarChartOutlined,
  FileTextOutlined, LineChartOutlined, HeartOutlined
} from '@ant-design/icons';
import { getCurrentUserFromToken } from '../utils/jwtHelper';

const { Title, Text } = Typography;

const summaryData = [
  { title: 'Niños Registrados', value: 1247, icon: <HeartOutlined />, color: '#1890ff' },
  { title: 'Evaluaciones Completadas', value: 3891, icon: <BarChartOutlined />, color: '#52c41a' },
  { title: 'Evaluadores Activos', value: 28, icon: <TeamOutlined />, color: '#722ed1' },
  { title: 'Reportes Generados', value: 156, icon: <LineChartOutlined />, color: '#fa8c16' },
];

const modules = [
  { title: 'Usuarios', description: 'Gestión completa de usuarios del sistema', icon: <UserOutlined />, color: '#1890ff', path: '/users' },
  { title: 'Niños', description: 'Registro y seguimiento de pacientes', icon: <SmileOutlined />, color: '#f107a3', path: '/children' },
  { title: 'Evaluadores', description: 'Control y administración de evaluadores', icon: <TeamOutlined />, color: '#722ed1', path: '/evaluators' },
  { title: 'Evaluaciones', description: 'Administración de pruebas y resultados', icon: <BarChartOutlined />, color: '#52c41a', path: '/evaluations' },
  { title: 'Ítems de Test', description: 'Gestión de ítems y preguntas de evaluación', icon: <FileTextOutlined />, color: '#f7b801', path: '/test-items' },
  { title: 'Reportes', description: 'Visualización y análisis de reportes', icon: <LineChartOutlined />, color: '#13c2c2', path: '/reportes' },
];

const quickActions = [
  { label: 'Registrar Niño', color: '#e6f7ff', icon: <HeartOutlined />, path: '/children/register' },
  { label: 'Nueva Evaluación', color: '#f6ffed', icon: <BarChartOutlined />, path: '/evaluations/new' },
  { label: 'Ver Reportes', color: '#f9f0ff', icon: <LineChartOutlined />, path: '/reportes' },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('Usuario');
  const [greeting, setGreeting] = useState<string>('Bienvenido');

  useEffect(() => {
    const user = getCurrentUserFromToken();
    if (user) {
      setUsername(user.sub);
    }

    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting('Buenos días');
    } else if (hour >= 12 && hour < 19) {
      setGreeting('Buenas tardes');
    } else {
      setGreeting('Buenas noches');
    }
  }, []);

  return (
    <div style={{ padding: 24, background: '#f5f7fa', minHeight: '100vh' }}>
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(90deg, #7b2ff7 0%, #f107a3 100%)',
          borderRadius: 16,
          padding: 32,
          marginBottom: 24,
          color: '#fff',
        }}
      >
        <Title level={3} style={{ color: '#fff', margin: 0 }}>
          {greeting}, {username}! <span role="img" aria-label="wave">👋</span>
        </Title>
        <Text style={{ color: '#fff', fontSize: 16 }}>
          Bienvenido al Sistema de Evaluación del Desarrollo Infantil
        </Text>
        <div style={{ marginTop: 16 }}>
          <Button style={{ marginRight: 8 }}>Sistema Activo</Button>
          <Button>Datos Seguros</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <Row gutter={16} style={{ marginBottom: 32 }}>
        {summaryData.map((item, idx) => (
          <Col xs={24} sm={12} md={6} key={idx}>
            <Card style={{ borderRadius: 12 }}>
              <Statistic
                title={item.title}
                value={item.value}
                prefix={item.icon}
                valueStyle={{ color: item.color, fontWeight: 700 }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modules */}
      <Card
        style={{
          borderRadius: 16,
          marginBottom: 32,
        }}
        title={<Title level={4} style={{ margin: 0 }}>Módulos del Sistema</Title>}
        bodyStyle={{ padding: 24 }}
      >
        <Row gutter={[32, 32]}>
          {modules.map((mod, idx) => (
            <Col xs={24} sm={12} md={8} key={idx}>
              <Card
                hoverable
                style={{
                  borderRadius: 16,
                  minHeight: 220,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  border: `2px solid ${mod.color}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  padding: 16,
                }}
                onClick={() => navigate(mod.path)}
              >
                <div style={{ fontSize: 48, color: mod.color, marginBottom: 12 }}>{mod.icon}</div>
                <Title level={5} style={{ marginBottom: 8 }}>{mod.title}</Title>
                <Text style={{ marginBottom: 8, color: '#888' }}>{mod.description}</Text>
                <Button
                  type="primary"
                  style={{
                    background: mod.color,
                    borderColor: mod.color,
                    marginTop: 20,
                    alignSelf: 'center',
                    width: '60%',
                    maxWidth: 150,
                  }}
                >
                  Acceder
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Quick Actions */}
      <Card
        style={{ borderRadius: 16 }}
        title={<Title level={5} style={{ margin: 0 }}>Acciones Rápidas</Title>}
        bodyStyle={{ padding: 24 }}
      >
        <Row gutter={16}>
          {quickActions.map((action, idx) => (
            <Col xs={24} sm={8} key={idx}>
              <Button
                block
                size="large"
                style={{
                  background: action.color,
                  border: 'none',
                  borderRadius: 12,
                  fontWeight: 600,
                  fontSize: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 8,
                }}
                icon={action.icon}
                onClick={() => navigate(action.path)}
              >
                {action.label}
              </Button>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

export default HomePage;
