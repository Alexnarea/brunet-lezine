import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Switch,
  message,
  Popconfirm,
  Select,
  Card,
  Row,
  Col,
  Typography,
} from "antd";
import {
  Pencil,
  Trash2,
  PlusCircle,
  User,
  CheckCircle,
  XCircle,
} from "lucide-react";
import usersService from "../service/UsersService";
import type { User as UserModel, UserPayload } from "../models/User";

const { Option } = Select;
const { Title, Text } = Typography;

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<UserModel | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await usersService.getAll();
      setUsers(data);
    } catch {
      message.error("Error cargando usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchText.toLowerCase()) ||
      u.role.toLowerCase().includes(searchText.toLowerCase())
  );

  const openModal = (user?: UserModel) => {
    setEditingUser(user || null);
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        locked: user.locked,
        disabled: user.disabled,
        role: user.role,
        password: "",
      });
    } else {
      form.resetFields();
    }
    setModalVisible(true);
  };

  const onFinish = async (values: any) => {
    const payload: UserPayload = {
      username: values.username?.trim(),
      email: values.email?.trim(),
      password: values.password,
      locked: values.locked ?? false,
      disabled: values.disabled ?? false,
      role: values.role,
    };

    try {
      if (editingUser) {
        if (!payload.password) delete payload.password;
        await usersService.update(editingUser.id.toString(), payload);
        message.success("Usuario actualizado");
      } else {
        await usersService.create(payload);
        message.success("Usuario creado");
      }
      setModalVisible(false);
      loadUsers();
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || "Error guardando usuario";
      message.error(errorMsg);
    }
  };

  const onDelete = async (id: number) => {
    try {
      await usersService.delete(id.toString());
      message.success("Usuario eliminado");
      loadUsers();
    } catch {
      message.error("Error eliminando usuario");
    }
  };

  const total = users.length;
  const activos = users.filter((u) => !u.disabled).length;
  const inactivos = total - activos;

  const columns = [
    {
      title: "Usuario",
      dataIndex: "username",
    },
    {
      title: "Correo",
      dataIndex: "email",
    },
    {
      title: "Rol",
      dataIndex: "role",
      render: (role: string) => (
        <Text type={role === "ADMIN" ? "warning" : "secondary"}>{role}</Text>
      ),
    },
    {
      title: "Bloqueado",
      dataIndex: "locked",
      render: (locked: boolean) =>
        locked ? <Text type="danger">Sí</Text> : "No",
    },
    {
      title: "Deshabilitado",
      dataIndex: "disabled",
      render: (disabled: boolean) =>
        disabled ? <Text type="danger">Sí</Text> : "No",
    },
    {
      title: "Acciones",
      render: (_: any, record: UserModel) => (
        <>
          <Button
            type="text"
            icon={<Pencil size={18} color="#1890ff" />}
            onClick={() => openModal(record)}
          />
          <Popconfirm
            title="¿Eliminar usuario?"
            onConfirm={() => onDelete(record.id)}
          >
            <Button type="text" danger icon={<Trash2 size={18} />} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>
            <User color="#eb2f96" style={{ marginRight: 8 }} />
            Gestión de Usuarios
          </Title>
        </Col>
        <Col>
          <Input.Search
            placeholder="Buscar por usuario o rol"
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250, marginRight: 8 }}
            allowClear
          />
          <Button
            type="primary"
            icon={<PlusCircle size={18} />}
            onClick={() => openModal()}
          >
            Nuevo Usuario
          </Button>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <User size={24} color="#1890ff" />
            <br />
            <Text strong>Total de Usuarios</Text>
            <br />
            <Text>{total}</Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <CheckCircle size={24} color="#52c41a" />
            <br />
            <Text strong>Activos</Text>
            <br />
            <Text>{activos}</Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <XCircle size={24} color="#ff4d4f" />
            <br />
            <Text strong>Inactivos</Text>
            <br />
            <Text>{inactivos}</Text>
          </Card>
        </Col>
      </Row>

      <Table
        dataSource={filteredUsers}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingUser ? "Editar Usuario" : "Nuevo Usuario"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        okText="Guardar"
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="username"
            label="Usuario"
            rules={[{ required: true, message: "Por favor ingresa el usuario" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Correo electrónico"
            rules={[{ required: true, type: "email", message: "Ingresa un correo válido" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Contraseña"
            rules={
              editingUser
                ? []
                : [{ required: true, message: "Ingresa la contraseña" }]
            }
          >
            <Input.Password placeholder={editingUser ? "Deja en blanco para no cambiar" : ""} />
          </Form.Item>

          <Form.Item
            name="role"
            label="Rol"
            rules={[{ required: true, message: "Selecciona un rol" }]}
          >
            <Select placeholder="Selecciona un rol">
              <Option value="ADMIN">ADMIN</Option>
              <Option value="EVALUATOR">EVALUATOR</Option>
            </Select>
          </Form.Item>

          <Form.Item name="locked" label="Bloqueado" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="disabled" label="Deshabilitado" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UsersPage;
