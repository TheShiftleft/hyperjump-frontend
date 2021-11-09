import React from 'react'
import Svg from '../../../components/Svg/Svg'
import { SvgProps } from '../../../components/Svg/types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg {...props} width="34" height="34" viewBox="0 0 34 34" fill="hotpink" xmlns="http://www.w3.org/2000/svg">
      <path d="M33.9999 0H0V33.9999H33.9999V0Z" fill="hotpink" />
      <path d="M9.43607 14.7938L7.22986 17L9.43602 19.2062L11.6422 17L9.43607 14.7938Z" fill="#F0B90B" />
      <path
        d="M17 11.642L20.782 15.424L22.988 13.218L17 7.23001L11.012 13.218L13.218 15.424L17 11.642Z"
        fill="#F0B90B"
      />
      <path d="M24.564 14.7938L22.3578 16.9999L24.5639 19.2061L26.7701 17L24.564 14.7938Z" fill="#F0B90B" />
      <path d="M17 22.358L13.218 18.576L11.012 20.782L17 26.77L22.988 20.782L20.782 18.576L17 22.358Z" fill="#F0B90B" />
      <path d="M17 14.7938L14.7939 17L17 19.2061L19.2062 17L17 14.7938Z" fill="#F0B90B" />
    </Svg>
  )
}

export default Icon
