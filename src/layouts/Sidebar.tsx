// src/layouts/Sidebar.tsx
import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white shadow h-full hidden lg:block">
      <div className="p-4 text-lg font-bold border-b">Menú</div>
      <ul className="p-4 space-y-2">
        <li>Inicio</li>
        <li>Niños</li>
        <li>Evaluaciones</li>
      </ul>
    </aside>
  );
};

export default Sidebar;
