import React, { cloneElement, Children, ReactElement } from "react";
import styled, { DefaultTheme } from "styled-components";
import { space } from "styled-system";
import { scales, variants } from "../Button/types";
import { ButtonMenuProps } from "./types";

interface StyledButtonMenuProps extends ButtonMenuProps {
  theme: DefaultTheme;
}

const getBackgroundColor = ({ theme, variant }: StyledButtonMenuProps) => {
  return theme.colors[variant === variants.SUBTLE ? "input" : "tertiary"];
};

const getBorderColor = ({ theme, variant }: StyledButtonMenuProps) => {
  return theme.colors[variant === variants.SUBTLE ? "inputSecondary" : "disabled"];
};

const StyledButtonMenu = styled.div<StyledButtonMenuProps>`
  background-color: rgba(2,5,11,0.5);
  padding: 0 10px;
  border-radius: 28px;
  display: inline-flex;

  & button:first-child {
    border-right: 2px solid black;
  }
  
  & button:last-child {
    border-left: 2px solid black;
  }


  ${space}
`;

const LotteryButtonMenu: React.FC<ButtonMenuProps> = ({
  activeIndex = 0,
  scale = scales.MD,
  variant = variants.PRIMARY,
  onItemClick,
  children,
  ...props
}) => {
  return (
    <StyledButtonMenu variant={variant} {...props}>
      {Children.map(children, (child: ReactElement, index) => {
        return cloneElement(child, {
          isActive: activeIndex === index,
          onClick: onItemClick ? () => onItemClick(index) : undefined,
          scale,
          variant,
        });
      })}
    </StyledButtonMenu>
  );
};

export default LotteryButtonMenu;
