//context/auth_context.tsx
import React, { createContext, useState  } from 'react';
import type { ReactNode } from 'react';

type AuthContextType = {
    token:  string | null; // JWT 字串，未登入時可為 null;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);

    

    return (
        <AuthContext.Provider value={{ token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};
