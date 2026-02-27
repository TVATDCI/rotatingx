import PropTypes from "prop-types";
import styled, { css } from "styled-components";

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  border-radius: 8px;
  padding: ${({ px }) => px || "16px"};
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  font-family: inherit;
  font-size: 14px;
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  color: var(--color-light);

  &:hover:not(:disabled) {
    background: var(--glass-border);
    border-color: var(--accent-color);
    box-shadow: 0 0 10px var(--glow-color);
    transform: translateY(-2px);
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
