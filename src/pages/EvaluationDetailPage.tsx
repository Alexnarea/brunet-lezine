import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, Typography, Button, Table, message, Grid } from "antd";
import type { ColumnsType } from "antd/es/table";
import EvaluationsService from "../service/evaluationsService";
import type { EvaluationDetail, EvaluationItem } from "../models/Evaluation";
import { ArrowLeftOutlined, CalendarOutlined, UserOutlined } from "@ant-design/icons";
import { getCurrentUserFromToken } from "../utils/jwtHelper";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const EvaluationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();
  const childId = location.state?.childId;

  const [evaluation, setEvaluation] = useState<EvaluationDetail | null>(null);
  const currentUser = getCurrentUserFromToken();

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        if (!id) return;
        const data = await EvaluationsService.getDetail(Number(id));
        setEvaluation(data);
      } catch (error: any) {
        console.error("Error al cargar la evaluación:", error.response?.data || error.message);
        message.error("Error al cargar la evaluación");
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

  if (!evaluation) return <p style={{ padding: 24 }}>Cargando evaluación...</p>;

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

      <Card
        bordered={false}
        style={{
          borderRadius: 12,
          padding: screens.xs ? 16 : 24,
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          marginBottom: 32,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 8,
                backgroundColor: "#f0f2f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                color: "#595959",
              }}
            >
              📋
            </div>
            <div>
              <Title level={4} style={{ margin: 0 }}>
                Detalle de Evaluación #{evaluation.id}
              </Title>
              <Text type="secondary">Resultados del desarrollo infantil</Text>
            </div>
          </div>

          <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginTop: 12 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8, color: "#595959" }}>
              <CalendarOutlined />
              <span>
                <Text>Fecha: </Text>
                <Text strong>
                  {evaluation.applicationDate
                    ? new Date(evaluation.applicationDate).toLocaleDateString("es-ES")
                    : "No registrada"}
                </Text>
              </span>
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 8, color: "#595959" }}>
              <UserOutlined />
              <span>
                <Text>Evaluador: </Text>
                <Text strong>{currentUser?.sub || "N/A"}</Text>
              </span>
            </span>
          </div>

          <div
            style={{
              backgroundColor: "#f9f9f9",
              padding: 20,
              borderRadius: 8,
              marginTop: 16,
              lineHeight: 1.6,
            }}
          >
            <p><Text strong>Edad cronológica (AC):</Text> {ageToString(evaluation.chronologicalAgeMonths)}</p>
            <p><Text strong>Edad de desarrollo (AD):</Text> {evaluation.resultYears || "No alcanzada"}</p>
            <p><Text strong>Coeficiente de desarrollo (QD):</Text> {evaluation.coefficient !== undefined ? `${evaluation.coefficient.toFixed(2)}%` : "N/A"}</p>
            <p><Text strong>Clasificación:</Text> {evaluation.classification || "N/A"}</p>
            <p><Text strong>Observaciones:</Text> {evaluation.observaciones || "Ninguna"}</p>
          </div>
        </div>
      </Card>

      <Card title="Ítems Evaluados" style={{ borderRadius: 16 }}>
        {sortedAges.map((age) => (
          <div key={age} style={{ marginBottom: 24 }}>
            <Title level={5}>Edad de referencia: {ageToString(age)}</Title>
            <Table
              dataSource={groupedItems[age]}
              columns={columns}
              rowKey="id"
              pagination={false}
              scroll={{ x: screens.xs ? 300 : undefined }}
            />
          </div>
        ))}
      </Card>
    </div>
  );
};

export default EvaluationDetailPage;
