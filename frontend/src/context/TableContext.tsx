import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface TableContextType {
  tableNumber: string | null;
  diningType: 'table' | 'takeaway' | null;
  setTableInfo: (tableNumber: string | null, diningType: 'table' | 'takeaway') => void;
  clearTableInfo: () => void;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

export function TableProvider({ children }: { children: ReactNode }) {
  const [tableNumber, setTableNumber] = useState<string | null>(() => {
    const saved = localStorage.getItem('tableNumber');
    return saved || null;
  });
  const [diningType, setDiningType] = useState<'table' | 'takeaway' | null>(() => {
    const saved = localStorage.getItem('diningType') as 'table' | 'takeaway' | null;
    return saved || null;
  });

  const setTableInfo = (newTableNumber: string | null, newDiningType: 'table' | 'takeaway') => {
    setTableNumber(newTableNumber);
    setDiningType(newDiningType);
    
    // Persist to localStorage
    if (newTableNumber) {
      localStorage.setItem('tableNumber', newTableNumber);
      localStorage.setItem('diningType', newDiningType);
    } else {
      localStorage.removeItem('tableNumber');
      localStorage.setItem('diningType', newDiningType);
    }
  };

  const clearTableInfo = () => {
    setTableNumber(null);
    setDiningType(null);
    localStorage.removeItem('tableNumber');
    localStorage.removeItem('diningType');
  };

  return (
    <TableContext.Provider value={{ tableNumber, diningType, setTableInfo, clearTableInfo }}>
      {children}
    </TableContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTable() {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('useTable must be used within TableProvider');
  }
  return context;
}
