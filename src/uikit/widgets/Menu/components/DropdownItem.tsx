import React, { ReactNode, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { MENU_ENTRY_HEIGHT } from "../config";
import { LinkLabel, LinkStatus as LinkStatusComponent, MenuEntry } from "./MenuEntry";
import { LinkStatus, PushedProps } from "../types";
import { ArrowDropDownIcon, ArrowDropUpIcon } from "../../../components/Svg";

interface Props extends PushedProps {
  label: string;
  status?: LinkStatus;
  icon: React.ReactElement;
  initialOpenState?: boolean;
  className?: string;
  children: ReactNode;
  isActive?: boolean;
  href?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  // Safari fix
  flex-shrink: 0;
`;


const DropdownItem: React.FC<Props> = ({
  label,
  status,
  icon,
  isPushed,
  pushNav,
  initialOpenState = false,
  children,
  className,
  isActive,
  href
}) => {
  const [isOpen, setIsOpen] = useState(initialOpenState);
  const history = useHistory();
  const handleClick = () => {
    if (isPushed) {
      setIsOpen((prevState) => !prevState);
      if (href && href.indexOf('http')===-1) history.push(href);
    } else {
      pushNav(true);
      setIsOpen(true);
    }
  };

  return (
    <Container>
      <MenuEntry onClick={handleClick} className={className} isActive={isActive} role="button">
        {icon}
        <LinkLabel isPushed={isPushed}>{label}</LinkLabel>
        {status && (
          <LinkStatusComponent color={status.color} fontSize="14px">
            {status.text}
          </LinkStatusComponent>
        )}
      </MenuEntry>
    </Container>
  );
};

export default DropdownItem;
