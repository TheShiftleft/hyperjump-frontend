import React from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { SvgProps } from "../../../components/Svg";
import * as IconModule from "../icons";
import Accordion from "./Accordion";
import DropdownItem from "./DropdownItem";
import { MenuEntry, LinkLabel, LinkStatus } from "./MenuEntry";
import MenuLink from "./MenuLink";
import { PanelProps, PushedProps } from "../types";
import { Dropdown } from "../../../components/Dropdown";

interface Props extends PanelProps, PushedProps {
  isMobile: boolean;
}

const Icons = IconModule as unknown as { [key: string]: React.FC<SvgProps> };

const Container = styled.div`
  display: inline-flex;
  flex-direction: row;
  height: auto;
  width: 100%;
`;

const HorizontalPanelBody: React.FC<Props> = ({ isPushed, pushNav, isMobile, links }) => {
  const location = useLocation();

  // Close the menu when a user clicks a link on mobile
  const handleClick = isMobile ? () => pushNav(false) : undefined;

  return (
    <Container>
      {links.map((entry) => {
        const Icon = Icons[entry.icon];
        const iconElement = <Icon width="24px" mr="8px" />;
        const calloutClass = entry.calloutClass ? entry.calloutClass : undefined;

        if (entry.items) {
          const itemsMatchIndex = entry.items.findIndex((item) => item.href === location.pathname);
          const initialOpenState = entry.initialOpenState === true ? entry.initialOpenState : itemsMatchIndex >= 0;

          return (
            <Dropdown target={
              <DropdownItem
                key={entry.label}
                isPushed={isPushed}
                pushNav={pushNav}
                icon={iconElement}
                label={entry.label}
                status={entry.status}
                initialOpenState={initialOpenState}
                className={calloutClass}
                isActive={entry.items.some((item) => item.href === location.pathname)}
                href={entry.items.length > 0 ? entry.items[0].href : undefined}
                isMobile={isMobile}
              >
                {isPushed &&
                  entry.items.map((item) => (
                    <MenuEntry key={item.href} secondary isActive={item.href === location.pathname} onClick={handleClick}>
                      <MenuLink href={item.href}>
                        <LinkLabel isPushed={isPushed}>{item.label}</LinkLabel>
                        {item.status && (
                          <LinkStatus color={item.status.color} fontSize="14px">
                            {item.status.text}
                          </LinkStatus>
                        )}
                      </MenuLink>
                    </MenuEntry>
                  ))}
              </DropdownItem>
            } position={(isMobile ? "top" : "bottom")} >
              {entry.items.map((item) => (
                  <MenuEntry key={item.href} secondary isActive={item.href === location.pathname} onClick={handleClick}>
                    <MenuLink target={item.target} rel="noreferrer noopener" href={item.href}>
                      <LinkLabel isPushed={isPushed}>{item.label}</LinkLabel>
                      {item.status && (
                        <LinkStatus color={item.status.color} fontSize="14px">
                          {item.status.text}
                        </LinkStatus>
                      )}
                    </MenuLink>
                  </MenuEntry>
                ))}
            </Dropdown>
          );
        }
        return (
          <MenuEntry key={entry.label} isActive={entry.href === location.pathname} className={calloutClass} isMobile={isMobile}>
            <MenuLink href={entry.href} onClick={handleClick}>
              {iconElement}
              <LinkLabel isPushed={isPushed}>{entry.label}</LinkLabel>
              {entry.status && (
                <LinkStatus color={entry.status.color} fontSize="14px">
                  {entry.status.text}
                </LinkStatus>
              )}
            </MenuLink>
          </MenuEntry>
        );
      })}
    </Container>
  );
};

export default HorizontalPanelBody;
