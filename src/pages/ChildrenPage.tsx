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
import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2, Plus, Heart, User } from "lucide-react";

const { Option } = Select;

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
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
      return (
        <div style={{ padding: 20, color: "red" }}>
          Ocurrió un error al mostrar la tabla.
        </div>
      );
    }
    return this.props.children;
  }
}

const ChildrenPage: React.FC = () => {
  const [children, setChildren] = useState<Children[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingChild, setEditingChild] = useState<Children | null>(null);
  const [searchText, setSearchText] = useState("");
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

  const filteredChildren = children.filter(
    (child) =>
      child.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      child.nui.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Nombre Completo",
      dataIndex: "fullName",
      key: "fullName",
      render: (text: string, record: Children) => (
        <Link to={`/children/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: "NUI",
      dataIndex: "nui",
      key: "nui",
    },
    {
      title: "Fecha de Nacimiento",
      dataIndex: "birthdate",
      key: "birthdate",
      render: (date: string) =>
        date ? moment(date).format("DD/MM/YYYY") : "-",
    },
    {
      title: "Edad",
      key: "age",
      render: (_: any, record: Children) => {
        const birthdate = moment(record.birthdate);
        const today = moment();
        const age = today.diff(birthdate, "years");
        return `${age} años`;
      },
    },
    {
      title: "Género",
      dataIndex: "gender",
      key: "gender",
      render: (gender: string) => (
        <span
          style={{
            padding: "2px 8px",
            borderRadius: 12,
            color: gender === "Femenino" ? "#eb2f96" : "#1890ff",
            backgroundColor:
              gender === "Femenino" ? "#fff0f6" : "#e6f7ff",
            fontWeight: 500,
            fontSize: 12,
          }}
        >
          {gender}
        </span>
      ),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: Children) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Link to={`/children/${record.id}`}>
            <Eye size={18} style={{ color: "#52c41a" }} />
          </Link>
          <Pencil
            size={18}
            onClick={() => openModal(record)}
            style={{ color: "#1890ff", cursor: "pointer" }}
          />
          <Popconfirm
            title="¿Estás seguro que deseas eliminar?"
            onConfirm={() => onDelete(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Trash2
              size={18}
              style={{ color: "#ff4d4f", cursor: "pointer" }}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Cabecera */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
        {/* Título y acciones */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ background: "#ff4d91", padding: 8, borderRadius: 12 }}>
              <Heart size={20} color="#fff" />
            </div>
            <div>
              <h2 style={{ margin: 0 }}>Gestión de Niños</h2>
              <p style={{ margin: 0 }}>Administra la información de los niños registrados</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Input.Search
              placeholder="Buscar por nombre o NUI"
              allowClear
              style={{ width: 250, minWidth: 200 }}
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
            />
            <Button
              type="primary"
              icon={<Plus size={16} />}
              onClick={() => openModal()}
            >
              Nuevo Niño
            </Button>
          </div>
        </div>

        {/* Tarjetas resumen */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          <div style={{ flex: 1, minWidth: 200, background: "#fff", padding: 16, borderRadius: 8 }}>
            <p style={{ margin: 0, fontSize: 12 }}>Total de Niños</p>
            <p style={{ margin: 0, color: "#1677ff" }}>
              <User size={18} style={{ marginRight: 4 }} />{children.length}
            </p>
          </div>
          <div style={{ flex: 1, minWidth: 200, background: "#fff", padding: 16, borderRadius: 8 }}>
            <p style={{ margin: 0, fontSize: 12 }}>Niños</p>
            <p style={{ margin: 0, color: "#1677ff" }}>
              <User size={18} style={{ marginRight: 4 }} />{children.filter((c) => c.gender === "Masculino").length}
            </p>
          </div>
          <div style={{ flex: 1, minWidth: 200, background: "#fff", padding: 16, borderRadius: 8 }}>
            <p style={{ margin: 0, fontSize: 12 }}>Niñas</p>
            <p style={{ margin: 0, color: "#eb2f96" }}>
              <User size={18} style={{ marginRight: 4 }} />{children.filter((c) => c.gender === "Femenino").length}
            </p>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <ErrorBoundary>
        <Table
          dataSource={filteredChildren}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }} // importante para móviles
        />
      </ErrorBoundary>

      {/* Modal */}
      <Modal
        title={editingChild ? "Editar Niño" : "Nuevo Niño"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        okText="Guardar"
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="fullName" label="Nombre completo" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="nui" label="NUI" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="birthdate" label="Fecha de nacimiento" rules={[{ required: true }]}>
            <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="gender" label="Género" rules={[{ required: true }]}>
            <Select placeholder="Selecciona un género">
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
