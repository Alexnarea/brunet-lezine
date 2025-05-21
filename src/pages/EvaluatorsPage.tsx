import React, { useEffect, useState, Component } from "react";
import type { ReactNode } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
} from "antd";
import type { Evaluator, EvaluatorPayload } from "../models/Evaluator";
import evaluatorsService from "../service/EvaluatorsService";

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error en EvaluatorsPage:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div style={{ padding: 20, color: "red" }}>Ocurrió un error al mostrar la tabla.</div>;
    }
    return this.props.children;
  }
}

const EvaluatorsPage: React.FC = () => {
  const [evaluators, setEvaluators] = useState<Evaluator[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvaluator, setEditingEvaluator] = useState<Evaluator | null>(null);
  const [form] = Form.useForm();

  const loadEvaluators = async () => {
    setLoading(true);
    try {
      const data = await evaluatorsService.getAll();
      setEvaluators(data);
    } catch (error) {
      message.error("Error cargando evaluadores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvaluators();
  }, []);

  const openModal = (evaluator?: Evaluator) => {
    setEditingEvaluator(evaluator || null);
    if (evaluator) {
      form.setFieldsValue({ ...evaluator });
    } else {
      form.resetFields();
    }
    setModalVisible(true);
  };

  const onFinish = async (values: EvaluatorPayload) => {
    try {
      if (editingEvaluator) {
        await evaluatorsService.update(editingEvaluator.id.toString(), values);
        message.success("Evaluador actualizado");
      } else {
        await evaluatorsService.create(values);
        message.success("Evaluador creado");
      }
      setModalVisible(false);
      loadEvaluators();
    } catch (error) {
      message.error("Error guardando evaluador");
    }
  };

  const onDelete = async (id: number) => {
    try {
      await evaluatorsService.delete(id.toString());
      message.success("Evaluador eliminado");
      loadEvaluators();
    } catch (error) {
      message.error("Error eliminando evaluador");
    }
  };

  const columns = [
    {
      title: "Nombre completo",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Especialidad",
      dataIndex: "specialization",
      key: "specialization",
    },
    {
      title: "Correo",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: Evaluator) => (
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
        Nuevo Evaluador
      </Button>

      <ErrorBoundary>
        <Table
          dataSource={evaluators}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </ErrorBoundary>

      <Modal
        title={editingEvaluator ? "Editar Evaluador" : "Nuevo Evaluador"}
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
            name="specialization"
            label="Especialidad"
            rules={[{ required: true, message: "Por favor ingresa la especialidad" }]}
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
            rules={[{ required: true, message: "Por favor ingresa una contraseña" }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EvaluatorsPage;
