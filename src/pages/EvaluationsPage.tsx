import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Button, Input, message, Card } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Evaluation } from '../models/Evaluation';

const testItemsByAge: Record<number, Omit<Evaluation, 'completed'>[]> = {
  4: [
    { id: 't1', task: 'Copia un cuadrado', domain: 'Motricidad', reinforcement: 'Practicar figuras geométricas' },
    { id: 't2', task: 'Dobla un papel en diagonal', domain: 'Motricidad', reinforcement: 'Origami simple' },
    { id: 't3', task: 'Describe una imagen', domain: 'Lenguaje', reinforcement: 'Cuentos ilustrados' },
    { id: 't4', task: 'Responde a 5 preposiciones', domain: 'Lenguaje', reinforcement: 'Juegos de instrucciones' },
    { id: 't5', task: 'Repite 3 cifras', domain: 'Memoria', reinforcement: 'Repetición auditiva' },
    { id: 't6', task: 'Conoce 13 verbos en acción', domain: 'Lenguaje', reinforcement: 'Juego de mímica' },
  ],
  5: [
    { id: 't1', task: 'Construye una escalera', domain: 'Motricidad', reinforcement: 'Bloques de construcción' },
    { id: 't2', task: 'Copia una figura compleja', domain: 'Motricidad', reinforcement: 'Dibujo guiado' },
    { id: 't3', task: 'Hace un puzzle de 4 piezas', domain: 'Cognición', reinforcement: 'Rompecabezas progresivo' },
    { id: 't4', task: 'Distingue mañana y tarde', domain: 'Lenguaje', reinforcement: 'Rutinas del día' },
    { id: 't5', task: 'Repite 12 sílabas', domain: 'Memoria', reinforcement: 'Secuencias orales' },
    { id: 't6', task: 'Cuenta 4 cubos', domain: 'Lógico-matemática', reinforcement: 'Conteo con objetos' },
  ]
};


const EvaluacionPage: React.FC = () => {
  const { edad } = useParams();
  const parsedEdad = parseInt(edad || '4');
  const [items, setItems] = useState<Evaluation[]>([]);
  const [observaciones, setObservaciones] = useState('');

  useEffect(() => {
    const loaded = testItemsByAge[parsedEdad]?.map(item => ({ ...item, completed: false })) || [];
    setItems(loaded);
  }, [parsedEdad]);

  const handleToggle = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const calcularProgreso = () => {
    const completados = items.filter(i => i.completed).length;
    return Math.round((completados / items.length) * 100);
  };

  const edadReal = parsedEdad;
  const edadDesarrollo = Math.round((items.filter(i => i.completed).length / items.length) * edadReal);
  const coeficiente = edadReal > 0 ? Math.round((edadDesarrollo / edadReal) * 100) : 0;

  const handleGuardar = () => {
    const evaluacionFinal = {
      edad: parsedEdad,
      items,
      observaciones,
      edadReal,
      edadDesarrollo,
      coeficiente
    };
    console.log('Guardar evaluación:', evaluacionFinal);
    message.success('Evaluación guardada (simulada)');
  };

  const columns: ColumnsType<EvaluationItem> = [
    {
      title: 'Tarea',
      dataIndex: 'task',
      key: 'task',
    },
    {
      title: 'Dominio',
      dataIndex: 'domain',
      key: 'domain',
    },
    {
      title: 'Refuerzo',
      dataIndex: 'reinforcement',
      key: 'reinforcement',
    },
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
      <Card title="Resumen de evaluación" style={{ marginBottom: 16 }}>
        <p>Edad real: {edadReal}</p>
        <p>Edad de desarrollo: {edadDesarrollo}</p>
        <p>Coeficiente de desarrollo: {coeficiente}</p>
      </Card>

      <Table
        dataSource={items}
        columns={columns}
        rowKey="id"
        pagination={false}
      />

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
