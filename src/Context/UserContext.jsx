import React, { createContext, useState, useContext, useEffect } from 'react';

// Crear el contexto
export const UserContext = createContext();

// Proveedor del contexto
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Recupera el usuario desde localStorage si existe
    const savedUser = localStorage.getItem('user');
    
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    // Sincronizar el usuario con localStorage
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout}}>
      {children}
    </UserContext.Provider>
  );
};

// Hook para usar el contexto fácilmente
export const useUser = () => useContext(UserContext);