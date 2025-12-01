//context/auth_context.tsx
import React, { useEffect, createContext, useState, useContext, type ReactNode } from 'react';
import { subscribeLoading } from '../api/backend_connect';

const LoadingContext = createContext<{ isLoading: boolean }>({ isLoading: false });

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
 const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeLoading(setIsLoading);
    return unsubscribe; // 組件卸載時自動取消訂閱
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useGlobalLoading = () => useContext(LoadingContext).isLoading;