import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Typography, Row, Col, Modal, message, Select } from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import childrenService from '../service/ChildrenService';
import evaluationService from '../service/evaluationsService';
import type { Children } from '../models/Children';
import type { Evaluation } from '../models/Evaluation';

const { Title, Text } = Typography;

const ChildDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [child, setChild] = useState<Children | null>(null);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [filteredEvaluations, setFilteredEvaluations] = useState<Evaluation[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const childFound = await childrenService.getOne(id);
        const allEvaluations = await evaluationService.getAll();
        const childEvals = allEvaluations.filter(e => e.children_id === Number(id));

        setChild(childFound);
        setEvaluations(childEvals);
        setFilteredEvaluations(childEvals);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        message.error('Error al cargar datos');
        setChild(null);
      }
    };

    loadData();
  }, [id]);

  useEffect(() => {
    if (selectedYear) {
      const evalsFiltered = evaluations.filter(ev => {
        const year = new Date(ev.application_date).getFullYear();
        return year === selectedYear;
      });
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
  const age = Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

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
    new Set(evaluations.map(e => new Date(e.application_date).getFullYear()))
  ).sort((a, b) => b - a);

  return (
    <div style={{ padding: 24 }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/children')} style={{ marginBottom: 16 }}>
        Volver
      </Button>

      <Row gutter={24}>
        {/* Perfil del niño */}
        <Col xs={24} md={8}>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div
                style={{
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
                }}
              >
                {child.fullName.charAt(0)}
              </div>
              <Title level={4} style={{ marginTop: 12 }}>{child.fullName}</Title>
              <Text type="secondary">{child.gender}</Text>
            </div>

            <div style={{ marginTop: 16 }}>
              <Text strong>Fecha de Nacimiento:</Text>
              <p>{birthDate.toLocaleDateString('es-ES')}</p>

              <Text strong>Edad:</Text>
              <p>{age} años</p>

              <Text strong>NUI:</Text>
              <p>{child.nui}</p>
            </div>

            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
              <Button icon={<EditOutlined />} onClick={() => console.log('Editar niño')}>Editar</Button>
              <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>Eliminar</Button>
            </div>
          </Card>
        </Col>

        {/* Evaluaciones */}
        <Col xs={24} md={16}>
          <Card
            title="Evaluaciones"
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate(`/evaluations/new/${child.id}`)}>
                Nueva Evaluación
              </Button>
            }
          >
            {/* Filtro por año */}
            <div style={{ marginBottom: 16 }}>
              <Text strong>Filtrar por año:</Text>{' '}
              <Select
                allowClear
                placeholder="Selecciona un año"
                style={{ width: 200 }}
                onChange={(value) => setSelectedYear(value)}
              >
                {uniqueYears.map(year => (
                  <Select.Option key={year} value={year}>
                    {year}
                  </Select.Option>
                ))}
              </Select>
            </div>

            {filteredEvaluations.length === 0 ? (
              <Text type="secondary">No hay evaluaciones registradas.</Text>
            ) : (
              filteredEvaluations.map(evaluation => (
                <Card
                  key={evaluation.id}
                  style={{ marginBottom: 16 }}
                  hoverable
                  onClick={() => navigate(`/evaluations/${evaluation.id}`)}
                >
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Text strong>Evaluación #{evaluation.id}</Text>
                      <p style={{ margin: 0 }}>{new Date(evaluation.application_date).toLocaleDateString('es-ES')}</p>
                    </Col>
                    <Col>
                      <Text style={{
                        backgroundColor: '#d1fae5',
                        color: '#065f46',
                        padding: '4px 8px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 'bold'
                      }}>
                        CD: {evaluation.coeficiente}
                      </Text>
                    </Col>
                  </Row>
                </Card>
              ))
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ChildDetail;
