import { useState } from "react";
import RotatingCube from "./components/RotatingCube";
import FloatingButton from "./components/FloatingButton";
import FancyButton from "./components/FancyButton";

function App() {
  const [background, setBackground] = useState("starfield");

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
      <FloatingButton onClick={changeAtmosphere} />
      <RotatingCube />
      <FancyButton />
    </div>
  );
}

export default App;
