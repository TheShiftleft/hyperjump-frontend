import { createGlobalStyle } from 'styled-components'
// eslint-disable-next-line import/no-unresolved
import { HyperTheme } from 'uikit/theme'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends HyperTheme {}
}

const GlobalStyle = createGlobalStyle`
  @import url('https://rsms.me/inter/inter.css');
  @supports (font-variation-settings: normal) {
    html { font-family: 'Inter var', sans-serif; }
  }
  
  * {
    font-family: 'Coda';
  }
  body {
    background-color: ${({ theme }) => theme.colors.background};
    background-image: url(/bg2.jpg);
    background-attachment: fixed;
    background-size: 100% auto;
    img {
      height: auto;
      max-width: 100%;
    }
  }

  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }

  a {
    text-decoration: none;

    :hover {
      text-decoration: none
    }
  }


.three-line-legend {
	width: 100%;
	height: 70px;
	position: absolute;
	padding: 8px;
	font-size: 12px;
	color: #20262E;
	background-color: rgba(255, 255, 255, 0.23);
	text-align: left;
	z-index: 10;
  pointer-events: none;
}

.three-line-legend-dark {
	width: 100%;
	height: 70px;
	position: absolute;
	padding: 8px;
	font-size: 12px;
	color: white;
	background-color: rgba(255, 255, 255, 0.23);
	text-align: left;
	z-index: 10;
  pointer-events: none;
}

@media screen and (max-width: 800px) {
  .three-line-legend {
    display: none !important;
  }
}

.tv-lightweight-charts{
  width: 100% !important;


  & > * {
    width: 100% !important;
  }
}
`

export default GlobalStyle
