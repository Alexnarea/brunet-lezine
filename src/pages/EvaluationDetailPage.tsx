// src/pages/EvaluationDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, Typography, Button, Table, message, Divider } from "antd";
import type { ColumnsType } from "antd/es/table";
import EvaluationsService from "../service/evaluationsService";
import type { EvaluationDetail, EvaluationItem } from "../models/Evaluation";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const EvaluationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const childId = location.state?.childId;

  const [evaluation, setEvaluation] = useState<EvaluationDetail | null>(null);

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        if (!id) return;
        const data = await EvaluationsService.getDetail(Number(id));
        setEvaluation(data);
      } catch (error) {
        message.error("Error al cargar la evaluación");
        console.error(error);
      }
    };

    fetchEvaluation();
  }, [id]);

  const columns: ColumnsType<EvaluationItem> = [
    {
      title: "Tarea",
      dataIndex: "task",
      key: "task",
    },
    {
      title: "Dominio",
      dataIndex: "domain",
      key: "domain",
    },
    {
      title: "Completado",
      dataIndex: "completed",
      key: "completed",
      render: (value: boolean) => (
        <span style={{ color: value ? "green" : "red" }}>
          {value ? "✓ Completado" : "✗ No"}
        </span>
      ),
    },
  ];

  const ageToString = (months: number) => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return `${years} año${years !== 1 ? "s" : ""} y ${remainingMonths} mes${remainingMonths !== 1 ? "es" : ""}`;
  };

  if (!evaluation) return <p>Cargando evaluación...</p>;

  // Agrupar ítems por referenceAgeMonths
  const groupedItems = evaluation.items.reduce((acc, item) => {
    const age = item.referenceAgeMonths || 0;
    if (!acc[age]) acc[age] = [];
    acc[age].push(item);
    return acc;
  }, {} as Record<number, EvaluationItem[]>);

  const sortedAges = Object.keys(groupedItems).map(Number).sort((a, b) => a - b);

  return (
    <div style={{ padding: 24 }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() =>
          childId ? navigate(`/children/${childId}`) : navigate("/evaluations")
        }
        style={{ marginBottom: 16 }}
      >
        Volver
      </Button>

      <Card title={`Evaluación #${evaluation.id}`}>
        <p>
          <Text strong>Fecha de aplicación:</Text>{" "}
          {evaluation.applicationDate
            ? new Date(evaluation.applicationDate).toLocaleDateString("es-ES")
            : "No registrada"}
        </p>
        <p>
          <Text strong>Edad cronológica (AR):</Text>{" "}
          {ageToString(evaluation.chronologicalAgeMonths)}
        </p>
        <p>
          <Text strong>Edad de desarrollo (AD):</Text>{" "}
            {evaluation.resultYears || "No alcanzada"}
        </p>

        <p>
          <Text strong>Coeficiente de desarrollo (QD):</Text>{" "}
          {evaluation.coefficient !== undefined
            ? `${evaluation.coefficient.toFixed(2)}%`
            : "N/A"}
        </p>
        <p>
          <Text strong>Clasificación:</Text> {evaluation.classification || "N/A"}
        </p>
        <p>
          <Text strong>Observaciones:</Text>{" "}
          {evaluation.observaciones || "Ninguna"}
        </p>
      </Card>

      <Divider />

      <Card title="Ítems Evaluados" style={{ marginTop: 24 }}>
        {sortedAges.map((age) => (
          <div key={age} style={{ marginBottom: 24 }}>
            <Title level={5}>
              Edad de referencia: {ageToString(age)}
            </Title>
            <Table
              dataSource={groupedItems[age]}
              columns={columns}
              rowKey="id"
              pagination={false}
            />
          </div>
        ))}
      </Card>
    </div>
  );
};

export default EvaluationDetailPage;
