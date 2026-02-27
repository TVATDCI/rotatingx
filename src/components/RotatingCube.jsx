import { useRef, useEffect, useCallback, useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import "./RotatingCube.css";

const RotatingCube = ({ changeAtmosphere }) => {
  const cubeRef = useRef(null);
  const animationFrameId = useRef(null);
  const [rotationSpeed, setRotationSpeed] = useState({ x: 0.1, y: 0.15 });
  const [angle, setAngle] = useState({ x: 0, y: 0 });

  const animate = useCallback(() => {
    setAngle((prevAngle) => ({
      x: prevAngle.x + rotationSpeed.x,
      y: prevAngle.y + rotationSpeed.y,
    }));
    animationFrameId.current = requestAnimationFrame(animate);
  }, [rotationSpeed]);

  useEffect(() => {
    animate();
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [animate]);

  useEffect(() => {
    const cube = cubeRef.current;
    if (cube) {
      cube.style.transform = `rotateX(${angle.x}deg) rotateY(${angle.y}deg)`;
    }
  }, [angle]);

  const handleMouseMove = (e) => {
    setRotationSpeed({
      x: (e.clientY / window.innerHeight - 0.5) * 1.5,
      y: (e.clientX / window.innerWidth - 0.5) * 1.5,
    });
  };

  return (
    <main onMouseMove={handleMouseMove} onClick={changeAtmosphere}>
      <div className="rotating-cube" ref={cubeRef}>
        <div className="face front"></div>
        <div className="face back"></div>
        <div className="face left"></div>
        <div className="face right"></div>
        <div className="face top"></div>
        <div className="face bottom"></div>
      </div>
    </main>
  );
};

// Define PropTypes for RotatingCube
RotatingCube.propTypes = {
  changeAtmosphere: PropTypes.func.isRequired, // Ensure changeAtmosphere is a required function
};

export default RotatingCube;

{
  /*
#### PropTypes:

- to ensure the changAtmosphere prop is passed correctly and is of the expected type.

**Key Changes**

- 1. Importing PropTypes: Added `import PropTypes from "prop-types";`.
- 2. Defining PropTypes:
  - The changAtmosphere prop is defined as a required function using.
  - `PropTypes.func.isRequired`.

**Why Use PropTypes?**

- It helps catch bugs by validating props passed to the component.
- Ensures your code is easier to maintain and debug in the future.
 
  
  */
}
