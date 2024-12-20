import { useState } from "react";
import RotatingCube from "./components/RotatingCube";
import FloatingButton from "./components/FloatingButton";
import FancyButton from "./components/FancyButton";

function App() {
  const [background, setBackground] = useState("starfield"); // is set as the lading background. It starts from there.

  const changeAtmosphere = () => {
    const atmospheres = [
      "space",
      "nebula",
      "galaxy",
      "starfield",
      "snowy-mountains",
      "sunset-beach",
      "amazon-forest",
      "volcano",
      "desert",
      "underwater",
      "white-diamond",
      "default", // The original background
    ];
    const randomAtmosphere =
      atmospheres[Math.floor(Math.random() * atmospheres.length)];
    setBackground(randomAtmosphere);
  };

  return (
    <div className={`app ${background}`}>
      <RotatingCube changAtmosphere={changeAtmosphere} />
    </div>
  );
}

export default App;
