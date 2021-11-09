import React from "react";
import styled from "styled-components";
import SwapButton from "../Button/SwapButton";
import { BaseButtonProps, PolymorphicComponent, variants } from "../Button/types";
import { ButtonMenuItemProps } from "./types";

interface InactiveButtonProps extends BaseButtonProps {
  forwardedAs: BaseButtonProps["as"];
}

const InactiveButton: PolymorphicComponent<InactiveButtonProps, "button"> = styled(SwapButton)<InactiveButtonProps>`
  background-color: transparent;
  color: ${({ theme, variant }) => (variant === variants.PRIMARY ? theme.colors.primary : theme.colors.text)};
  opacity: 0.65;
  &:hover:not(:disabled):not(:active) {
    background-color: transparent;
  }
`;

const SwapButtonMenuItem: PolymorphicComponent<ButtonMenuItemProps, "button"> = ({
  isActive = false,
  variant = variants.SECONDARY,
  as,
  ...props
}: ButtonMenuItemProps) => {
  if (!isActive) {
    return <InactiveButton forwardedAs={as} variant="text" ml="10px" mr="10px" {...props} />;
  }

  return <SwapButton as={as} variant={variant} ml="10px" mr="10px" {...props} />;
};

export default SwapButtonMenuItem;
