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
import type {Evaluator, EvaluatorPayload } from "../models/Evaluator";
import evaluatorsService from "../service/EvaluatorsService";

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

  const openModal = (evaluators?: Evaluator) => {
    setEditingEvaluator(evaluators || null);
    if (evaluators) {
      form.setFieldsValue({ ...evaluators });
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
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Especialidad",
    dataIndex: "specialization",
    key: "specialization",
  },
  {
    title: "Fecha de creación",
    dataIndex: "creationDate",
    key: "creationDate",
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

// En el formulario solo pide 'specialization'
<Modal
  title={editingEvaluator ? "Editar Evaluador" : "Nuevo Evaluador"}
  open={modalVisible}
  onCancel={() => setModalVisible(false)}
  onOk={() => form.submit()}
  okText="Guardar"
>
  <Form form={form} layout="vertical" onFinish={onFinish}>
    <Form.Item
      name="specialization"
      label="Especialidad"
      rules={[{ required: true, message: "Por favor ingresa la especialidad" }]}
    >
      <Input />
    </Form.Item>
  </Form>
</Modal>

  
};

export default EvaluatorsPage;
