import React, { useRef, useEffect, useCallback, useState } from "react";
import styled, { keyframes } from "styled-components";

const rotateCube = keyframes`
  0% {
    transform: rotateX(0) rotateY(0);
  }
  100% {
    transform: rotateX(360deg) rotateY(360deg);
  }
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  min-width: 320px;
  min-height: 100vh;
`;

const CubeWrapper = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  transform-style: preserve-3d;
  animation: ${rotateCube} 10s linear infinite;
  transition: box-shadow 1s ease-in-out;

  /* Glow effects based on the atmosphere (props.theme) */
  ${({ theme }) => `
    &:hover {
      box-shadow: ${
        theme === "default"
          ? "0 0 20px rgba(255, 255, 255, 0.5)"
          : theme === "space"
          ? "0 0 40px rgba(0, 188, 255, 0.8)"
          : theme === "nebula"
          ? "0 0 50px rgba(136, 43, 226, 0.8)"
          : theme === "galaxy"
          ? "0 0 60px rgba(255, 105, 180, 0.8)"
          : "0 0 70px rgba(255, 255, 255, 0.9)"
      };
    }
  `}
`;

const Face = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.2;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  backface-visibility: hidden;
  background-color: ${({ color }) => color};

  ${({ transform }) => transform};
`;

const RotatingCube = () => {
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
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
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
    <Main onMouseMove={handleMouseMove}>
      <CubeWrapper ref={cubeRef} theme="nebula">
        <Face transform="translateZ(100px)" color="#007bff" />
        <Face transform="translateZ(-100px) rotateY(180deg)" color="#ff4500" />
        <Face transform="translateX(-100px) rotateY(-90deg)" color="#90ee90" />
        <Face transform="translateX(100px) rotateY(-90deg)" color="#ff8c00" />
        <Face transform="translateY(-100px) rotateX(-90deg)" color="#ffd700" />
        <Face transform="translateY(100px) rotateX(90deg)" color="#00fa9a" />
      </CubeWrapper>
    </Main>
  );
};

export default RotatingCube;
