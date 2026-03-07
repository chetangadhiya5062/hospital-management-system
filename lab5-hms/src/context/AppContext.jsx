import { createContext, useState, useEffect } from "react";
import API from "../services/api";

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);

  // 🔁 AUTO LOGIN CHECK
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await API.get("/auth/me");
        setUser({ id: res.data.id, role: res.data.role });
      } catch (err) {
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  // ✅ LOGIN (returns role)
  const login = async (data) => {
    const res = await API.post("/auth/login", data);

    const role = res.data.role;

    setUser({ role });

    return role; // ✅ important
  };

  return (
    <AppContext.Provider value={{ user, login }}>
      {children}
    </AppContext.Provider>
  );
}