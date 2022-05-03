import React from 'react'
import styled from 'styled-components'
import { LinkProps, Text } from 'uikit'

const StyledLink = styled(Text)<any>`
  align-items: center;
  &:hover {
    text-decoration: underline;
  }
`

const ItemLink: React.FC<LinkProps> = ({ ...props }) => {
  return <StyledLink as="a" bold {...props} />
}

ItemLink.defaultProps = {
  color: 'primary',
}

export default ItemLink
