import PropTypes from "prop-types";
import styled, { css, keyframes } from "styled-components";

const hudPulse = keyframes`
  0%, 100% { box-shadow: 0 0 8px var(--glow-color); }
  50%       { box-shadow: 0 0 20px var(--glow-color), 0 0 35px var(--glow-color); }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: clamp(36px, 5vw, 44px);
  border-radius: 8px;
  padding: ${({ px }) => px || "16px"};
  cursor: pointer;
  transition:
    transform 0.3s ease,
    background 0.3s ease,
    border-color 0.3s ease,
    filter 0.3s ease,
    opacity 0.3s ease;
  font-weight: 500;
  font-family: inherit;
  font-size: clamp(11px, 1.8vw, 14px);
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  color: var(--color-light);

  &:hover:not(:disabled) {
    background: var(--glass-border);
    border-color: var(--accent-color);
    box-shadow: 0 0 10px var(--glow-color);
    transform: translateY(-2px);
    animation: ${hudPulse} 1.2s ease-in-out infinite;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
    border-color: var(--accent-color);
    background: rgba(255, 255, 255, 0.05);
  }

  ${({ isPrimary }) =>
    isPrimary &&
    css`
      background: var(--accent-color);
      color: #000;
      border: none;
      &:hover:not(:disabled) {
        background: var(--accent-color);
        filter: brightness(1.2);
        animation: none;
      }
    `}
`;

const FancyButton = ({
  className,
  onClick,
  children,
  px,
  isPrimary,
  disabled,
  ariaLabel,
}) => {
  return (
    <Button
      className={className}
      onClick={onClick}
      px={px}
      isPrimary={isPrimary}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </Button>
  );
};

FancyButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  px: PropTypes.string,
  isPrimary: PropTypes.bool,
  disabled: PropTypes.bool,
  ariaLabel: PropTypes.string,
};

export default FancyButton;
