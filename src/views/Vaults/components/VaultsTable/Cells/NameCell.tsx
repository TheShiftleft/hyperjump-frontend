import { Image, Text, useMatchBreakpoints } from 'uikit'
import React from 'react'
import { Vault } from 'state/types'
import styled from 'styled-components'
import BaseCell, { CellContent } from './BaseCell'

interface NameCellProps {
  vault: Vault
}

const StyledCell = styled(BaseCell)`
  flex-direction: row;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 200px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    width: 270px;
  }
`

const NameCell: React.FC<NameCellProps> = ({ vault }) => {
  const { isXs, isSm, isMd } = useMatchBreakpoints()
  const { logo, name, platform } = vault

  const titleFontSize = isXs || isSm ? "14px" : "18px"
  const subFontSize = isXs || isSm ? "12px" : "14px"
  const titleMarginLeft = isXs || isSm ? "0" : "6px"
  return (
    <StyledCell role="cell">
      <Image src={`/images/vaults/${logo}`} alt="icon" width={40} height={40} mr="4px" />
      <CellContent ml={titleMarginLeft}>
        <Text bold={!isXs && !isSm} fontSize={titleFontSize}>
          {name}
        </Text>
        <Text fontSize={subFontSize} color="textSubtle">
          {`Uses: ${platform}`}
        </Text>
      </CellContent>
    </StyledCell>
  )
}

export default NameCell
