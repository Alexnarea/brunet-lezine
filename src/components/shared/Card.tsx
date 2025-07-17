import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  color?: string;
  header?: ReactNode;
  footer?: ReactNode;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  color,
  header,
  footer,
  onClick
}) => {
  const cardStyle = color ? { borderTop: `4px solid ${color}` } : {};
  
  return (
    <div 
      className={`card ${className}`} 
      style={cardStyle}
      onClick={onClick}
    >
      {header && (
        <div className="p-4 border-b border-gray-200">
          {header}
        </div>
      )}
      
      <div className="p-4">
        {children}
      </div>
      
      {footer && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;