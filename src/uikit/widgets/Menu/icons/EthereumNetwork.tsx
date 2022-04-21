import React from 'react'
import Svg from '../../../components/Svg/Svg'
import { SvgProps } from '../../../components/Svg/types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg {...props} xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" version="1.1" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd"
      viewBox="0 0 784.37 1277.39">
        <polygon fill="#343434" fillRule="nonzero" points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54 "/>
        <polygon fill="#8C8C8C" fillRule="nonzero" points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33 "/>
        <polygon fill="#3C3C3B" fillRule="nonzero" points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89 "/>
        <polygon fill="#8C8C8C" fillRule="nonzero" points="392.07,1277.38 392.07,956.52 -0,724.89 "/>
        <polygon fill="#141414" fillRule="nonzero" points="392.07,882.29 784.13,650.54 392.07,472.33 "/>
        <polygon fill="#393939" fillRule="nonzero" points="0,650.54 392.07,882.29 392.07,472.33 "/>
    </Svg>
  )
}

export default Icon