import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Typography, message, Card, Checkbox, Spin, Grid } from "antd";
import { UserOutlined, CalendarOutlined, FileTextOutlined } from "@ant-design/icons";

import childrenService from "../service/ChildrenService";
import testItemService from "../service/TestItemService";
import EvaluationsService from "../service/evaluationsService";

import { getCurrentUserFromToken } from "../utils/jwtHelper";

import type { Children } from "../models/Children";
import type { EvaluationRequest, EvaluationItem, EvaluationResult } from "../models/Evaluation";

const { Title } = Typography;
const { useBreakpoint } = Grid;

const EvaluacionPage: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const screens = useBreakpoint();

  const [child, setChild] = useState<Children | null>(null);
  const [edadReal, setEdadReal] = useState<number>(0);
  const [items, setItems] = useState<EvaluationItem[]>([]);
  const [saving, setSaving] = useState(false);

  const currentUser = getCurrentUserFromToken();

  useEffect(() => {
    const loadData = async () => {
      if (!childId) return;

      try {
        const allChildren = await childrenService.getAll();
        const nino = allChildren.find(n => n.id.toString() === childId);

        if (!nino) {
          message.error("Niño no encontrado");
          return;
        }

        setChild(nino);

        if (nino.birthdate) {
          const birthDate = new Date(nino.birthdate);
          const today = new Date();
          const ageInMonths =
            (today.getFullYear() - birthDate.getFullYear()) * 12 +
            (today.getMonth() - birthDate.getMonth());
          setEdadReal(ageInMonths);
        }

        const fetchedItems = await testItemService.getAll();
        const formattedItems = fetchedItems.map(item => ({
          id: item.id,
          task: item.description,
          domain: item.descriptionDomain || "No definido",
          referenceAgeMonths: item.referenceAgeMonths,
          completed: false,
        }));
        setItems(formattedItems);
      } catch (error) {
        console.error(error);
        message.error("Error al cargar datos para evaluación");
      }
    };

    loadData();
  }, [childId]);

  const handleToggle = (id: number) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleGuardar = async () => {
    if (!child) {
      message.warning("Faltan datos para guardar");
      return;
    }

    setSaving(true);

    const formattedResponses = items.map(item => ({
      itemId: item.id,
      passed: item.completed,
    }));

    const payload: EvaluationRequest = {
      chronologicalAgeMonths: edadReal,
      childrenId: child.id,
      responses: formattedResponses,
    };

    try {
      const result: EvaluationResult = await EvaluationsService.createWithResponses(payload);
      message.success(
        `Guardado ✅ | AD: ${result.resultYears} | QD: ${
          result.coefficient !== undefined && result.coefficient !== null
            ? `${result.coefficient.toFixed(2)}%`
            : "N/A"
        }`
      );
      navigate(`/children/${child.id}`);
    } catch (error: any) {
      console.error("❌ Error al guardar evaluación:", error.response?.data || error.message);
      message.error("Error al guardar evaluación");
    } finally {
      setSaving(false);
    }
  };

  const groupedItems = items.reduce((acc, item) => {
    const group = item.referenceAgeMonths ?? 0;
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<number, EvaluationItem[]>);

  const formatAge = (months: number): string => {
    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    return `${years} año${years !== 1 ? "s" : ""} ${remMonths} mes${remMonths !== 1 ? "es" : ""}`;
  };

  if (saving) {
    return (
      <div style={{ padding: 80, textAlign: "center" }}>
        <Spin size="large" tip="Guardando evaluación..." />
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <Card
        bordered={false}
        style={{
          marginBottom: 24,
          borderRadius: 16,
          padding: screens.xs ? 16 : 24,
          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
            }}>
              🧠
            </div>
            <div>
              <Title level={3} style={{ margin: 0, color: '#fff' }}>
                Nueva Evaluación
              </Title>
              <p style={{ margin: 0, color: '#e0e0e0' }}>
                Evaluación del desarrollo cognitivo
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <UserOutlined />
              <strong>{child?.fullName}</strong>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CalendarOutlined />
              <span>Edad: <strong>{formatAge(edadReal)}</strong></span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileTextOutlined />
              <span>Evaluador: <strong>{currentUser?.sub}</strong></span>
            </span>
          </div>
        </div>
      </Card>

      {Object.entries(groupedItems)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([age, group]) => (
          <Card key={age} title={formatAge(Number(age))} style={{ marginBottom: 16, borderRadius: 12 }}>
            {group.map(item => (
              <div key={item.id} style={{ marginBottom: 8 }}>
                <Checkbox
                  checked={item.completed}
                  onChange={() => handleToggle(item.id)}
                >
                  {item.task}
                </Checkbox>
              </div>
            ))}
          </Card>
        ))}

      <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
        <Button type="default" onClick={() => navigate(`/children/${child?.id}`)}>
          Cancelar
        </Button>
        <Button type="primary" onClick={handleGuardar}>
          Guardar Evaluación
        </Button>
      </div>
    </div>
  );
};

export default EvaluacionPage;
