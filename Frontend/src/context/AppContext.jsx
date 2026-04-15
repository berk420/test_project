import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mtrv_user") || "null"); } catch { return null; }
  });
  const [compareList, setCompareList] = useState([]);
  const [onboardingData, setOnboardingData] = useState(null);

  useEffect(() => {
    if (user) localStorage.setItem("mtrv_user", JSON.stringify(user));
    else localStorage.removeItem("mtrv_user");
  }, [user]);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  const addToCompare = (clinic) => {
    setCompareList((prev) => {
      if (prev.find((c) => c.id === clinic.id)) return prev;
      if (prev.length >= 3) return prev;
      return [...prev, clinic];
    });
  };
  const removeFromCompare = (id) => setCompareList((prev) => prev.filter((c) => c.id !== id));
  const clearCompare = () => setCompareList([]);

  return (
    <AppContext.Provider value={{ user, login, logout, compareList, addToCompare, removeFromCompare, clearCompare, onboardingData, setOnboardingData }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
