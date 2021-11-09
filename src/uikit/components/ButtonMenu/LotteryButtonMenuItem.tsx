import React from "react";
import styled from "styled-components";
import Button from "../Button/Button";
import StyledButton from "../Button/StyledButton";
import { BaseButtonProps, PolymorphicComponent, variants } from "../Button/types";
import { ButtonMenuItemProps } from "./types";

interface InactiveButtonProps extends BaseButtonProps {
  forwardedAs: BaseButtonProps["as"];
}

const CustomButton = styled(StyledButton)`
  border-radius: 0;
  background-color: transparent;
  min-width: 135px;
  padding: 10px;
  color: #44c4e2;
  font-size: 24px;
  font-weight: 400;
  font-family: 'Bebas Neue', cursive;
  margin: 0;
`

const InactiveButton: PolymorphicComponent<InactiveButtonProps, "button"> = styled(CustomButton)<InactiveButtonProps>`
  background-color: transparent;
  color: white;
  border: 
  &:hover:not(:disabled):not(:active) {
    background-color: transparent;
  }
`;

const LotteryButtonMenuItem: PolymorphicComponent<ButtonMenuItemProps, "button"> = ({
  isActive = false,
  variant = variants.PRIMARY,
  as,
  ...props
}: ButtonMenuItemProps) => {
  if (!isActive) {
    return <InactiveButton forwardedAs={as} {...props} />;
  }

  return <CustomButton as={as} {...props} />;
};

export default LotteryButtonMenuItem;
