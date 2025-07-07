import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Select,
} from "antd";
import type { Evaluator, EvaluatorPayload } from "../models/Evaluator";
import type { User } from "../models/User";
import evaluatorService from "../service/EvaluatorService";
import moment from "moment";
import UsersService from "../service/UsersService";

const { Option } = Select;

const EvaluatorsPage: React.FC = () => {
  const [evaluators, setEvaluators] = useState<Evaluator[]>([]);
  const [filteredEvaluators, setFilteredEvaluators] = useState<Evaluator[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [allUsersMap, setAllUsersMap] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvaluator, setEditingEvaluator] = useState<Evaluator | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  const loadEvaluators = async () => {
    setLoading(true);
    try {
      const data = await evaluatorService.getAll();
      setEvaluators(data);
      setFilteredEvaluators(data);
    } catch {
      message.error("Error cargando evaluadores");
    } finally {
      setLoading(false);
    }
  };

  const loadAllUsers = async () => {
    try {
      const data = await UsersService.getAll(); 
      const map = new Map<number, string>();
      data.forEach((u: User) => map.set(u.id, u.username));  // ✅ Cambiado a username
      setAllUsersMap(map);
    } catch {
      message.error("Error cargando usuarios");
    }
  };

  const loadAvailableUsers = async () => {
    try {
      const data = await UsersService.getAvailableForEvaluator(); 
      setAvailableUsers(data);
    } catch {
      message.error("Error cargando usuarios disponibles");
    }
  };

  useEffect(() => {
    loadEvaluators();
    loadAllUsers();
  }, []);

  useEffect(() => {
    const filtered = evaluators.filter(
      (e) =>
        e.speciality?.toLowerCase().includes(searchText.toLowerCase()) ||
        allUsersMap.get(e.userId || 0)?.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredEvaluators(filtered);
  }, [searchText, evaluators, allUsersMap]);

  const openModal = (evaluator?: Evaluator) => {
    setEditingEvaluator(evaluator || null);
    form.resetFields();
    if (evaluator) {
      form.setFieldsValue({
        ...evaluator,
        birthdate: evaluator.birthdate?.slice(0, 10),
      });
    }
    loadAvailableUsers();
    setModalVisible(true);
  };

  const onFinish = async (values: any) => {
    const payload: EvaluatorPayload = {
      speciality: values.speciality,
      fullName: values.fullName,
      nui: values.nui,
      phone: values.phone,
      birthdate: values.birthdate,
      gender: values.gender,
      userId: Number(values.userId),
    };

    try {
      if (editingEvaluator) {
        await evaluatorService.update(editingEvaluator.id, payload);
        message.success("Evaluador actualizado");
      } else {
        await evaluatorService.create(payload);
        message.success("Evaluador creado");
      }
      setModalVisible(false);
      loadEvaluators();
    } catch {
      message.error("Error guardando evaluador");
    }
  };

  const onDelete = async (id: number) => {
    try {
      await evaluatorService.delete(id);
      message.success("Evaluador eliminado");
      loadEvaluators();
    } catch {
      message.error("Error eliminando evaluador");
    }
  };

  const columns = [
    {
      title: "Especialidad",
      dataIndex: "speciality",
      key: "speciality",
    },
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
      title: "Teléfono",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Fecha de nacimiento",
      dataIndex: "birthdate",
      key: "birthdate",
      render: (date: string) =>
        date ? moment(date).format("DD/MM/YYYY") : "-",
    },
    {
      title: "Género",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Usuario",
      dataIndex: "userId",
      key: "userId",
      render: (userId: number) => allUsersMap.get(userId) || "-"
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
            title="¿Eliminar evaluador?"
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
      <Input.Search
        placeholder="Buscar por especialidad o usuario"
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: 300, marginBottom: 16 }}
        allowClear
      />

      <Button
        type="primary"
        onClick={() => openModal()}
        style={{ marginBottom: 16, marginLeft: 8 }}
      >
        Nuevo Evaluador
      </Button>

      <Table
        dataSource={filteredEvaluators}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingEvaluator ? "Editar Evaluador" : "Nuevo Evaluador"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        okText="Guardar"
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="speciality"
            label="Especialidad"
            rules={[{ required: true, message: "Por favor ingresa la especialidad" }]}
          >
            <Input />
          </Form.Item>

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
            name="phone"
            label="Teléfono"
            rules={[{ required: true, message: "Por favor ingresa el teléfono" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="birthdate"
            label="Fecha de nacimiento"
            rules={[{ required: true, message: "Por favor ingresa la fecha de nacimiento" }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Género"
            rules={[{ required: true, message: "Por favor selecciona el género" }]}
          >
            <Select placeholder="Selecciona el género">
              <Option value="Masculino">Masculino</Option>
              <Option value="Femenino">Femenino</Option>
              <Option value="Otro">Otro</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="userId"
            label="Usuario"
            rules={[{ required: true, message: "Por favor selecciona el usuario" }]}
          >
            <Select placeholder="Selecciona un usuario">
              {availableUsers.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.username}  {/* ✅ Cambiado a username */}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EvaluatorsPage;
