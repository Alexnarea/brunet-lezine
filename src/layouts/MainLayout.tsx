import React, { ReactNode } from 'react';
import { useAppStore } from '../../store';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { sidebarOpen } = useAppStore();
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <main 
        className="flex-1 transition-all duration-300 ease-in-out flex flex-col"
        style={{ 
          marginLeft: sidebarOpen ? '16rem' : '5rem',
          width: sidebarOpen ? 'calc(100% - 16rem)' : 'calc(100% - 5rem)'
        }}
      >
        <Header title={title} />
        
        <div className="flex-1 p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;