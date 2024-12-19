import PropTypes from "prop-types";
import styled, { css } from "styled-components";

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  border-radius: 50px;
  padding: ${({ px }) => px || "20px"};
  cursor: pointer;
  transition: all 0.3s ease;

  ${({ white }) =>
    white
      ? css`
          color: #ffffff;
          background: linear-gradient(45deg, #ff00ff, #174dc5);
        `
      : css`
          color: #000000;
          background: linear-gradient(45deg, #dc2d62, #ff4500);
        `}

  ${({ variant }) =>
    variant === "outline" &&
    css`
      background: none;
      border: 2px solid #ff00ff;
      &:hover {
        border-color: #dc2d62;
      }
    `}

  &:hover {
    transform: scale(1.05);
    filter: brightness(1.1);
  }
`;

const FancyButton = ({
  className,
  href,
  onClick,
  children,
  px,
  white,
  variant,
  ariaLabel,
}) => {
  const renderContent = () => <span>{children}</span>;

  return href ? (
    <a href={href} aria-label={ariaLabel}>
      <Button
        className={className}
        onClick={onClick}
        px={px}
        white={white}
        variant={variant}
      >
        {renderContent()}
      </Button>
    </a>
  ) : (
    <Button
      className={className}
      onClick={onClick}
      px={px}
      white={white}
      variant={variant}
      aria-label={ariaLabel}
    >
      {renderContent()}
    </Button>
  );
};

FancyButton.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  px: PropTypes.string,
  white: PropTypes.bool,
  variant: PropTypes.oneOf(["solid", "outline"]),
  ariaLabel: PropTypes.string,
};

export default FancyButton;
