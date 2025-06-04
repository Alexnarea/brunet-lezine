import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Switch, message, Popconfirm } from "antd";
import usersService from "../service/UsersService";
import type { User, UserPayload } from "../models/User";

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

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

  const openModal = (user?: User) => {
    setEditingUser(user || null);
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        locked: user.locked,
        disabled: user.disabled,
        password: "", // nunca muestras la contraseña real
      });
    } else {
      form.resetFields();
    }
    setModalVisible(true);
  };

  const onFinish = async (values: any) => {
    const payload: UserPayload = {
      username: values.username,
      email: values.email,
      password: values.password, // para crear o cambiar contraseña
      locked: values.locked,
      disabled: values.disabled,
    };

    try {
      if (editingUser) {
        // Para actualizar, normalmente no mandas password si no quieres cambiarla
        if (!payload.password) delete payload.password;
        await usersService.update(editingUser.id.toString(), payload);
        message.success("Usuario actualizado");
      } else {
        await usersService.create(payload);
        message.success("Usuario creado");
      }
      setModalVisible(false);
      loadUsers();
    } catch {
      message.error("Error guardando usuario");
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

  const columns = [
    {
      title: "Usuario",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Bloqueado",
      dataIndex: "locked",
      key: "locked",
      render: (locked: boolean) => (locked ? "Sí" : "No"),
    },
    {
      title: "Deshabilitado",
      dataIndex: "disabled",
      key: "disabled",
      render: (disabled: boolean) => (disabled ? "Sí" : "No"),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: User) => (
        <>
          <Button type="link" onClick={() => openModal(record)}>
            Editar
          </Button>
          <Popconfirm
            title="¿Seguro que quieres eliminar este usuario?"
            onConfirm={() => onDelete(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button type="link" danger>
              Eliminar
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Button type="primary" onClick={() => openModal()} style={{ marginBottom: 16 }}>
        Nuevo Usuario
      </Button>

      <Table dataSource={users} columns={columns} rowKey="id" loading={loading} pagination={{ pageSize: 5 }} />

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
            rules={[{ required: true, type: "email", message: "Por favor ingresa un correo válido" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Contraseña"
            rules={editingUser ? [] : [{ required: true, message: "Por favor ingresa la contraseña" }]}
          >
            <Input.Password placeholder={editingUser ? "Deja en blanco para no cambiar" : ""} />
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
