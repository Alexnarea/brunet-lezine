import React, { ReactNode} from 'react';

interface LayoutProps {
  children: ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {children}
    </div>
  );
};

export default Layout;
