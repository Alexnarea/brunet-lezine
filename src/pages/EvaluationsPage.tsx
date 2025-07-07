import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Typography, message, Card, Checkbox } from "antd";

import childrenService from "../service/ChildrenService";
import testItemService from "../service/TestItemService";
import EvaluationsService from "../service/evaluationsService";

import { getCurrentUserFromToken } from "../utils/jwtHelper";

import type { Children } from "../models/Children";
import type { EvaluationRequest, EvaluationItem, EvaluationResult } from "../models/Evaluation";

const { Title } = Typography;

const EvaluacionPage: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();

  const [child, setChild] = useState<Children | null>(null);
  const [edadReal, setEdadReal] = useState<number>(0);
  const [items, setItems] = useState<EvaluationItem[]>([]);

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
    return `${years} años ${remMonths} meses`;
  };

  return (
    <div style={{ padding: 20 }}>
      <Card style={{ marginBottom: 24, backgroundColor: "#f0f2f5" }}>
        <Title level={3}>Evaluación de {child?.fullName || "cargando..."}</Title>
        <p>Edad cronológica: {formatAge(edadReal)}</p>
        <p>Evaluador: {currentUser?.sub}</p>
      </Card>

      {Object.entries(groupedItems)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([age, group]) => (
          <Card key={age} title={formatAge(Number(age))} style={{ marginBottom: 16 }}>
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

      <Button type="primary" onClick={handleGuardar} style={{ marginTop: 16 }}>
        Guardar Evaluación
      </Button>
    </div>
  );
};

export default EvaluacionPage;
