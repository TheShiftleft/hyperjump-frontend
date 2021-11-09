import React from 'react'
import styled from 'styled-components'
import { Box } from 'uikit'
import Container from '../layout/Container'

const Outer = styled(Box)<{ background?: string }>`
  background: ${({ background }) => background};
`

const Inner = styled(Container)`
  padding-top: 32px;
  padding-bottom: 0px;
`

const PageHeader: React.FC<{ background?: string }> = ({ background, children, ...props }) => (
  <Outer background={background} {...props}>
    <Inner>{children}</Inner>
  </Outer>
)

export default PageHeader
