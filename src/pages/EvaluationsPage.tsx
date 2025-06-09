// src/pages/EvaluacionPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Button, Input, message, Card, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import childrenService from '../service/ChildrenService';
import EvaluationsService from '../service/evaluationsService';
import evaluatorsService from '../service/EvaluatorService';
import type { EvaluationPayload } from '../models/Evaluation';
import type { Children } from '../models/Children';
import type { Evaluator } from '../models/Evaluator';

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
    { id: 't7', task: 'Copia un cuadrado', domain: 'Motricidad' },
    { id: 't8', task: 'Dobla un papel en diagonal', domain: 'Motricidad' },
    { id: 't9', task: 'Describe una imagen', domain: 'Lenguaje' },
    { id: 't10', task: 'Responde a 5 preposiciones', domain: 'Lenguaje' },
    { id: 't11', task: 'Repite 3 cifras', domain: 'Memoria' },
    { id: 't12', task: 'Conoce 13 verbos en acción', domain: 'Lenguaje' },
  ],
  5: [
    { id: 't13', task: 'Construye una escalera con 10 cubos', domain: 'Motricidad' },
    { id: 't14', task: 'Copia una figura compleja', domain: 'Motricidad' },
    { id: 't15', task: 'Hace el puzzle de 4 piezas', domain: 'Cognición' },
    { id: 't16', task: 'Distingue mañana y tarde', domain: 'Lenguaje' },
    { id: 't17', task: 'Repite 12 sílabas', domain: 'Memoria' },
    { id: 't18', task: 'Cuenta 4 cubos', domain: 'Lógico-matemática' },
  ]
};

const EvaluacionPage: React.FC = () => {
  const { childId } = useParams();
  const [items, setItems] = useState<EvaluationItem[]>([]);
  const [observaciones, setObservaciones] = useState('');
  const [child, setChild] = useState<Children | null>(null);
  const [evaluators, setEvaluators] = useState<Evaluator[]>([]);
  const [selectedEvaluator, setSelectedEvaluator] = useState('');
  const [edadReal, setEdadReal] = useState<number>(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (childId) {
          const allChildren = await childrenService.getAll();
          const niño = allChildren.find(n => n.id.toString() === childId);
          if (niño) {
            setChild(niño);

            const birthDate = new Date(niño.birthdate);
            const today = new Date();
            const age = Math.floor(
              (today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
            );
            // Imprimir la edad en años
            console.log(`Edad del niño: ${age} años`);
            setEdadReal(age);
          }
        const evaluadores = await evaluatorsService.getAll();
        setEvaluators(evaluadores);
        if (evaluadores.length > 0) {
          //setSelectedEvaluator(evaluadores[0].fullName);
        }

        
        }

        // Combinar todos los ítems de todas las edades
        const allItems = Object.values(testItemsByAge).flat().map(item => ({
          ...item,
          completed: false
        }));
        setItems(allItems);
      } catch {
        message.error('Error cargando datos');
        console.log( "ERROR CON EL SEREVER");
      }
    };

    loadData();
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
      evaluator_name: selectedEvaluator,
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

      <div style={{ marginBottom: 16 }}>
        <strong>Evaluador:</strong>
        <Select
          style={{ width: '100%' }}
          value={selectedEvaluator}
          onChange={value => setSelectedEvaluator(value)}
        >
          
        </Select>
      </div>

      <Card className="mb-6">
        <p><strong>Edad real:</strong> {isNaN(edadReal) ? 'No disponible' : edadReal}</p>
        <p><strong>Edad desarrollo:</strong> {isNaN(edadDesarrollo) ? 'No disponible' : edadDesarrollo}</p>
        <p><strong>Coeficiente desarrollo:</strong> {coeficiente}%</p>
      </Card>

      <Table dataSource={items} columns={columns} rowKey="id" pagination={false} />

      <div style={{ marginTop: 16 }}>
        <label><strong>Recomendaciones:</strong></label>
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
