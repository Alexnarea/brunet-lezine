import { useEffect, useState } from 'react';
import { Card, Typography, Alert, Grid, Skeleton } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getCurrentUserFromToken } from '../utils/jwtHelper';
import evaluationsService from '../service/evaluationsService';
import {
  Users, Smile, UserRoundCheck, AlertTriangle, Frown
} from 'lucide-react';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const allModules = [
  {
    title: 'Usuarios',
    description: 'Gestión completa de usuarios del sistema',
    icon: <Users size={36} color="#1890ff" />,
    color: '#1890ff',
    path: '/users',
    roles: ['ADMIN'],
  },
  {
    title: 'Niños',
    description: 'Registro y seguimiento de pacientes',
    icon: <Smile size={36} color="#f107a3" />,
    color: '#f107a3',
    path: '/children',
    roles: ['ADMIN', 'EVALUATOR'],
  },
  {
    title: 'Evaluadores',
    description: 'Control y administración de evaluadores',
    icon: <UserRoundCheck size={36} color="#722ed1" />,
    color: '#722ed1',
    path: '/evaluators',
    roles: ['ADMIN'],
  },
  {
    title: 'Ítems de Test',
    description: 'Gestión de ítems y preguntas de evaluación',
    icon: <Users size={36} color="#f7b801" />,
    color: '#f7b801',
    path: '/test-items',
    roles: ['ADMIN'],
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('Usuario');
  const [greeting, setGreeting] = useState('Bienvenido');
  const [role, setRole] = useState('');
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const screens = useBreakpoint();

  useEffect(() => {
    const user = getCurrentUserFromToken();
    if (user) {
      setUsername(user.sub || 'Usuario');
      let extractedRole = '';

      if (Array.isArray(user.authorities)) {
        extractedRole = user.authorities[0]?.replace('ROLE_', '') || '';
      } else if (typeof user.authorities === 'string') {
        extractedRole = user.authorities.replace('ROLE_', '');
      }

      setRole(extractedRole);

      const fetchDashboard = async () => {
        try {
          const data = extractedRole === 'ADMIN'
            ? await evaluationsService.getAdminDashboard()
            : await evaluationsService.getEvaluatorDashboardData();
          setDashboard(data);
        } catch (err) {
          console.error("Error al cargar dashboard", err);
        } finally {
          setLoading(false);
        }
      };

      fetchDashboard();
    }

    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting('Buenos días');
    else if (hour < 19) setGreeting('Buenas tardes');
    else setGreeting('Buenas noches');
  }, []);

  const visibleModules = allModules.filter(mod => mod.roles.includes(role));

  const adminCards = [
    { title: 'Usuarios', value: dashboard?.totalUsers, icon: <Users color="#1890ff" size={24} /> },
    { title: 'Evaluadores', value: dashboard?.totalEvaluators, icon: <UserRoundCheck color="#722ed1" size={24} /> },
    { title: 'Niños', value: dashboard?.totalChildren, icon: <Smile color="#f107a3" size={24} /> },
    { title: 'Retraso leve', value: dashboard?.childrenWithDelay?.length, icon: <AlertTriangle color="#fa8c16" size={24} /> },
    { title: 'Retraso grave', value: dashboard?.childrenWithSevereDelay?.length, icon: <Frown color="#f5222d" size={24} /> },
  ];

  const evaluatorCards = [
    { title: 'Niños', value: dashboard?.totalChildren, icon: <Smile color="#f107a3" size={24} /> },
    { title: 'Retraso leve', value: dashboard?.childrenWithDelay?.length, icon: <AlertTriangle color="#fa8c16" size={24} /> },
    { title: 'Retraso grave', value: dashboard?.childrenWithSevereDelay?.length, icon: <Frown color="#f5222d" size={24} /> },
  ];

  return (
    <div style={{ padding: '24px 12px', background: '#f5f7fa', minHeight: '100vh' }}>
      {/* Encabezado */}
      <div
        style={{
          background: 'linear-gradient(90deg, #7b2ff7 0%, #f107a3 100%)',
          borderRadius: 16,
          padding: 24,
          marginBottom: 24,
          color: '#fff',
          textAlign: 'center',
        }}
      >
        <Title level={3} style={{ color: '#fff', margin: 0 }}>
          {greeting}, {username}! <span role="img" aria-label="wave">👋</span>
        </Title>
        <Text style={{ color: '#fff', fontSize: 16 }}>
          Bienvenido al Sistema de Evaluación del Desarrollo Infantil
        </Text>

        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
  <Alert message="✔ Sistema Activo" type="success" showIcon style={{ minWidth: 240, textAlign: 'center' }} />
</div>

      </div>

      {/* Cuadros informativos */}
      {loading ? (
        <div style={{ padding: '0 12px' }}>
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            gap: 16,
            justifyContent: 'center',
            flexWrap: 'wrap',
            maxWidth: 1100,
            margin: '0 auto 32px auto',
          }}
        >
          {(role === 'ADMIN' ? adminCards : evaluatorCards).map((item, idx) => (
            <Card
              key={idx}
              style={{
                width: 165,
                borderRadius: 16,
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              }}
              bordered={false}
            >
              <div style={{ fontSize: 26, marginBottom: 6 }}>{item.icon}</div>
              <div style={{ fontSize: 15, color: '#555', marginBottom: 4 }}>{item.title}</div>
              <div style={{ fontSize: 24, fontWeight: 600 }}>{item.value}</div>
            </Card>
          ))}
        </div>
      )}

      {/* Módulos del sistema */}
      <Card
        style={{ borderRadius: 16 }}
        title={<Title level={4} style={{ margin: 0 }}>Módulos del Sistema</Title>}
        bodyStyle={{ padding: 24 }}
      >
        {visibleModules.length === 0 ? (
          <Text type="warning">No tienes acceso a ningún módulo</Text>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: screens.lg ? 'repeat(auto-fit, minmax(200px, 1fr))' : 'repeat(2, 1fr)',
              gap: 16,
              maxWidth: 900,
              margin: '0 auto',
              justifyContent: 'center',
            }}
          >
            {visibleModules.map((mod, idx) => (
              <Card
                key={idx}
                hoverable
                style={{
                  borderRadius: 16,
                  height: '100%',
                  textAlign: 'center',
                  border: `1.5px solid ${mod.color}`,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  transition: 'transform 0.3s ease',
                  padding: 20,
                }}
                onClick={() => navigate(mod.path)}
              >
                <div style={{ fontSize: 40, marginBottom: 12 }}>{mod.icon}</div>
                <Title level={5} style={{ marginBottom: 6 }}>{mod.title}</Title>
                <Text style={{ color: '#777' }}>{mod.description}</Text>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default HomePage;
