import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../layout/MainLayout';
import Button from '../components/shared/Button';

type EvaluationItem = {
  id: string;
  task: string;
  domain: string;
  reinforcement: string;
  completed: boolean;
};

const testItemsByAge: Record<number, Omit<EvaluationItem, 'completed'>[]> = {
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
  const { edad } = useParams(); // espera una ruta como /evaluacion/edad-4
  const parsedEdad = parseInt(edad || '4');

  const [items, setItems] = useState<EvaluationItem[]>([]);
  const [observaciones, setObservaciones] = useState('');

  useEffect(() => {
    const loaded = testItemsByAge[parsedEdad]?.map(item => ({ ...item, completed: false })) || [];
    setItems(loaded);
  }, [parsedEdad]);

  const handleToggle = (id: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const calcularProgreso = () => {
    const completados = items.filter(i => i.completed).length;
    return Math.round((completados / items.length) * 100);
  };

  const edadReal = parsedEdad; // Puedes calcularlo si tienes birthDate
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
    alert('Evaluación guardada (simulada)');
  };

  return (
    <Layout title="Test Brunet-Lézine">
      <div className="p-4 max-w-3xl mx-auto space-y-4">
        <div className="bg-yellow-300 rounded p-4 text-sm font-medium space-y-2">
          <div>Nombre: <span className="font-normal">Nombre Completo</span></div>
          <div>Fecha de Nacimiento: 0000-00-00</div>
          <div>Fecha de Evaluación: 0000-00-00</div>
          <div className="flex gap-4">
            <span>Edad Real: {edadReal}</span>
            <span>Edad Desarrollo: {edadDesarrollo}</span>
            <span>Coeficiente Desarrollo: {coeficiente}</span>
          </div>
        </div>

        <div className="bg-gray-100 rounded p-4">
          {items.map((item, idx) => (
            <div key={item.id} className="flex items-center justify-between py-2 border-b">
              <div>
                <div className="font-medium">{idx + 1}. {item.task}</div>
                <div className="text-xs text-gray-600">{item.domain}</div>
              </div>
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => handleToggle(item.id)}
              />
            </div>
          ))}
        </div>

        <div className="bg-yellow-100 p-3 rounded">
          <label className="block font-semibold mb-1">Observaciones:</label>
          <textarea
            rows={3}
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="w-full p-2 rounded border"
          />
        </div>

        <Button onClick={handleGuardar}>Guardar</Button>
      </div>
    </Layout>
  );
};

export default EvaluacionPage;
