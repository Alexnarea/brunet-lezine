// src/pages/EvaluacionPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Button, Input, message, Card } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import childrenService from '../service/ChildrenService';
import EvaluationsService from '../service/evaluationsService';
import type { EvaluationPayload } from '../models/Evaluation';
import type { Children } from '../models/Children';

type EvaluationItem = {
  id: string;
  task: string;
  domain: string;
  completed: boolean;
};

const testItemsByAge: Record<number, Omit<EvaluationItem, 'completed'>[]> = {
  3: [
    { id: 't1', task: 'Construye un puente de 5 cubos', domain: 'Motricidad' },
    { id: 't2', task: 'Hace un puzzle de 2 piezas', domain: 'Cognición' },
    { id: 't3', task: 'Compara 2 líneas', domain: 'Cognición' },
    { id: 't4', task: 'Copia un círculo', domain: 'Motricidad' },
    { id: 't5', task: 'Responde a 3 preposiciones', domain: 'Lenguaje' },
    { id: 't6', task: 'Repite sílabas', domain: 'Memoria' },
  ],
  4: [
    { id: 't1', task: 'Copia un cuadrado', domain: 'Motricidad' },
    { id: 't2', task: 'Dobla un papel en diagonal', domain: 'Motricidad' },
    { id: 't3', task: 'Describe una imagen', domain: 'Lenguaje' },
    { id: 't4', task: 'Responde a 5 preposiciones', domain: 'Lenguaje' },
    { id: 't5', task: 'Repite 3 cifras', domain: 'Memoria' },
    { id: 't6', task: 'Conoce 13 verbos en acción', domain: 'Lenguaje' },
  ],
  5: [
    { id: 't1', task: 'Construye una escalera con 10 cubos', domain: 'Motricidad' },
    { id: 't2', task: 'Copia una figura compleja', domain: 'Motricidad' },
    { id: 't3', task: 'Hace el puzzle de 4 piezas', domain: 'Cognición' },
    { id: 't4', task: 'Distingue mañana y tarde', domain: 'Lenguaje' },
    { id: 't5', task: 'Repite 12 sílabas', domain: 'Memoria' },
    { id: 't6', task: 'Cuenta 4 cubos', domain: 'Lógico-matemática' },
  ]
};

const EvaluacionPage: React.FC = () => {
  const { childId } = useParams();
  const [items, setItems] = useState<EvaluationItem[]>([]);
  const [observaciones, setObservaciones] = useState('');
  const [child, setChild] = useState<Children | null>(null);
  const [edadReal, setEdadReal] = useState<number>(0);

  useEffect(() => {
    const loadChild = async () => {
      try {
        if (childId) {
          const niño = await childrenService.getById(childId);
          setChild(niño);

          const birthDate = new Date(niño.birthdate);
          const today = new Date();
          const age = Math.floor(
            (today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
          );

          setEdadReal(age);
          const items = testItemsByAge[age] ?? testItemsByAge[4];
          const loadedItems = items.map(item => ({
            ...item,
            completed: false
          }));
          setItems(loadedItems);
        } else {
          // Si no hay childId, igual carga ítems por defecto
          const fallback = testItemsByAge[4];
          const loaded = fallback.map(item => ({ ...item, completed: false }));
          setItems(loaded);
        }
      } catch {
        // Si falla, igual muestra ítems por defecto
        const fallback = testItemsByAge[4];
        const loaded = fallback.map(item => ({ ...item, completed: false }));
        setItems(loaded);
        message.warning('No se pudo cargar al niño, se muestran ítems por defecto');
      }
    };

    loadChild();
  }, [childId]);

  const handleToggle = (id: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const edadDesarrollo = Math.round((items.filter(i => i.completed).length / items.length) * edadReal);
  const coeficiente = edadReal > 0 ? Math.round((edadDesarrollo / edadReal) * 100) : 0;

  const handleGuardar = async () => {
    if (!child) {
      message.warning('No se ha cargado el niño');
      return;
    }

    const nuevaEvaluacion: EvaluationPayload = {
      id: Date.now(),
      application_date: new Date().toISOString().split('T')[0],
      chronological_age: edadReal.toString(),
      children_id: child.id,
      evaluator_name: 'Evaluador Default',
      items,
      observaciones,
      edadDesarrollo,
      coeficiente
    };

    try {
      await EvaluationsService.create(nuevaEvaluacion);
      message.success('Evaluación guardada correctamente');
    } catch {
      message.error('Error al guardar evaluación');
    }
  };

  const columns: ColumnsType<EvaluationItem> = [
    { title: 'Tarea', dataIndex: 'task', key: 'task' },
    { title: 'Dominio', dataIndex: 'domain', key: 'domain' },
    {
      title: 'Completado',
      key: 'completed',
      render: (_, record) => (
        <input
          type="checkbox"
          checked={record.completed}
          onChange={() => handleToggle(record.id)}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {child && (
        <Card className="mb-6">
          <h2 className="text-lg font-bold mb-2">Evaluando a:</h2>
          <p className="text-xl text-gray-800">{child.fullName}</p>
        </Card>
      )}

      <Card className="mb-6">
        <p><strong>Edad real:</strong> {isNaN(edadReal) ? 'No disponible' : edadReal}</p>
        <p><strong>Edad desarrollo:</strong> {isNaN(edadDesarrollo) ? 'No disponible' : edadDesarrollo}</p>
        <p><strong>Coeficiente desarrollo:</strong> {coeficiente}%</p>
      </Card>

      <Table dataSource={items} columns={columns} rowKey="id" pagination={false} />

      <div style={{ marginTop: 16 }}>
        <label><strong>Observaciones:</strong></label>
        <Input.TextArea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          rows={3}
        />
      </div>

      <Button type="primary" onClick={handleGuardar} style={{ marginTop: 16 }}>
        Guardar evaluación
      </Button>
    </div>
  );
};

export default EvaluacionPage;
