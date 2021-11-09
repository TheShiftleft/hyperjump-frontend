import { CardHeader, Flex, Image } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled(CardHeader)<{ isFinished?: boolean; background?: string }>`
  background: none;
  border-radius: ${({ theme }) => `${theme.radii.card} ${theme.radii.card} 0 0`};
`

const StyledCardHeader: React.FC<{
  earningTokenSymbol: string
  isStaking?: boolean
}> = ({ earningTokenSymbol }) => {
  const { t } = useTranslation()

  const getHeadingPrefix = () => {
    return t('Earn')
  }

  interface StyledTitleProps {
    isFinished?: boolean
  }
  
  const CardTitle = styled.div<StyledTitleProps>`
    color: ${({ theme }) => theme.colors.primary };
    opacity: '1' };
    font-family: Oswald;
    font-weight: 600;
    font-size: 24px;
    line-height: 1.1;
    margin-left: 8px;
  `

  return (
    <Wrapper isFinished={false}>
      <Flex alignItems="center" >
        
        <Image src="/images/tokens/mech.png" alt={earningTokenSymbol} width={64} height={64} />
        <Flex flexDirection="column">
          <CardTitle>
            {`${getHeadingPrefix()} ${earningTokenSymbol}`}
          </CardTitle>
        </Flex>
        
      </Flex>
    </Wrapper>
  )
}

export default StyledCardHeader
