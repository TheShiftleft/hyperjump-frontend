import styled from "styled-components";
import { space, SpaceProps } from "styled-system";

export type CardBodyProps = SpaceProps;

const CardBody = styled.div<CardBodyProps>`
  padding: 0 12px 12px 12px;
  ${space}
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 0 24px 24px 24px;
  }
`;

export default CardBody;
