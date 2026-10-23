import { useEffect, useState } from "react";
import AsignacionPage from "./components/AsignacionPage";
import AsignacionSearchPage from "./components/AsignacionSearchPage";
import HomePage from "./components/HomePage";

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const redirigirAInicio = /^\/invitacion\/(.+)$/.test(currentPath);

  useEffect(() => {
    if (redirigirAInicio) window.location.replace("/");
  }, [redirigirAInicio]);

  if (redirigirAInicio) return null;

  const asignacionCodigoMatch = currentPath.match(/^\/asignacion\/(.+)$/);

  if (asignacionCodigoMatch) {
    const codigo = asignacionCodigoMatch[1];
    return <AsignacionPage codigo={codigo} />;
  }

  if (currentPath === "/asignacion" || currentPath === "/asignacion/") {
    return <AsignacionSearchPage />;
  }

  return <HomePage />;
}

export default App;
