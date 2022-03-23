import { CardHeader, Flex, Heading, Image, Text, LinkExternal, IconButton } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled(CardHeader)<{ isFinished?: boolean; background?: string }>`
  background: none;
  border-radius: ${({ theme }) => `${theme.radii.card} ${theme.radii.card} 0 0`};
`

interface StyledTitleProps {
  isFinished?: boolean
}

const CardTitle = styled.div<StyledTitleProps>`
  color: ${({ theme }) => theme.colors.primary};
  opacity: ${({ isFinished }) => (isFinished ? '0.5' : '1')};
  font-family: Oswald;
  font-weight: 600;
  font-size: 24px;
  line-height: 1.1;
  margin-left: 8px;
`

const StyledCardHeader: React.FC<{
  tokenLink: string
  earningTokenSymbol: string
  earningTokenImg: string
  stakingTokenSymbol: string
  isAutoVault?: boolean
  isFinished?: boolean
  isStaking?: boolean
}> = ({
  tokenLink,
  earningTokenSymbol,
  stakingTokenSymbol,
  earningTokenImg,
  isFinished = false,
  isAutoVault = false,
  isStaking = false,
}) => {
  const { t } = useTranslation()
  const iconFile = `${earningTokenImg}`.toLocaleLowerCase()
  const background = isStaking ? 'background' : 'backgroundAlt'

  const getHeadingPrefix = () => {
    // all other pools
    return t('') //  PCS was t('Earn') angry mech
  }

  const getHeadingPostfix = () => {
    // all other pools
    return t('Pool')
  }

  return (
    <Wrapper isFinished={isFinished} background={background}>
      <Flex alignItems="center">
        <Image src={`/images/tokens/${iconFile}`} alt={earningTokenSymbol} width={64} height={64} />
        <CardTitle isFinished={isFinished}>
          {`${getHeadingPrefix()} ${earningTokenSymbol} ${getHeadingPostfix()}`}
        </CardTitle>
        <IconButton variant="text" onClick={() => window.open(tokenLink, '_blank')}>
          <LinkExternal bold={false} />
        </IconButton>
      </Flex>
    </Wrapper>
  )
}

export default StyledCardHeader
