import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-1 rounded border dark:border-gray-600"
    >
      {theme === "light" ? "🌙 Dark" : "☀ Light"}
    </button>
  );
}

export default ThemeToggle;