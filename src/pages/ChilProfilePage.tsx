import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Button, Typography, Row, Col, Modal, message, Select, Form, Input, DatePicker, Tag, Badge, Space
} from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';

import childrenService from '../service/ChildrenService';
import evaluationService from '../service/evaluationsService';
import type { Children } from '../models/Children';
import type { Evaluation } from '../models/Evaluation';
import type { ChildPayload } from '../models/Children';

const { Title, Text } = Typography;
const { Option } = Select;

const ChildDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [child, setChild] = useState<Children | null>(null);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [filteredEvaluations, setFilteredEvaluations] = useState<Evaluation[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      try {
        const childFound = await childrenService.getOne(id);
        const allEvaluations = await evaluationService.getAll();
        const childEvals = allEvaluations.filter(e => e.childrenId === Number(id));
        setChild(childFound);
        setEvaluations(childEvals);
        setFilteredEvaluations(childEvals);
      } catch (error) {
        message.error('Error al cargar datos');
        setChild(null);
      }
    };
    loadData();
  }, [id]);

  useEffect(() => {
    if (selectedYear) {
      const evalsFiltered = evaluations.filter(ev =>
        ev.applicationDate && new Date(ev.applicationDate).getFullYear() === selectedYear
      );
      setFilteredEvaluations(evalsFiltered);
    } else {
      setFilteredEvaluations(evaluations);
    }
  }, [selectedYear, evaluations]);

  if (!child) {
    return <div style={{ padding: 24 }}>Niño no encontrado</div>;
  }

  const birthDate = new Date(child.birthdate);
  const today = new Date();
  const ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 +
                      (today.getMonth() - birthDate.getMonth());
  const ageYears = Math.floor(ageInMonths / 12);
  const ageMonths = ageInMonths % 12;

  const openEditModal = () => {
    form.setFieldsValue({
      fullName: child.fullName,
      nui: child.nui,
      birthdate: moment(child.birthdate),
      gender: child.gender,
    });
    setModalVisible(true);
  };

  const onFinish = async (values: any) => {
    try {
      const payload: ChildPayload = {
        fullName: values.fullName,
        nui: values.nui,
        birthdate: values.birthdate.format("YYYY-MM-DD"),
        gender: values.gender,
      };
      await childrenService.update(child.id.toString(), payload);
      message.success("Niño actualizado");
      setModalVisible(false);
      const updatedChild = await childrenService.getOne(id!);
      setChild(updatedChild);
    } catch (error) {
      message.error("Error actualizando niño");
    }
  };

  const handleDelete = async () => {
    Modal.confirm({
      title: '¿Estás seguro que deseas eliminar este niño?',
      okText: 'Sí, eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await childrenService.delete(child.id.toString());
          message.success('Niño eliminado correctamente');
          navigate('/children');
        } catch {
          message.error('Error al eliminar');
        }
      },
    });
  };

  const uniqueYears = Array.from(
    new Set(
      evaluations
        .map(e => {
          if (e.applicationDate) {
            const date = new Date(e.applicationDate);
            return !isNaN(date.getTime()) ? date.getFullYear() : null;
          }
          return null;
        })
        .filter((year): year is number => typeof year === "number")
    )
  ).sort((a, b) => b - a);

  // Obtener la evaluación más reciente
  const latestEvalId = evaluations.length > 0 
    ? evaluations.reduce((latest, current) => {
        return new Date(current.applicationDate || 0) > new Date(latest.applicationDate || 0) ? current : latest;
      }).id
    : null;

  // Colores para el tag de género
  const genderColor = child.gender === 'Masculino'
    ? 'blue'
    : child.gender === 'Femenino'
    ? 'magenta'
    : 'gray';

  return (
    <div style={{ padding: 24 }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/children')} style={{ marginBottom: 16 }}>
        Volver
      </Button>

      <Row gutter={24}>
        <Col xs={24} md={8}>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{
                width: 80,
                height: 80,
                margin: '0 auto',
                borderRadius: '50%',
                background: '#f0f0f0',
                fontSize: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#999',
              }}>
                {child.fullName.charAt(0)}
              </div>
              <Title level={4} style={{ marginTop: 12 }}>{child.fullName}</Title>
              <Tag color={genderColor}>{child.gender}</Tag>
            </div>

            <div style={{ marginTop: 16 }}>
              <Text strong>Fecha de Nacimiento:</Text>
              <p>{birthDate.toLocaleDateString('es-ES')}</p>

              <Text strong>Edad:</Text>
              <p>{ageYears} años y {ageMonths} meses</p>

              <Text strong>NUI:</Text>
              <p>{child.nui}</p>
            </div>

            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
              <Button icon={<EditOutlined />} onClick={openEditModal}>Editar</Button>
              <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>Eliminar</Button>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card
            title="Evaluaciones"
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate(`/evaluations/new/${child.id}`)}>
                Nueva Evaluación
              </Button>
            }
          >
            <div style={{ marginBottom: 16 }}>
              <Text strong>Filtrar por año:</Text>{' '}
              <Select
                allowClear
                placeholder="Selecciona un año"
                style={{ width: 200 }}
                onChange={(value) => setSelectedYear(value)}
              >
                {uniqueYears.map(year => (
                  <Option key={year} value={year}>{year}</Option>
                ))}
              </Select>
            </div>

            {filteredEvaluations.length === 0 ? (
              <Text type="secondary">No hay evaluaciones registradas.</Text>
            ) : (
              filteredEvaluations.map(evaluation => {
                const cdColor = evaluation.coefficient != null
                  ? evaluation.coefficient > 0.8 ? 'green'
                  : evaluation.coefficient > 0.5 ? 'orange'
                  : 'red'
                  : 'default';
                
                return (
                  <Card
                    key={evaluation.id}
                    style={{ marginBottom: 16, transition: '0.3s', boxShadow: evaluation.id === latestEvalId ? '0 0 10px rgba(24,144,255,0.5)' : 'none' }}
                    hoverable
                    onClick={() => {
                      if (!child?.id) return;
                      navigate(`/evaluations/${evaluation.id}`, {
                        state: { childId: child.id }
                      });
                    }}
                  >
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Text strong>Evaluación #{evaluation.id}</Text>{' '}
                        {evaluation.id === latestEvalId && <Tag color="processing">Última</Tag>}
                        <p>{evaluation.applicationDate
                          ? new Date(evaluation.applicationDate).toLocaleDateString('es-ES')
                          : "Fecha no registrada"}</p>
                        {evaluation.resultDetail && (
                          <Text type="secondary">{evaluation.resultDetail}</Text>
                        )}
                      </Col>
                      <Col flex="auto">
                        <Space wrap size={[12, 12]} style={{ justifyContent: 'end', width: '100%' }}>
                          <Tag color="green">AC: {evaluation.chronologicalAgeMonths} meses</Tag>
                          <Tag color="blue">AD: {evaluation.resultYears || "N/A"}</Tag>
                          <Badge
                            color={evaluation.classification === "Retraso severo" ? "red" : "green"}
                            text={`Dx: ${evaluation.classification || "N/A"}`}
                          />
                          <Tag color={cdColor}>CD: {(evaluation.coefficient ?? 0).toFixed(2)}%</Tag>
                        </Space>
                      </Col>
                    </Row>
                  </Card>
                );
              })
            )}
          </Card>
        </Col>
      </Row>

      <Modal
        title="Editar Niño"
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

export default ChildDetail;
