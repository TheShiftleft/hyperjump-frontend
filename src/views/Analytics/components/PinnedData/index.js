/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { Bookmark, ChevronRight, X } from 'react-feather'
import { RowBetween, RowFixed } from '../../../../components/Row'
import { AutoColumn } from '../../../../components/Column'
import { TYPE, Hover } from '..'
import { useSavedTokens, useSavedPairs } from '../../../../contexts/Analytics/LocalStorage'
import TokenLogo from '../TokenLogo'
import AccountSearch from '../AccountSearch'
import { ButtonFaded } from '../ButtonStyled'
import FormattedName from '../FormattedName'

const RightColumn = styled.div`
  position: fixed;
  right: 0;
  top: 0px;
  height: 100vh;
  width: ${({ open }) => (open ? '160px' : '23px')};
  padding: 1.25rem;
  border-left: 1px solid #44c4e2;
  background-color: ${({ theme }) => theme.colors.bg1};
  z-index: 9999;
  overflow: scroll;
  :hover {
    cursor: pointer;
  }
`

const SavedButton = styled(RowBetween)`
  padding-bottom: ${({ open }) => open && '20px'};
  border-bottom: ${({ theme, open }) => open && `1px solid ${theme.colors.bg3}`};
  margin-bottom: ${({ open }) => open && '1.25rem'};

  :hover {
    cursor: pointer;
  }
`

const ScrollableDiv = styled(AutoColumn)`
  overflow: hidden;
  padding-bottom: 60px;
`

const StyledIcon = styled.div`
  color: #44c4e2;
`

function PinnedData({ history, open, setSavedOpen }) {
  const [savedPairs, , removePair] = useSavedPairs()
  const [savedTokens, , removeToken] = useSavedTokens()

  return !open ? (
    <RightColumn open={open} onClick={() => setSavedOpen(true)}>
      <SavedButton open={open}>
        <StyledIcon>
          <Bookmark size={20} />
        </StyledIcon>
      </SavedButton>
    </RightColumn>
  ) : (
    <RightColumn gap="1rem" open={open}>
      <SavedButton onClick={() => setSavedOpen(false)} open={open}>
        <RowFixed>
          <StyledIcon>
            <Bookmark size={16} />
          </StyledIcon>
          <TYPE.main ml='4px'>Saved</TYPE.main>
        </RowFixed>
        <StyledIcon>
          <ChevronRight />
        </StyledIcon>
      </SavedButton>
      <AccountSearch small  />
      <AutoColumn gap="40px" style={{ marginTop: '2rem' }}>
        <AutoColumn gap='12px'>
          <TYPE.main>Pinned Pairs</TYPE.main>
          {Object.keys(savedPairs).filter(key => {
            return !!savedPairs[key]
          }).length > 0 ? (
            Object.keys(savedPairs)
              .filter(address => {
                return !!savedPairs[address]
              })
              .map(address => {
                const pair = savedPairs[address]
                return (
                  <RowBetween key={pair.address}>
                    <ButtonFaded onClick={() => history.push(`/analytics/pair/${address}`)}>
                      <RowFixed>
                        <TYPE.header>
                          <FormattedName
                            text={`${pair.token0Symbol}/${pair.token1Symbol}`}
                            maxCharacters={12}
                            fontSize='12px'
                          />
                        </TYPE.header>
                      </RowFixed>
                    </ButtonFaded>
                    <Hover onClick={() => removePair(pair.address)}>
                      <StyledIcon>
                        <X size={16} />
                      </StyledIcon>
                    </Hover>
                  </RowBetween>
                )
              })
          ) : (
            <TYPE.light>Pinned pairs will appear here.</TYPE.light>
          )}
        </AutoColumn>
        <ScrollableDiv gap='12px'>
          <TYPE.main>Pinned Tokens</TYPE.main>
          {Object.keys(savedTokens).filter(key => {
            return !!savedTokens[key]
          }).length > 0 ? (
            Object.keys(savedTokens)
              .filter(address => {
                return !!savedTokens[address]
              })
              .map(address => {
                const token = savedTokens[address]
                return (
                  <RowBetween key={address}>
                    <ButtonFaded onClick={() => history.push(`/analytics/token/${address}`)}>
                      <RowFixed>
                        <TokenLogo address={address} size='14px' />
                        <TYPE.header ml='6px'>
                          <FormattedName text={token.symbol} maxCharacters={12} fontSize='12px' />
                        </TYPE.header>
                      </RowFixed>
                    </ButtonFaded>
                    <Hover onClick={() => removeToken(address)}>
                      <StyledIcon>
                        <X size={16} />
                      </StyledIcon>
                    </Hover>
                  </RowBetween>
                )
              })
          ) : (
            <TYPE.light>Pinned tokens will appear here.</TYPE.light>
          )}
        </ScrollableDiv>
      </AutoColumn>
    </RightColumn>
  )
}

export default withRouter(PinnedData)
