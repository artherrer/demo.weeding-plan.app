import { useEffect, useState } from "react";
import AsignacionPage from "./components/AsignacionPage";
import AsignacionSearchPage from "./components/AsignacionSearchPage";
import HomePage from "./components/HomePage";
import InvitationPage from "./components/InvitationPage";

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const invitacionMatch = currentPath.match(/^\/invitacion\/(.+)$/);

  if (invitacionMatch) {
    const codigo = invitacionMatch[1];
    return <InvitationPage codigo={codigo} />;
  }

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
