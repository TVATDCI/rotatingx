// version 2
import { useRef, useEffect, useCallback, useState } from "react";
import "./RotatingCube.css";

const RotatingCube = ({ changAtmosphere }) => {
  // add changAtmosphere to the props the component receives
  const cubeRef = useRef(null);
  const animationFrameId = useRef(null);
  const [rotationSpeed, setRotationSpeed] = useState({ x: 0.1, y: 0.15 }); // Speed factor
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
    <main onMouseMove={handleMouseMove} onClick={changAtmosphere}>
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

export default RotatingCube;

{
  /** version 1
  import React, { useRef, useEffect, useCallback } from "react";
import "./RotatingCube.css";

const RotatingCube = () => {
  const cubeRef = useRef(null);
  const animationFrameId = useRef(null);

  const animate = useCallback(() => {
    const cube = cubeRef.current;
    if (cube) {
      cube.style.transform = `rotateX(${Date.now() / 100}deg) rotateY(${Date.now() / 150}deg)`;
      animationFrameId.current = requestAnimationFrame(animate);
    }
  }, []);

  useEffect(() => {
    animate();
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [animate]);

  return (
    <main>
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

export default RotatingCube;
*/
}
