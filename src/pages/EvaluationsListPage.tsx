import React, { useEffect, useState } from "react";
import { Table, Typography, Button } from "antd";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import type { Evaluation } from "../models/Evaluation";
import EvaluationsService from "../service/evaluationsService";

const { Title } = Typography;

const EvaluationsListPage: React.FC = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    const data = await EvaluationsService.getAll();
    setEvaluations(
      data.sort((a, b) =>
        new Date(b.applicationDate || "").getTime() - new Date(a.applicationDate || "").getTime()
      )
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns: ColumnsType<Evaluation> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id"
    },
    {
      title: "Fecha",
      dataIndex: "applicationDate",
      key: "applicationDate",
      render: (date) =>
        date ? new Date(date).toLocaleDateString("es-ES") : "No registrada"
    },
    {
      title: "Edad Cronológica (meses)",
      dataIndex: "chronologicalAgeMonths",
      key: "chronologicalAgeMonths"
    },
    {
      title: "Clasificación",
      dataIndex: "classification",
      key: "classification",
      render: (value) => value ?? "Sin clasificar"
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, record) => (
        <Button onClick={() => navigate(`/evaluations/${record.id}`)}>
          Ver detalles
        </Button>
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Listado de Evaluaciones</Title>
      <Button onClick={fetchData} style={{ marginBottom: 16 }}>
        Recargar
      </Button>
      <Table dataSource={evaluations} columns={columns} rowKey="id" />
    </div>
  );
};

export default EvaluationsListPage;
