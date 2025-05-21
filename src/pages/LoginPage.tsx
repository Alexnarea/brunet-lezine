// src/pages/LoginPage.tsx
import { Form, Input, Button, Card } from "antd";

const LoginPage = () => {
  const onFinish = (values: any) => {
    console.log("Login data:", values);
    // Aquí deberías llamar a tu API de autenticación
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 100 }}>
      <Card title="Iniciar Sesión" style={{ width: 300 }}>
        <Form onFinish={onFinish}>
          <Form.Item name="username" rules={[{ required: true, message: "Usuario requerido" }]}>
            <Input placeholder="Usuario" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: "Contraseña requerida" }]}>
            <Input.Password placeholder="Contraseña" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Iniciar Sesión
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
