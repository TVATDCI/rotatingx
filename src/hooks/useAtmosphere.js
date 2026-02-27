import { useState, useCallback } from "react";

const ATMOSPHERES = [
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

export const useAtmosphere = (initialAtmosphere = "galaxy") => {
  const [background, setBackground] = useState(initialAtmosphere);

  const changeAtmosphere = useCallback(() => {
    const randomAtmosphere =
      ATMOSPHERES[Math.floor(Math.random() * ATMOSPHERES.length)];
    setBackground(randomAtmosphere);
  }, []);

  return { background, changeAtmosphere, atmospheres: ATMOSPHERES };
};
