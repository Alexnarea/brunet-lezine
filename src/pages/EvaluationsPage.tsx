import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Input, message, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";

import childrenService from "../service/ChildrenService";
import evaluatorService from "../service/EvaluatorService";

import type {
  Children,
  ChildPayload,
} from "../models/Children";
import type {
  Evaluator,
  EvaluatorPayload,
}
   from "../models/Evaluator";
import type {
  Evaluation,
  EvaluationPayload,
  EvaluationItem,
} from "../models/Evaluation";
import EvaluationsService from "../service/evaluationsService";

const { Title } = Typography;

const testItemsByAge: Record<
  number,
  EvaluationItem[]
> = {
  0: [
    {
      id: "1",
      task: "Sostener la cabeza erguida",
      domain: "Motricidad gruesa",
      reinforcement: "",
      completed: false,
    },
    {
      id: "2",
      task: "Reaccionar a sonidos fuertes",
      domain: "Audición",
      reinforcement: "",
      completed: false,
    },
  ],
  1: [
    {
      id: "3",
      task: "Sentarse sin apoyo",
      domain: "Motricidad gruesa",
      reinforcement: "",
      completed: false,
    },
    {
      id: "4",
      task: "Balbucear sonidos simples",
      domain: "Lenguaje",
      reinforcement: "",
      completed: false,
    },
  ],
  2: [
    {
      id: "5",
      task: "Caminar con apoyo",
      domain: "Motricidad gruesa",
      reinforcement: "",
      completed: false,
    },
    {
      id: "6",
      task: "Decir palabras simples",
      domain: "Lenguaje",
      reinforcement: "",
      completed: false,
    },
  ],
 
};

const EvaluacionPage: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const [child, setChild] = useState<Children | null>(null);
  const [edadReal, setEdadReal] = useState<number>(0);
  const [items, setItems] = useState<EvaluationItem[]>([]);
  const [selectedEvaluator, setSelectedEvaluator] = useState<string>("");
  const [evaluators, setEvaluators] = useState<Evaluator[]>([]);
  const [observaciones, setObservaciones] = useState<string>("");
  const [edadDesarrollo, setEdadDesarrollo] = useState<number>(0);
  const [coeficiente, setCoeficiente] = useState<number>(0); 
  const [classification, setClasification] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      if (!childId) return;
      try {
        const allChildren = await childrenService.getAll();
        const niño = allChildren.find(
          (n) => n.id.toString() === childId
        );
        if (!niño) {
          message.error("Niño no encontrado");
          return;
        }
        setChild(niño);

        // Calcular edad real en años (aproximado)
       /*const birthDate = new Date(niño.birthdate);
        const today = new Date();
        const edad = Math.floor(
          (today.getTime() - birthDate.getTime()) /
            (365.25 * 24 * 60 * 60 * 1000)
        );
        setEdadReal(edad); */

        // Cargar evaluadores
        const evaluadores = await evaluatorService.getAll();
        setEvaluators(evaluadores);
        if (evaluadores.length > 0) {
          setSelectedEvaluator(evaluadores[0].fullName);
        }

        // Obtener tareas según edad, o vacío si no hay
        const tareasEdad = testItemsByAge[edadReal] || [];

        // Asegurar que reinforcement y completed estén inicializados
        const allItemsWithReinforcement = tareasEdad.map(
          (item) => ({
            ...item,
            completed: false,
            reinforcement: "",
          })
        );
        setItems(allItemsWithReinforcement);
      } catch (error) {
        message.error("Error cargando datos");
        console.error(error);
      }
    };

    loadData();
  }, [childId]);

  // Alternar completado
  const handleToggle = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  };

useEffect(() => {
  const loadData = async () => {
    if (!childId) return;
    try {

      const evaluacion = (await EvaluationsService.getAll())[0];
      if (evaluacion) {
        setEdadReal(Number(evaluacion.chronological_age)); 
        setEdadDesarrollo(Number(evaluacion.edadDesarrollo));
        setCoeficiente(Number(evaluacion.coeficiente));
        setClasification(evaluacion.clasification || "");

    }
   } catch (error) {
      message.error("Error cargando datos");
    }
  };
  loadData();
}, [childId]);

// ...en el render...

  // Calcular edad de desarrollo y coeficiente esto viene desde el backend
  /* const edadReal = child

    ? Math.floor(
        (new Date().getTime() - new Date(child.birthdate).getTime()) /
          (365.25 * 24 * 60 * 60 * 1000)
      )
    : 0;
  const edadDesarrollo = Math.round(
    (items.filter((i) => i.completed).length / items.length) *
      edadReal
  );
  const coeficiente =
    edadReal > 0
      ? Math.round((edadDesarrollo / edadReal) * 100)
      : 0;

      */

  // Guardar evaluación
  const handleGuardar = async () => {
    if (!child) {
      message.warning("No se ha cargado el niño");
      return;
    }
    if (!selectedEvaluator) {
      message.warning("Seleccione un evaluador");
      return;
    }

    const nuevaEvaluacion: EvaluationPayload = {
      id: Date.now(), // número
      application_date: new Date()
        .toISOString()
        .split("T")[0],
      chronological_age: edadReal.toString(),
      children_id: child.id,
      evaluator_name: selectedEvaluator,
      items,
      observaciones,
      edadDesarrollo,
      coeficiente,
    };

    try {
      await EvaluationsService.create(nuevaEvaluacion);
      message.success("Evaluación guardada correctamente");
    } catch (error) {
      message.error("Error al guardar evaluación");
      console.error(error);
    }
  };

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
      key: "completed",
      render: (_, record) => (
        <input
          type="checkbox"
          checked={record.completed}
          onChange={() => handleToggle(record.id)}
        />
      ),
    },
    /*{
      title: "Refuerzo",
      key: "reinforcement",
      render: (_, record) => (
        <Input
          value={record.reinforcement}
          onChange={(e) =>
            handleReinforcementChange(record.id, e.target.value)
          }
          placeholder="Agregar refuerzo"
        />
      ),
    },
    */
  ];

  return (
    <div style={{ padding: 20 }}>
      <Title level={3}>
        Evaluación de {child ? child.fullName : "cargando..."}
      </Title>

      <p>Edad real: {edadReal} años</p>
      <p>Edad de desarrollo: {edadDesarrollo}</p>
      <p>Coeficiente: {coeficiente}%</p>
      <p>Clasificación: {clasification}</p>

      <div style={{ marginBottom: 12 }}>
        <label>
          Evaluador:{" "}
          <select
            value={selectedEvaluator}
            onChange={(e) =>
              setSelectedEvaluator(e.target.value)
            }
          >
            {evaluators.map((ev) => (
              <option key={ev.id} value={ev.fullName}>
                {ev.fullName}
              </option>
            ))}
          </select>
        </label>
      </div>

      <Table
        dataSource={items}
        columns={columns}
        rowKey="id"
        pagination={false}
        style={{ marginBottom: 16 }}
      />

      <div style={{ marginBottom: 12 }}>
        <label>Observaciones:</label>
        <Input.TextArea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          rows={4}
          placeholder="Escribe tus observaciones aquí..."
        />
      </div>

      

      <Button type="primary" onClick={handleGuardar}>
        Guardar Evaluación
      </Button>
    </div>
  );
};

export default EvaluacionPage;
