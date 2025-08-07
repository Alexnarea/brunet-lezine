import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Button, Typography, Row, Col, Modal, message, Select, Form, Input, DatePicker, Tag, Space, Spin
} from 'antd';
import {
  ArrowLeft, Baby, CalendarCheck, CircleUserRound,
  FileEdit, LineChart, FilePlus2, Filter, Award
} from 'lucide-react';
import moment from 'moment';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

import childrenService from '../service/ChildrenService';
import evaluationService from '../service/evaluationsService';
import reportService from '../service/reportService';
import type { Children } from '../models/Children';
import type { Evaluation } from '../models/Evaluation';
import type { ChildPayload } from '../models/Children';
import { DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const formatAge = (months: number) => {
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  const yStr = years > 0 ? `${years} año${years > 1 ? 's' : ''}` : '';
  const mStr = remMonths > 0 ? `${remMonths} mes${remMonths > 1 ? 'es' : ''}` : '';
  return [yStr, mStr].filter(Boolean).join(' y ');
};

const ChildDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [child, setChild] = useState<Children | null>(null);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [filteredEvaluations, setFilteredEvaluations] = useState<Evaluation[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  const normalizeCoefficient = (c: number) => c > 1 ? c / 100 : c;

  const chartData = evaluations
    .filter(e => e.applicationDate && e.coefficient !== null)
    .sort((a, b) => new Date(a.applicationDate!).getTime() - new Date(b.applicationDate!).getTime())
    .map((e, index) => ({
      fecha: `${new Date(e.applicationDate!).toISOString().split('T')[0]} #${index + 1}`,
      coeficiente: parseFloat((normalizeCoefficient(e.coefficient!) * 100).toFixed(2)),
      rawDate: new Date(e.applicationDate!).toLocaleDateString('es-ES'),
      classification: e.classification ?? 'N/A'
    }));

  const handleDownloadReport = async (evaluationId: number) => {
  try {
    await reportService.generateOrDownloadReport(evaluationId);
    message.success("Reporte descargado exitosamente");
  } catch (err) {
    message.error("No se pudo descargar el reporte");
  }
};


  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      setLoading(true);
      try {
        const childFound = await childrenService.getOne(id);
        const allEvaluations = await evaluationService.getAll();

        const childEvals = allEvaluations
          .filter(e => e.childrenId === Number(id))
          .sort((a, b) => new Date(b.applicationDate || 0).getTime() - new Date(a.applicationDate || 0).getTime());

        setChild(childFound);
        setEvaluations(childEvals);
        setFilteredEvaluations(childEvals);
      } catch (error) {
        message.error('Error al cargar datos');
        setChild(null);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  useEffect(() => {
    if (selectedYear) {
      const evalsFiltered = evaluations
        .filter(ev => ev.applicationDate && new Date(ev.applicationDate).getFullYear() === selectedYear)
        .sort((a, b) => new Date(b.applicationDate || 0).getTime() - new Date(a.applicationDate || 0).getTime());
      setFilteredEvaluations(evalsFiltered);
    } else {
      setFilteredEvaluations(evaluations);
    }
  }, [selectedYear, evaluations]);

  if (loading) {
    return <div style={{ padding: 80, textAlign: 'center' }}><Spin size="large" tip="Cargando perfil del niño..." /></div>;
  }

  if (!child) return <div style={{ padding: 24 }}>Niño no encontrado</div>;

  const birthDate = new Date(child.birthdate);
  const today = new Date();
  const ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());

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

  const uniqueYears = Array.from(new Set(evaluations.map(e => e.applicationDate ? new Date(e.applicationDate).getFullYear() : null).filter((y): y is number => y !== null))).sort((a, b) => b - a);

  const latestEvalId = evaluations.length > 0
    ? evaluations.reduce((latest, current) =>
        new Date(current.applicationDate || 0) > new Date(latest.applicationDate || 0) ? current : latest
      ).id
    : null;

  const genderColor = child.gender === 'Masculino' ? 'blue' : child.gender === 'Femenino' ? 'magenta' : 'gray';

  return (
    <div style={{ padding: 24 }}>

      <Button icon={<ArrowLeft size={16} />} onClick={() => navigate('/children')} style={{ marginBottom: 16 }}>Volver</Button>

      <Row gutter={24}>
        <Col xs={24} md={8}>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ width: 80, height: 80, margin: '0 auto', borderRadius: '50%', background: '#f0f0f0', fontSize: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                <CircleUserRound size={32} />
              </div>
              <Title level={4} style={{ marginTop: 12 }}>{child.fullName}</Title>

              <Tag color={genderColor}>{child.gender}</Tag>
            </div>

            <div style={{ marginTop: 16 }}>
              <Text strong><CalendarCheck size={14} style={{ marginRight: 6 }} /> Fecha de Nacimiento:</Text>
              <p>{birthDate.toLocaleDateString('es-ES')}</p>
              <Text strong><Baby size={14} style={{ marginRight: 6 }} /> Edad:</Text>
              <p>{formatAge(ageInMonths)}</p>
              <Text strong>NUI:</Text>
              <p>{child.nui}</p>
            </div>

            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
              <Button icon={<FileEdit size={16} />} onClick={openEditModal}>Editar</Button>
              <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>Eliminar</Button>
            </div>
          </Card>

          {chartData.length > 0 && (
            <Card size="small" style={{ marginTop: 24 }}>
              <Title level={5}><LineChart size={16} style={{ marginRight: 6 }} /> Progreso del coeficiente</Title>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fecha" />
                  <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    formatter={(value: number) => [`${value.toFixed(2)}%`, 'Coeficiente']}
                    labelFormatter={(label: string, payload) => {
                      const evalData = payload?.[0]?.payload;
                      return `Fecha: ${evalData?.rawDate}\nClasificación: ${evalData?.classification}`;
                    }}
                    cursor={{ strokeDasharray: '3 3' }}
                  />
                  <ReferenceLine y={80} stroke="green" strokeDasharray="3 3" label="Normal (80%)" />
                  <ReferenceLine y={50} stroke="orange" strokeDasharray="3 3" label="Retraso leve (50%)" />
                  <Line
                    type="monotone"
                    dataKey="coeficiente"
                    stroke="#1890ff"
                    strokeWidth={2}
                    dot
                    isAnimationActive={false}
                    activeDot={{ r: 6 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </Card>
          )}
        </Col>

        <Col xs={24} md={16}>
          <Card title={<><LineChart size={18} style={{ marginRight: 8 }} /> Evaluaciones</>}
            extra={<Button type="primary" icon={<FilePlus2 size={16} />} onClick={() => navigate(`/evaluations/new/${child.id}`)}>Nueva Evaluación</Button>}>
            <div style={{ marginBottom: 16 }}>
              <Text strong><Filter size={14} style={{ marginRight: 6 }} /> Filtrar por año:</Text>{' '}
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
  style={{
    marginBottom: 16,
    transition: '0.3s',
    boxShadow: evaluation.id === latestEvalId ? '0 0 10px rgba(24,144,255,0.5)' : 'none'
  }}
  hoverable
  onClick={() => {
    if (!child?.id) return;
    navigate(`/evaluations/${evaluation.id}`, {
      state: { childId: child.id }
    });
  }}
>
  <Row justify="space-between" align="middle" gutter={[8, 8]}>
    <Col xs={24} md={10}>
      <Text strong style={{ fontSize: 16 }}>
        <Award size={16} style={{ marginRight: 6 }} />
        Evaluación #{evaluation.id}
      </Text>{' '}
      {evaluation.id === latestEvalId && <Tag color="processing">Última</Tag>}
      <p style={{ margin: 4 }}>{evaluation.applicationDate ? new Date(evaluation.applicationDate).toLocaleDateString('es-ES') : "Fecha no registrada"}</p>
    </Col>

    <Col xs={24} md={14}>
  <div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      gap: 8,
      rowGap: 8,
    }}
    className="tags-container"
  >
        <Tag color="green" style={{ fontSize: 14, padding: '4px 10px' }}>
          AC: {formatAge(evaluation.chronologicalAgeMonths)}
        </Tag>
        <Tag color="blue" style={{ fontSize: 14, padding: '4px 10px' }}>
          AD: {evaluation.resultYears || "N/A"}
        </Tag>
        <Tag
          color={evaluation.classification === "Retraso severo" ? "red" : "orange"}
          style={{ fontSize: 14, padding: '4px 10px' }}
        >
          Dx: {evaluation.classification || "N/A"}
        </Tag>
        <Tag color={cdColor} style={{ fontSize: 14, padding: '4px 10px' }}>
          CD: {(normalizeCoefficient(evaluation.coefficient ?? 0) * 100).toFixed(2)}%
        </Tag>

        <Button
          size="small"
          type="primary"
          style={{ backgroundColor: "#1890ff", border: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
          onClick={(e) => {
            e.stopPropagation();
            handleDownloadReport(evaluation.id!);
          }}
        >
          <FileEdit size={14} /> Descargar PDF
        </Button>
      </div>
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
          <Form.Item name="fullName" label="Nombre completo" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="nui" label="NUI" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="birthdate" label="Fecha de nacimiento" rules={[{ required: true }]}><DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} /></Form.Item>
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
