import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { isAddress } from '../../../../utils/analytics'
import PlaceHolder from '../../assets/placeholder.png'
import EthereumLogo from '../../assets/bnb.svg'

const BAD_IMAGES = {}

const Inline = styled.div`
  display: flex;
  flex: ${({ size }) => `0 0 ${size}`};
  align-items: center;
  justify-content: center;
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  background-color: rgba(33,33,33,0.5);
  border-radius: 50%;
`

const Image = styled.img`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  background-color: rgba(33,33,33,0.5);
  border-radius: 50%;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
`

const StyledEthereumLogo = styled.div`
  display: flex;
  flex: ${({ size }) => `0 0 ${size}`};
  align-items: center;
  justify-content: center;
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
  > img {
    width: ${({ size }) => size};
    height: ${({ size }) => size};
    border-radius: 50%;
  }
`

export default function TokenLogo({ address, header = false, size = '24px', ...rest }) {
  const [error, setError] = useState(false)

  useEffect(() => {
    setError(false)
  }, [address])

  if (error || BAD_IMAGES[address]) {
    return (
      <Inline size={size} {...rest}>
        <Image alt='' src={PlaceHolder} size={size} />
      </Inline>
    )
  }

  if (address?.toLowerCase() === '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c') {
    return (
      <StyledEthereumLogo size={size} {...rest}>
        <img
          src={EthereumLogo}
          style={{ boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.075)', borderRadius: '24px' }}
          alt=""
        />
      </StyledEthereumLogo>
    )
  }

  const path = `https://tokens.thugs.fi/images/${isAddress(
    address
  )}.png`

  return (
    <Inline size={size} {...rest}>
      <Image
        alt=''
        src={path}
        size={size}
        onError={event => {
          BAD_IMAGES[address] = true
          setError(true)
          event.preventDefault()
        }}
      />
    </Inline>
  )
}
