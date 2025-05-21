// src/pages/ChildrenPage.tsx
import React, { useEffect, useState, Component } from "react";
import type { ReactNode } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Popconfirm,
} from "antd";
import moment from "moment";
import type { Children, ChildPayload } from "../models/Children";
import childrenService from "../service/ChildrenService";

const { Option } = Select;

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error en ChildrenPage:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div style={{ padding: 20, color: "red" }}>Ocurrió un error al mostrar la tabla.</div>;
    }
    return this.props.children;
  }
}

const ChildrenPage: React.FC = () => {
  const [children, setChildren] = useState<Children[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingChild, setEditingChild] = useState<Children | null>(null);
  const [form] = Form.useForm();

  const loadChildren = async () => {
    setLoading(true);
    try {
      const data = await childrenService.getAll();
      setChildren(data);
    } catch (error) {
      message.error("Error cargando niños");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChildren();
  }, []);

  const openModal = (child?: Children) => {
    setEditingChild(child || null);
    if (child) {
      form.setFieldsValue({
        ...child,
        birthdate: moment(child.birthdate),
      });
    } else {
      form.resetFields();
    }
    setModalVisible(true);
  };

  const onFinish = async (values: any) => {
    const payload: ChildPayload = {
      fullName: values.fullName,
      nui: values.nui,
      birthdate: values.birthdate.format("YYYY-MM-DD"),
      gender: values.gender,
    };

    try {
      if (editingChild) {
        await childrenService.update(editingChild.id.toString(), payload);
        message.success("Niño actualizado");
      } else {
        await childrenService.create(payload);
        message.success("Niño creado");
      }
      setModalVisible(false);
      loadChildren();
    } catch (error) {
      message.error("Error guardando niño");
    }
  };

  const onDelete = async (id: number) => {
    try {
      await childrenService.delete(id.toString());
      message.success("Niño eliminado");
      loadChildren();
    } catch (error) {
      message.error("Error eliminando niño");
    }
  };

  const columns = [
    {
      title: "Nombre completo",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "NUI",
      dataIndex: "nui",
      key: "nui",
    },
    {
      title: "Fecha de nacimiento",
      dataIndex: "birthdate",
      key: "birthdate",
      render: (date: string) => (date ? moment(date).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "Género",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: Children) => (
        <>
          <Button type="link" onClick={() => openModal(record)}>
            Editar
          </Button>
          <Popconfirm
            title="¿Estás seguro de eliminar?"
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
        Nuevo Niño
      </Button>

      <ErrorBoundary>
        <Table
          dataSource={children}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </ErrorBoundary>

      <Modal
        title={editingChild ? "Editar Niño" : "Nuevo Niño"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        okText="Guardar"
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="fullName"
            label="Nombre completo"
            rules={[{ required: true, message: "Por favor ingresa el nombre completo" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="nui"
            label="NUI"
            rules={[{ required: true, message: "Por favor ingresa el NUI" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="birthdate"
            label="Fecha de nacimiento"
            rules={[{ required: true, message: "Por favor ingresa la fecha de nacimiento" }]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="gender" label="Género">
            <Select allowClear placeholder="Selecciona un género">
              <Option value="Masculino">Masculino</Option>
              <Option value="Femenino">Femenino</Option>
              <Option value="Otro">Otro</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ChildrenPage;
