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
  UserCircle,
} from "lucide-react";
import type { Evaluator, EvaluatorPayload } from "../models/Evaluator";
import evaluatorService from "../service/EvaluatorService";
import moment from "moment";
import UsersService from "../service/UsersService";
import type { User as UserModel } from "../models/User";

const { Option } = Select;
const { Title, Text } = Typography;

const EvaluatorsPage: React.FC = () => {
  const [evaluators, setEvaluators] = useState<Evaluator[]>([]);
  const [filteredEvaluators, setFilteredEvaluators] = useState<Evaluator[]>([]);
  const [availableUsers, setAvailableUsers] = useState<UserModel[]>([]);
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
      data.forEach((u: UserModel) => map.set(u.id, u.username));
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

  // Estadísticas
  const total = evaluators.length;
  const hombres = evaluators.filter((e) => e.gender === "Masculino").length;
  const mujeres = evaluators.filter((e) => e.gender === "Femenino").length;

  const columns = [
    {
      title: "Especialidad",
      dataIndex: "speciality",
    },
    {
      title: "Nombre completo",
      dataIndex: "fullName",
    },
    {
      title: "NUI",
      dataIndex: "nui",
    },
    {
      title: "Teléfono",
      dataIndex: "phone",
    },
    {
      title: "Fecha de nacimiento",
      dataIndex: "birthdate",
      render: (date: string) => date ? moment(date).format("DD/MM/YYYY") : "-",
    },
    {
      title: "Género",
      dataIndex: "gender",
      render: (gender: string) => {
        let bgColor = "#f3e8ff";
        let color = "#722ed1";

        if (gender === "Femenino") {
          bgColor = "#ffe6f0";
          color = "#c41d7f";
        } else if (gender === "Masculino") {
          bgColor = "#e6f4ff";
          color = "#096dd9";
        }

        return (
          <span
            style={{
              backgroundColor: bgColor,
              borderRadius: "12px",
              padding: "2px 10px",
              fontSize: "12px",
              fontWeight: 600,
              color,
            }}
          >
            {gender}
          </span>
        );
      },
    },
    {
      title: "Usuario",
      dataIndex: "userId",
      render: (userId: number) => allUsersMap.get(userId) || "-"
    },
    {
      title: "Acciones",
      render: (_: any, record: Evaluator) => (
        <>
          <Button
            type="text"
            icon={<Pencil size={18} color="#1890ff" />}
            onClick={() => openModal(record)}
          />
          <Popconfirm
            title="¿Eliminar evaluador?"
            onConfirm={() => onDelete(record.id)}
            okText="Sí"
            cancelText="No"
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
            Gestión de Evaluadores
          </Title>
        </Col>
        <Col>
          <Input.Search
            placeholder="Buscar por especialidad o usuario"
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250, marginRight: 8 }}
            allowClear
          />
          <Button
            type="primary"
            icon={<PlusCircle size={18} />}
            onClick={() => openModal()}
          >
            Nuevo Evaluador
          </Button>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <User size={24} color="#1890ff" />
            <br />
            <Text strong>Total de Evaluadores</Text>
            <br />
            <Text>{total}</Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <UserCircle size={24} color="#52c41a" />
            <br />
            <Text strong>Hombres</Text>
            <br />
            <Text>{hombres}</Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <UserCircle size={24} color="#ff4d4f" />
            <br />
            <Text strong>Mujeres</Text>
            <br />
            <Text>{mujeres}</Text>
          </Card>
        </Col>
      </Row>

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
          <Form.Item name="speciality" label="Especialidad" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="fullName" label="Nombre completo" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="nui" label="NUI" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Teléfono" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="birthdate" label="Fecha de nacimiento" rules={[{ required: true }]}>
            <Input type="date" />
          </Form.Item>
          <Form.Item name="gender" label="Género" rules={[{ required: true }]}>
            <Select placeholder="Selecciona el género">
              <Option value="Masculino">Masculino</Option>
              <Option value="Femenino">Femenino</Option>
              <Option value="Otro">Otro</Option>
            </Select>
          </Form.Item>
          <Form.Item name="userId" label="Usuario" rules={[{ required: true }]}>
            <Select placeholder="Selecciona un usuario">
              {availableUsers.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.username}
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
