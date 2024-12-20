import { useRef, useEffect, useCallback, useState } from "react";
import styled, { keyframes } from "styled-components";
import PropTypes from "prop-types";

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
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  transform-style: preserve-3d;
  animation: ${rotateCube} ${({ rotationSpeed }) => rotationSpeed}s linear
    infinite;
  transition: box-shadow 1s ease-in-out;

  ${({ theme }) => `
    &:hover {
      box-shadow: ${
        theme === "default"
          ? "0 0 20px rgba(255, 255, 255, 0.5)"
          : "0 0 70px rgba(255, 255, 255, 0.9)"
      };
    }
  `}
`;

const Face = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.9;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: ${({ gradient }) => gradient};
  backface-visibility: hidden;

  transform: ${({ transform }) => transform};
`;

const RotatingCubeStyled = ({
  changAtmosphere,
  theme,
  size,
  rotationSpeed,
  gradients,
}) => {
  const cubeRef = useRef(null);
  const animationFrameId = useRef(null);
  const [angle, setAngle] = useState({ x: 0, y: 0 });

  const animate = useCallback(() => {
    setAngle((prevAngle) => ({
      x: prevAngle.x + 0.1,
      y: prevAngle.y + 0.15,
    }));
    animationFrameId.current = requestAnimationFrame(animate);
  }, []);

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

  return (
    <Main onClick={changAtmosphere}>
      <CubeWrapper
        ref={cubeRef}
        theme={theme}
        size={size}
        rotationSpeed={rotationSpeed}
      >
        {gradients.map((gradient, index) => (
          <Face
            key={index}
            transform={
              [
                "translateZ(50px)",
                "translateZ(-50px)",
                "translateX(-50px) rotateY(90deg)",
                "translateX(50px) rotateY(90deg)",
                "translateY(-50px) rotateX(90deg)",
                "translateY(50px) rotateX(90deg)",
              ][index]
            }
            gradient={gradient}
          />
        ))}
      </CubeWrapper>
    </Main>
  );
};

RotatingCubeStyled.propTypes = {
  changAtmosphere: PropTypes.func.isRequired,
  theme: PropTypes.string,
  size: PropTypes.number,
  rotationSpeed: PropTypes.number,
  gradients: PropTypes.arrayOf(PropTypes.string),
};

RotatingCubeStyled.defaultProps = {
  theme: "default",
  size: 100,
  rotationSpeed: 10,
  gradients: [
    "linear-gradient(to bottom, #ff7e5f, #feb47b)", // Front
    "linear-gradient(to bottom, #43cea2, #185a9d)", // Back
    "linear-gradient(to bottom, #36d1dc, #5b86e5)", // Left
    "linear-gradient(to bottom, #c33764, #1d2671)", // Right
    "linear-gradient(to bottom, #ffafbd, #ffc3a0)", // Top
    "linear-gradient(to bottom, #c79081, #dfa579)", // Bottom
  ],
};

export default RotatingCubeStyled;
