import React, { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('sentinelUser');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      sessionStorage.setItem('sentinelUser', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('sentinelUser');
    }
  }, [user]);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
