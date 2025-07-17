import { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Typography, Statistic } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  UserOutlined, SmileOutlined, TeamOutlined, HeartOutlined
} from '@ant-design/icons';
import { getCurrentUserFromToken } from '../utils/jwtHelper';

const { Title, Text } = Typography;

const summaryData = [
  { title: 'Niños Registrados', value: 1247, icon: <HeartOutlined />, color: '#1890ff' },
  { title: 'Evaluadores Activos', value: 28, icon: <TeamOutlined />, color: '#722ed1' },
];

const modules = [
  {
    title: 'Usuarios',
    description: 'Gestión completa de usuarios del sistema',
    icon: <UserOutlined />,
    color: '#1890ff',
    path: '/users',
  },
  {
    title: 'Niños',
    description: 'Registro y seguimiento de pacientes',
    icon: <SmileOutlined />,
    color: '#f107a3',
    path: '/children',
  },
  {
    title: 'Evaluadores',
    description: 'Control y administración de evaluadores',
    icon: <TeamOutlined />,
    color: '#722ed1',
    path: '/evaluators',
  },
  {
    title: 'Ítems de Test',
    description: 'Gestión de ítems y preguntas de evaluación',
    icon: <UserOutlined />,
    color: '#f7b801',
    path: '/test-items',
  },
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
            <Card
              style={{
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}
            >
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
        <Row gutter={[24, 24]}>
          {modules.map((mod, idx) => (
            <Col xs={24} sm={12} md={6} key={idx}>
              <Card
                hoverable
                style={{
                  borderRadius: 16,
                  height: 240,
                  textAlign: 'center',
                  border: `1.5px solid ${mod.color}`,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  transition: 'transform 0.3s ease',
                }}
                onClick={() => navigate(mod.path)}
                bodyStyle={{
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: 40, color: mod.color, marginBottom: 12 }}>{mod.icon}</div>
                <Title level={5} style={{ marginBottom: 6 }}>{mod.title}</Title>
                <Text style={{ color: '#777' }}>{mod.description}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

export default HomePage;
