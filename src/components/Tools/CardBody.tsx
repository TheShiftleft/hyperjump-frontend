import styled from "styled-components";
import { space, SpaceProps } from "styled-system";

export type CardBodyProps = SpaceProps;

const CardBody = styled.div<CardBodyProps>`
  ${space}
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 24px;
  }
`;

CardBody.defaultProps = {
  p: "12px",
};

export default CardBody;
