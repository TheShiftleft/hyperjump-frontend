import React from 'react'
import Svg from '../../../components/Svg/Svg'
import { SvgProps } from '../../../components/Svg/types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 20 20" {...props}>
      <path
        d="M9.16669 0C4.19469 0 0.166687 4.028 0.166687 9C0.166687 13.972 4.19469 18 9.16669 18C14.1387 18 18.1667 13.972 18.1667 9C18.1667 4.028 14.1387 0 9.16669 0ZM13.5867 6.166L12.1097 13.126C12.0007 13.62 11.7067 13.739 11.2967 13.507L9.04669 11.849L7.96169 12.894C7.84169 13.014 7.74069 13.115 7.50769 13.115L7.66769 10.825L11.8377 7.058C12.0187 6.898 11.7977 6.808 11.5587 6.967L6.40569 10.211L4.18369 9.519C3.70169 9.367 3.69069 9.036 4.28569 8.804L12.9627 5.458C13.3657 5.313 13.7177 5.556 13.5867 6.166Z"
        fill="#44C4E2"
      />
    </Svg>
  )
}

export default Icon
