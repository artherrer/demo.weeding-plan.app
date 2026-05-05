import { useEffect, useState } from "react";
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

  return <HomePage />;
}

export default App;
