import { useState } from "react";
import RotatingCube from "./components/RotatingCube";
import MiniPlayer from "./components/MiniPlayer";

function App() {
  const [background, setBackground] = useState("moon-surface"); // is set as the lading background. It starts from there.

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
      "moon-surface",
    ];
    const randomAtmosphere =
      atmospheres[Math.floor(Math.random() * atmospheres.length)];
    setBackground(randomAtmosphere);
  };

  return (
    <div className={`app ${background}`}>
      <MiniPlayer />
      <RotatingCube changAtmosphere={changeAtmosphere} />
    </div>
  );
}

export default App;

{
  /*
  **How it works**

Prop Passing: The `App.jsx` component defines the `changeAtmosphere` function and passes it as a prop to the `RotatingCube` component.

User Interaction: When the user clicks on the cube (the main element in `RotatingCube`), the `onClick` event is triggered.

Function Call: The `onClick` event handler calls the `changeAtmosphere` function passed from `App.jsx`.

Random Atmosphere Selection:

The `changeAtmosphere` function defines a list of atmosphere names in an array called `atmospheres`.
A random atmosphere is selected using this formula:

```javascript
atmospheres[Math.floor(Math.random() * atmospheres.length)];
```

State Update: The selected atmosphere is set as the new state of background using setBackground(randomAtmosphere).

Dynamic Styling: The background state is used as a class name for the root <div> in the App component (<div className={app ${background}}>), changing the background dynamically to match the selected atmosphere.

This ensures a seamless interaction where clicking the cube triggers the background to change randomly to one of the predefined options.
   */
}
