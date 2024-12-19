import styled from "styled-components";

const StyledButton = styled.button`
  position: fixed;
  top: 2rem;
  right: 50%;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  z-index: 1;
  background-image: radial-gradient(
    circle,
    rgba(248, 183, 5, 1),
    rgba(253, 187, 45, 0.8) 50%,
    rgba(253, 187, 45, 0.9) 100%
  );
  color: #fdbb2d;
  border: 1px solid #fdbb2d;
  padding: 0.5rem;
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  transition: transform 0.3s, background-color 0.3s, filter 0.3s;
  opacity: 0.8;

  &:hover {
    transform: scale(1.1);
    font-size: 100%;
    background-image: radial-gradient(
      circle,
      rgba(248, 183, 5, 0.9),
      rgba(213, 156, 2, 0.7) 50%,
      rgba(253, 199, 51, 0.5) 100%
    );
    backdrop-filter: blur(10px);
    filter: brightness(1.2);
  }

  &:active {
    transform: scale(0.9);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
`;

const FloatingButton = ({ onClick }) => {
  return <StyledButton onClick={onClick}>⬤</StyledButton>;
};

export default FloatingButton;
