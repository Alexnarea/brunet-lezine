import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Form, Input, Button, Checkbox, Typography, Card } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined, HeartOutlined, SolutionOutlined } from '@ant-design/icons';
import AuthService from '../service/authService';
import './LoginPage.css';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (values: { username: string; password: string }) => {
    setLoading(true);
    setLoginError(null);  // Limpia errores previos
    try {
      await AuthService.login(values.username, values.password);
      message.success('Login exitoso');
      navigate('/');
    } catch (err: any) {
      console.error('Error en login:', err);

      let errorMsg = 'Error de red o servidor';
      if (err?.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err?.message) {
        errorMsg = err.message;
      }

      setLoginError(errorMsg);  // Mostrar el mensaje debajo del form
      // message.error(errorMsg, 3); // Opcional: si quieres el popup
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-left-content">
          <div className="login-logo">
            <SafetyOutlined className="login-logo-icon" />
            <div>
              <Title level={4} className="login-logo-title">Sistema de Evaluación</Title>
              <Text>Desarrollo Infantil</Text>
            </div>
          </div>
          <Title level={2}>
            Bienvenido al <span className="highlight">Sistema Profesional</span>
          </Title>
          <Text>
            Plataforma integral para la evaluación y seguimiento del desarrollo cognitivo infantil.
            Herramientas profesionales para especialistas en salud.
          </Text>
          <div className="login-features">
            <div className="feature">
              <SolutionOutlined className="feature-icon green" />
              <Text>Evaluaciones Cognitivas</Text>
            </div>
            <div className="feature">
              <LockOutlined className="feature-icon blue" />
              <Text>Datos Seguros</Text>
            </div>
            <div className="feature">
              <HeartOutlined className="feature-icon pink" />
              <Text>Seguimiento Integral</Text>
            </div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <Card className="login-card">
          <Title level={4} className="login-card-title">Iniciar Sesión</Title>
          <Text type="secondary" className="login-card-subtitle">
            Accede a tu cuenta profesional
          </Text>
          <Form onFinish={handleLogin} layout="vertical">
            <Form.Item
              name="username"
              label="Usuario"
              rules={[{ required: true, message: 'Por favor ingrese su usuario' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Ingrese su usuario" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Contraseña"
              rules={[{ required: true, message: 'Por favor ingrese su contraseña' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Ingrese su contraseña" />
            </Form.Item>
            <Form.Item>
              <div className="login-card-options">
                <Checkbox>Recordarme</Checkbox>
                <a href="#">¿Olvidaste tu contraseña?</a>
              </div>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                className="login-button"
              >
                Iniciar Sesión
              </Button>
            </Form.Item>

            {/* Mostrar mensaje de error debajo del botón */}
            {loginError && (
              <div style={{ color: 'red', textAlign: 'center' }}>
                {loginError}
              </div>
            )}
          </Form>

          <div className="login-footer">
            <Text type="secondary" style={{ fontSize: '12px' }}>
              © 2024 Sistema de Evaluación del Desarrollo Infantil. Todos los derechos reservados.
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
