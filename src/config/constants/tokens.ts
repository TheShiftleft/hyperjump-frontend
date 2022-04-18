import { Token } from './types'

const tokens: Record<string, Token> = {
  bnb: {
    symbol: 'BNB',
    address: { 
      56: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', 
      250: '0xD67de0e0a0Fd7b15dC8348Bb9BE742F3c5850454' 
    },
    decimals: 18,
    projectLink: 'https://www.binance.com/',
  },
  wftm: {
    symbol: 'WFTM',
    address: {
      250: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
      56: '0xAD29AbB318791D579433D831ed122aFeAf29dcfe',
    },
    decimals: 18,
    projectLink: 'https://www.fantom.foundation/',
  },
  ftm: {
    symbol: 'FTM',
    address: {
      250: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      56: '0xAD29AbB318791D579433D831ed122aFeAf29dcfe'
    },
    decimals: 18,
    projectLink: 'https://www.fantom.foundation/',
  },
  jump: {
    symbol: 'JUMP',
    address: {
      56: '0x130025eE738A66E691E6A7a62381CB33c6d9Ae83',
      97: '0x2c9a2fA5d93c7A4CFfBB45e94f05Fd9eF58A5CE2',
      250: '0x78DE9326792ce1d6eCA0c978753c6953Cdeedd73',
    },
    decimals: 18,
    projectLink: 'https://hyperjump.app/',
  },
  xjump: {
    symbol: 'xJUMP',
    address: {
      56: '0x3876720eF21Cd7036B8A247a695cb82D5319e588', // for farm 2.1
      250: '0xfD44AE75b934335262654600006E93594129CAA9', // 2.1
    },
    decimals: 18,
    projectLink: 'https://hyperjump.app/',
  },
  xjump20: {
    symbol: 'xJUMP20',
    address: {
      56: '0x522650DE53E79eAD931e4eB3537B12D7FE06697D', // xjump for old farm
      250: '0x5621Ca989428CF105784164b84D500f4a6bEc889',
    },
    decimals: 18,
    projectLink: 'https://hyperjump.app/',
  },
  alloy: {
    symbol: 'ALLOY',
    address: { 
      56: '0x5eF5994fA33FF4eB6c82d51ee1DC145c546065Bd', 
      97: '0xC5FD6F3eB1f63082Daee9e09E17D870005962309' 
    },
    decimals: 18,
    projectLink: 'https://hyperjump.app/',
  },
  ori: {
    symbol: 'ORI',
    address: { 
      250: '0x0575f8738EFdA7F512e3654F277C77e80C7d2725' 
    },
    decimals: 18,
    projectLink: 'https://hyperjump.app/',
  },
  hypr: {
    symbol: 'HYPR',
    address: { 
      56: '0x03D6BD3d48F956D783456695698C407A46ecD54d',
      97: '0x03D6BD3d48F956D783456695698C407A46ecD54d'
    },
    decimals: 18,
    projectLink: 'https://hyperjump.app/',
  },
  aurora: {
    symbol: 'AURORA',
    address: { 250: '0xbc2451AaD349b6B43FD05F4F0cC327F8A6bcA2d4' },
    decimals: 18,
    projectLink: 'https://hyperjump.app/',
  },
  mech: {
    symbol: 'MECH',
    address: {
      56: '0x3ae713C662B8852D686e718E0762631A4CB84954',
      97: '0xcba0FA601C44509e671283d071c600EFA7EdDC6a',
      250: '0x85c85647e1A79c2b8bc3Ed2B6a1DdE326eeC66c5',
    },
    decimals: 18,
    projectLink: 'https://hyperjump.app/',
  },
  glch: {
    symbol: 'GLCH',
    address: {
      56: '0xF0902eB0049A4003793BAb33F3566A22D2834442',
      250: '',
    },
    decimals: 18,
    projectLink: 'https://glitch.finance',
  },
  supra: {
    symbol: 'supra',
    address: { 
      56: '0x4Ae2f11Df681eEC979bD93085Dd1A05E9593c8C6' 
    },
    decimals: 18,
    projectLink: 'https://hyperjump.app/',
  },
  shilling: {
    symbol: 'shilling',
    address: { 
      56: '0x643B6ef6306417A0b3FA2813eb5BAf30F5dd8736' 
    },
    decimals: 18,
    projectLink: 'https://hyperjump.app/',
  },
  spg: {
    symbol: 'spg',
    address: { 
      56: '0x3aabCf53A1930A42E18D938C019E83Ebee50a849' 
    },
    decimals: 18,
    projectLink: 'https://hyperjump.app/',
  },
  dvt: {
    symbol: 'DVT',
    address: { 
      56: '0xA47d132bFC00bc7B1B99238E08b91f1A08CcDbF3' 
    },
    decimals: 18,
    projectLink: 'https://hyperjump.app/',
  },
  btd: {
    symbol: 'BTD',
    address: { 
      56: '0xD1102332a213E21faF78B69C03572031F3552c33' 
    },
    decimals: 18,
    projectLink: 'https://hyperjump.app/',
  },
  slime: {
    symbol: 'SLIME',
    address: { 
      56: '0x4fCfA6cC8914ab455B5b33Df916d90BFe70b6AB1' 
    },
    decimals: 18,
    projectLink: 'https://hyperjump.app/',
  },
  ramen: {
    symbol: 'RAMEN',
    address: { 
      56: '0x4F47A0d15c1E53F3d94c069C7D16977c29F9CB6B' 
    },
    decimals: 18,
    projectLink: 'https://ramenswap.finance/',
  },
  brew: {
    symbol: 'BREW',
    address: { 
      56: '0x790Be81C3cA0e53974bE2688cDb954732C9862e1' 
    },
    decimals: 18,
    projectLink: 'https://cafeswap.finance/',
  },
  voodoo: {
    symbol: 'VOODOO',
    address: { 
      56: '0x68a66a7C35e037192F6E38C766D6692D54219E6D' 
    },
    decimals: 18,
    projectLink: 'https://voodoo.supra.finance/',
  },
  oil: {
    symbol: 'OIL',
    address: { 
      56: '0xb1b17DFf66d75b29d34f0Bf8622c406D8219B507' 
    },
    decimals: 18,
    projectLink: 'https://crudeoil.finance/',
  },
  innbc: {
    symbol: 'INNBC',
    address: { 
      97: '0xdF1F0026374d4BCc490BE5E316963Cf6Df2FfF19', 
      56: '0xdF1F0026374d4BCc490BE5E316963Cf6Df2FfF19' 
    },
    decimals: 18,
    projectLink: 'https://www.innovativebioresearch.com/',
  },
  soak: {
    symbol: 'SOAK',
    address: { 
      97: '0x849233FF1aea15D80EF658B2871664C9Ca994063',
      56: '0x849233FF1aea15D80EF658B2871664C9Ca994063' },
    decimals: 18,
    projectLink: 'https://sponge.finance/',
  },
  hps: {
    symbol: 'HPS',
    address: { 
      56: '0xeDa21B525Ac789EaB1a08ef2404dd8505FfB973D' 
    },
    decimals: 18,
    projectLink: 'https://hyperjump.app/',
  },
  bhc: {
    symbol: 'BHC',
    address: { 
      56: '0x6fd7c98458a943f469E1Cf4eA85B173f5Cd342F4' 
    },
    decimals: 18,
    projectLink: 'https://hyperjump.app/',
  },
  ont: {
    symbol: 'ONT',
    address: { 
      56: '0xFd7B3A77848f1C2D67E05E54d78d174a0C850335' 
    },
    decimals: 18,
    projectLink: 'https://ont.io/',
  },
  sphn: {
    symbol: 'SPHN',
    address: { 
      56: '0xb58a579e8f987b52564A5fE08Fe5181dc2621a9c' 
    },
    decimals: 18,
    projectLink: 'https://siphon.finance/',
  },
  bfi: {
    symbol: 'BFI',
    address: { 
      56: '0x81859801b01764D4f0Fa5E64729f5a6C3b91435b' 
    },
    decimals: 18,
    projectLink: 'https://hyperjump.app/',
  },
  sbdo: {
    symbol: 'sBDO',
    address: { 
      56: '0x0d9319565be7f53CeFE84Ad201Be3f40feAE2740' 
    },
    decimals: 18,
    projectLink: 'https://hyperjump.app/',
  },
  auto: {
    symbol: 'AUTO',
    address: { 
      56: '0xa184088a740c695E156F91f5cC086a06bb78b827' 
    },
    decimals: 18,
    projectLink: 'https://hyperjump.app/',
  },
  lusd: {
    symbol: 'lUSD',
    address: { 
      56: '0x23e8a70534308a4AAF76fb8C32ec13d17a3BD89e' 
    },
    decimals: 18,
    projectLink: 'https://hyperjump.app/',
  },
  renbtc: {
    symbol: 'renBTC',
    address: {
      56: '0xfCe146bF3146100cfe5dB4129cf6C82b0eF4Ad8c',
      250: '0xDBf31dF14B66535aF65AaC99C32e9eA844e14501',
    },
    decimals: 8,
    projectLink: 'https://hyperjump.app/',
  },
  rendoge: {
    symbol: 'renDOGE',
    address: { 
      56: '0xc3fEd6eB39178A541D274e6Fc748d48f0Ca01CC3'
    },
    decimals: 8,
    projectLink: 'https://hyperjump.app/',
  },
  anymtlx: {
    symbol: 'anyMTLX',
    address: { 
      56: '0x5921DEE8556c4593EeFCFad3CA5e2f618606483b' 
    },
    decimals: 18,
    projectLink: 'https://hyperjump.app/',
  },
  renzec: {
    symbol: 'renZEC',
    address: {
      56: '0x695FD30aF473F2960e81Dc9bA7cB67679d35EDb7',
      250: '0x31a0D1A199631D244761EEba67e8501296d2E383',
    },
    decimals: 8,
    projectLink: 'https://hyperjump.app/',
  },
  tpt: {
    symbol: 'TPT',
    address: { 
      56: '0xECa41281c24451168a37211F0bc2b8645AF45092' 
    },
    decimals: 4,
    projectLink: 'https://hyperjump.app/',
  },
  bel: {
    symbol: 'BEL',
    address: { 
      56: '0x8443f091997f06a61670B735ED92734F5628692F' 
    },
    decimals: 18,
    projectLink: 'https://hyperjump.app/',
  },
  dexe: {
    symbol: 'DEXE',
    address: { 
      56: '0x039cB485212f996A9DBb85A9a75d898F94d38dA6' 
    },
    decimals: 18,
    projectLink: 'https://hyperjump.app/',
  },
  ramp: {
    symbol: 'RAMP',
    address: { 
      56: '0x8519EA49c997f50cefFa444d240fB655e89248Aa' 
    },
    decimals: 18,
    projectLink: 'https://hyperjump.app/',
  },
  belt: {
    symbol: 'BELT',
    address: { 
      56: '0xE0e514c71282b6f4e823703a39374Cf58dc3eA4f' 
    },
    decimals: 18,
    projectLink: 'https://hyperjump.app/',
  },
  bat: {
    symbol: 'BAT',
    address: { 
      56: '0x101d82428437127bF1608F699CD651e6Abf9766E' 
    },
    decimals: 18,
    projectLink: 'https://hyperjump.app/',
  },
  bux: {
    symbol: 'BUX',
    address: { 
      56: '0x211FfbE424b90e25a15531ca322adF1559779E45' 
    },
    decimals: 18,
    projectLink: 'https://hyperjump.app/',
  },
  for: {
    symbol: 'FOR',
    address: { 
      56: '0x658A109C5900BC6d2357c87549B651670E5b0539' 
    },
    decimals: 18,
    projectLink: 'https://hyperjump.app/',
  },
  alice: {
    symbol: 'ALICE',
    address: { 
      56: '0xAC51066d7bEC65Dc4589368da368b212745d63E8' 
    },
    decimals: 6,
    projectLink: 'https://hyperjump.app/',
  },
  bunny: {
    symbol: 'BUNNY',
    address: { 
      56: '0xC9849E6fdB743d08fAeE3E34dd2D1bc69EA11a51' 
    },
    decimals: 18,
    projectLink: 'https://hyperjump.app/',
  },
  beluga: {
    symbol: 'BELUGA',
    address: { 
      56: '0x181dE8C57C4F25eBA9Fd27757BBd11Cc66a55d31' 
    },
    decimals: 18,
    projectLink: 'https://app.beluga.fi/',
  },
  gfce: {
    symbol: 'GFCE',
    address: { 
      56: '0x94BaBBE728D9411612Ee41b20241a6FA251b26Ce' 
    },
    decimals: 9,
    projectLink: 'https://jetfuel.finance/gforce/g-force',
  },
  treat: {
    symbol: 'TREAT',
    address: { 
      56: '0xac0C7d9B063eD2C0946982dDB378e03886C064E6' 
    },
    decimals: 18,
    projectLink: 'https://treatdao.com/',
  },
  xblzd: {
    symbol: 'xBLZD',
    address: { 
      56: '0x9a946c3Cb16c08334b69aE249690C236Ebd5583E' 
    },
    decimals: 18,
    projectLink: 'https://www.blizzard.money/',
  },
  soul: {
    symbol: 'SOUL',
    address: { 
      56: '0x67d012F731c23F0313CEA1186d0121779c77fcFE' 
    },
    decimals: 8,
    projectLink: 'http://apoyield.com/',
  },
  brn: {
    symbol: 'BRN',
    address: { 
      56: '0x5749085C36A521f71AD2050Cb600B2165aabdF68' 
    },
    decimals: 8,
    projectLink: 'https://www.brainaut.net/',
  },
  banana: {
    symbol: 'BANANA',
    address: { 
      56: '0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95' 
    },
    decimals: 18,
    projectLink: 'https://apeswap.finance/',
  },
  pmp: {
    symbol: 'PMP',
    address: { 
      56: '0x8d4FBB3AC63bf33851dCE80D63613Df1A515BC00' 
    },
    decimals: 18,
    projectLink: 'https://pumpy.farm/',
  },
  milk2: {
    symbol: 'MILK2',
    address: { 
      56: '0x4A5a34212404f30C5aB7eB61b078fA4A55AdC5a5' 
    },
    decimals: 18,
    projectLink: 'https://spaceswap.app/',
  },
  grand: {
    symbol: 'GRAND',
    address: { 
      56: '0xeE814F5B2bF700D2e843Dc56835D28d095161dd9' 
    },
    decimals: 18,
    projectLink: 'https://www.thegrandbanks.finance/#/',
  },
  fts: {
    symbol: 'FTS',
    address: { 
      56: '0x4437743ac02957068995c48E08465E0EE1769fBE' 
    },
    decimals: 18,
    projectLink: 'https://hyperjump.app/',
  },
  naut: {
    symbol: 'NAUT',
    address: { 
      56: '0x05B339B0A346bF01f851ddE47a5d485c34FE220c' 
    },
    decimals: 8,
    projectLink: 'https://astronaut.to/',
  },
  ccbd: {
    symbol: 'cCBD',
    address: { 
      56: '0x131DEd61462cb0f8034656D9294F79247f72Ad0b' 
    },
    decimals: 18,
    projectLink: 'https://cbd-cash.io/',
  },
  scbd: {
    symbol: 'sCBD',
    address: { 
      56: '0x7a0fFA3db812701e711fc38eacb99675352f31be' 
    },
    decimals: 18,
    projectLink: 'https://cbd-cash.io/',
  },
  shililng: {
    symbol: 'SHILILNG',
    address: { 
      56: '0x643B6ef6306417A0b3FA2813eb5BAf30F5dd8736' 
    },
    decimals: 18,
    projectLink: 'https://hyperjump.app/',
  },
  cake: {
    symbol: 'CAKE',
    address: {
      56: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
      97: '0xa35062141Fa33BCA92Ce69FeD37D0E8908868AAe',
    },
    decimals: 18,
    projectLink: 'https://pancakeswap.finance/',
  },
  txl: {
    symbol: 'TXL',
    address: {
      56: '0x1FFD0b47127fdd4097E54521C9E2c7f0D66AafC5',
    },
    decimals: 18,
    projectLink: 'https://tixl.org/',
  },
  nuls: {
    symbol: 'NULS',
    address: {
      56: '0x8CD6e29d3686d24d3C2018CEe54621eA0f89313B',
    },
    decimals: 8,
    projectLink: 'https://www.nuls.io/',
  },
  watch: {
    symbol: 'WATCH',
    address: {
      56: '0x7A9f28EB62C791422Aa23CeAE1dA9C847cBeC9b0',
    },
    decimals: 18,
    projectLink: 'https://yieldwatch.net/',
  },
  xmark: {
    symbol: 'xMARK',
    address: {
      56: '0x26A5dFab467d4f58fB266648CAe769503CEC9580',
    },
    decimals: 9,
    projectLink: 'https://benchmarkprotocol.finance/',
  },
  bmxx: {
    symbol: 'bMXX',
    address: {
      56: '0x4131b87F74415190425ccD873048C708F8005823',
    },
    decimals: 18,
    projectLink: 'https://multiplier.finance/',
  },
  iotx: {
    symbol: 'IOTX',
    address: {
      56: '0x9678E42ceBEb63F23197D726B29b1CB20d0064E5',
    },
    decimals: 18,
    projectLink: 'https://iotex.io/',
  },
  bor: {
    symbol: 'BOR',
    address: {
      56: '0x92D7756c60dcfD4c689290E8A9F4d263b3b32241',
    },
    decimals: 18,
    projectLink: 'https://www.boringdao.com/',
  },
  bopen: {
    symbol: 'bOPEN',
    address: {
      56: '0xF35262a9d427F96d2437379eF090db986eaE5d42',
    },
    decimals: 18,
    projectLink: 'https://opendao.io/',
  },
  dodo: {
    symbol: 'DODO',
    address: {
      56: '0x67ee3Cb086F8a16f34beE3ca72FAD36F7Db929e2',
    },
    decimals: 18,
    projectLink: 'https://dodoex.io/',
  },
  swingby: {
    symbol: 'SWINGBY',
    address: {
      56: '0x71DE20e0C4616E7fcBfDD3f875d568492cBE4739',
    },
    decimals: 18,
    projectLink: 'https://swingby.network/',
  },
  bry: {
    symbol: 'BRY',
    address: {
      56: '0xf859Bf77cBe8699013d6Dbc7C2b926Aaf307F830',
    },
    decimals: 18,
    projectLink: 'https://berrydata.co/',
  },
  zee: {
    symbol: 'ZEE',
    address: {
      56: '0x44754455564474A89358B2C2265883DF993b12F0',
    },
    decimals: 18,
    projectLink: 'https://zeroswap.io/',
  },
  swgb: {
    symbol: 'SWGb',
    address: {
      56: '0xE40255C5d7fa7ceEc5120408C78C787CECB4cfdb',
    },
    decimals: 18,
    projectLink: 'https://swirgepay.com/',
  },
  swg: {
    symbol: 'SWG',
    address: {
      56: '0xe792f64C582698b8572AAF765bDC426AC3aEfb6B',
    },
    decimals: 18,
    projectLink: 'https://swirgepay.com/',
  },
  sfp: {
    symbol: 'SFP',
    address: {
      56: '0xD41FDb03Ba84762dD66a0af1a6C8540FF1ba5dfb',
    },
    decimals: 18,
    projectLink: 'https://www.safepal.io/',
  },
  lina: {
    symbol: 'LINA',
    address: {
      56: '0x762539b45A1dCcE3D36d080F74d1AED37844b878',
    },
    decimals: 18,
    projectLink: 'https://linear.finance/',
  },
  lit: {
    symbol: 'LIT',
    address: {
      56: '0xb59490aB09A0f526Cc7305822aC65f2Ab12f9723',
    },
    decimals: 18,
    projectLink: 'https://www.litentry.com/',
  },
  hget: {
    symbol: 'HGET',
    address: {
      56: '0xC7d8D35EBA58a0935ff2D5a33Df105DD9f071731',
    },
    decimals: 6,
    projectLink: 'https://www.hedget.com/',
  },
  bdo: {
    symbol: 'BDO',
    address: {
      56: '0x190b589cf9Fb8DDEabBFeae36a813FFb2A702454',
    },
    decimals: 18,
    projectLink: 'https://bdollar.fi/',
  },
  egld: {
    symbol: 'EGLD',
    address: {
      56: '0xbF7c81FFF98BbE61B40Ed186e4AfD6DDd01337fe',
    },
    decimals: 18,
    projectLink: 'https://elrond.com/',
  },
  ust: {
    symbol: 'UST',
    address: {
      56: '0x23396cF899Ca06c4472205fC903bDB4de249D6fC',
    },
    decimals: 18,
    projectLink: 'https://mirror.finance/',
  },
  wsote: {
    symbol: 'wSOTE',
    address: {
      56: '0x541E619858737031A1244A5d0Cd47E5ef480342c',
    },
    decimals: 18,
    projectLink: 'https://soteria.finance/#/',
  },
  front: {
    symbol: 'FRONT',
    address: {
      56: '0x928e55daB735aa8260AF3cEDadA18B5f70C72f1b',
    },
    decimals: 18,
    projectLink: 'https://frontier.xyz/',
  },
  helmet: {
    symbol: 'Helmet',
    address: {
      56: '0x948d2a81086A075b3130BAc19e4c6DEe1D2E3fE8',
    },
    decimals: 18,
    projectLink: 'https://www.helmet.insure/',
  },
  btcst: {
    symbol: 'BTCST',
    address: {
      56: '0x78650B139471520656b9E7aA7A5e9276814a38e9',
    },
    decimals: 17,
    projectLink: 'https://www.1-b.tc/',
  },
  bscx: {
    symbol: 'BSCX',
    address: {
      56: '0x5Ac52EE5b2a633895292Ff6d8A89bB9190451587',
    },
    decimals: 18,
    projectLink: 'https://bscex.org/',
  },
  ten: {
    symbol: 'TEN',
    address: {
      56: '0xdFF8cb622790b7F92686c722b02CaB55592f152C',
    },
    decimals: 18,
    projectLink: 'https://www.tenet.farm/',
  },
  balbt: {
    symbol: 'bALBT',
    address: {
      56: '0x72fAa679E1008Ad8382959FF48E392042A8b06f7',
    },
    decimals: 18,
    projectLink: 'https://allianceblock.io/',
  },
  asr: {
    symbol: 'ASR',
    address: {
      56: '0x80D5f92C2c8C682070C95495313dDB680B267320',
    },
    decimals: 2,
    projectLink: 'https://www.chiliz.com',
  },
  atm: {
    symbol: 'ATM',
    address: {
      56: '0x25E9d05365c867E59C1904E7463Af9F312296f9E',
    },
    decimals: 2,
    projectLink: 'https://www.chiliz.com',
  },
  og: {
    symbol: 'OG',
    address: {
      56: '0xf05E45aD22150677a017Fbd94b84fBB63dc9b44c',
    },
    decimals: 2,
    projectLink: 'https://www.chiliz.com',
  },
  reef: {
    symbol: 'REEF',
    address: {
      56: '0xF21768cCBC73Ea5B6fd3C687208a7c2def2d966e',
    },
    decimals: 18,
    projectLink: 'https://reef.finance/',
  },
  ditto: {
    symbol: 'DITTO',
    address: {
      56: '0x233d91A0713155003fc4DcE0AFa871b508B3B715',
    },
    decimals: 9,
    projectLink: 'https://ditto.money/',
  },
  xditto: {
    symbol: 'xDITTO',
    address: {
      56: '0xB0a1DE764A033A76f28E821fBe402EDBFEe937dB',
    },
    decimals: 9,
    projectLink: 'https://ditto.money/',
  },
  juv: {
    symbol: 'JUV',
    address: {
      56: '0xC40C9A843E1c6D01b7578284a9028854f6683b1B',
    },
    decimals: 2,
    projectLink: 'https://www.chiliz.com',
  },
  psg: {
    symbol: 'PSG',
    address: {
      56: '0xBc5609612b7C44BEf426De600B5fd1379DB2EcF1',
    },
    decimals: 2,
    projectLink: 'https://www.chiliz.com',
  },
  vai: {
    symbol: 'VAI',
    address: {
      56: '0x4BD17003473389A42DAF6a0a729f6Fdb328BbBd7',
    },
    decimals: 18,
    projectLink: 'https://venus.io/',
  },
  wbnb: {
    symbol: 'wBNB',
    address: {
      56: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      97: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
    },
    decimals: 18,
    projectLink: 'https://hyperjump.app/',
  },
  blink: {
    symbol: 'BLINK',
    address: {
      56: '0x63870A18B6e42b01Ef1Ad8A2302ef50B7132054F',
    },
    decimals: 6,
    projectLink: 'https://blink.wink.org',
  },
  unfi: {
    symbol: 'UNFI',
    address: {
      56: '0x728C5baC3C3e370E372Fc4671f9ef6916b814d8B',
    },
    decimals: 18,
    projectLink: 'https://unifiprotocol.com',
  },
  twt: {
    symbol: 'TWT',
    address: {
      56: '0x4B0F1812e5Df2A09796481Ff14017e6005508003',
    },
    decimals: 18,
    projectLink: 'https://trustwallet.com/',
  },
  hard: {
    symbol: 'HARD',
    address: {
      56: '0xf79037F6f6bE66832DE4E7516be52826BC3cBcc4',
    },
    decimals: 6,
    projectLink: 'https://hard.kava.io',
  },
  broobee: {
    symbol: 'bROOBEE',
    address: {
      56: '0xE64F5Cb844946C1F102Bd25bBD87a5aB4aE89Fbe',
    },
    decimals: 18,
    projectLink: 'https://roobee.io/',
  },
  stax: {
    symbol: 'STAX',
    address: {
      56: '0x0Da6Ed8B13214Ff28e9Ca979Dd37439e8a88F6c4',
    },
    decimals: 18,
    projectLink: 'http://stablexswap.com/',
  },
  nar: {
    symbol: 'NAR',
    address: {
      56: '0xA1303E6199b319a891b79685F0537D289af1FC83',
    },
    decimals: 18,
    projectLink: 'https://narwhalswap.org/',
  },
  nya: {
    symbol: 'NYA',
    address: {
      56: '0xbFa0841F7a90c4CE6643f651756EE340991F99D5',
    },
    decimals: 18,
    projectLink: 'https://nyanswop.org/',
  },
  ctk: {
    symbol: 'CTK',
    address: {
      56: '0xA8c2B8eec3d368C0253ad3dae65a5F2BBB89c929',
    },
    decimals: 6,
    projectLink: 'https://www.certik.foundation/',
  },
  inj: {
    symbol: 'INJ',
    address: {
      56: '0xa2B726B1145A4773F68593CF171187d8EBe4d495',
    },
    decimals: 18,
    projectLink: 'https://injectiveprotocol.com/',
  },
  sxp: {
    symbol: 'SXP',
    address: {
      56: '0x47BEAd2563dCBf3bF2c9407fEa4dC236fAbA485A',
    },
    decimals: 18,
    projectLink: 'https://swipe.io/',
  },
  alpha: {
    symbol: 'ALPHA',
    address: {
      56: '0xa1faa113cbE53436Df28FF0aEe54275c13B40975',
    },
    decimals: 18,
    projectLink: 'https://alphafinance.io/',
  },
  xvs: {
    symbol: 'XVS',
    address: {
      56: '0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63',
    },
    decimals: 18,
    projectLink: 'https://venus.io/',
  },
  sushi: {
    symbol: 'SUSHI',
    address: {
      56: '0x947950BcC74888a40Ffa2593C5798F11Fc9124C4',
      250: '0xae75A438b2E0cB8Bb01Ec1E1e376De11D44477CC',
    },
    decimals: 18,
    projectLink: 'https://sushi.com/',
  },
  comp: {
    symbol: 'COMP',
    address: {
      56: '0x52CE071Bd9b1C4B00A0b92D298c512478CaD67e8',
    },
    decimals: 18,
    projectLink: 'https://compound.finance/',
  },
  syrup: {
    symbol: 'SYRUP',
    address: {
      56: '0x009cF7bC57584b7998236eff51b98A168DceA9B0',
      97: '0xfE1e507CeB712BDe086f3579d2c03248b2dB77f9',
    },
    decimals: 18,
    projectLink: 'https://hyperjump.app/',
  },
  bifi: {
    symbol: 'BIFI',
    address: {
      56: '0xCa3F508B8e4Dd382eE878A314789373D80A5190A',
    },
    decimals: 18,
    projectLink: 'https://beefy.finance/',
  },
  dusk: {
    symbol: 'DUSK',
    address: {
      56: '0xB2BD0749DBE21f623d9BABa856D3B0f0e1BFEc9C',
    },
    decimals: 18,
    projectLink: 'https://dusk.network/',
  },
  busd: {
    symbol: 'BUSD',
    address: {
      56: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
      97: '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
    },
    decimals: 18,
    projectLink: 'https://www.paxos.com/busd/',
  },
  eth: {
    symbol: 'ETH',
    address: {
      56: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
      250: '0x74b23882a30290451A17c44f4F05243b6b58C76d',
    },
    decimals: 18,
    projectLink: 'https://ethereum.org/en/',
  },
  beth: {
    symbol: 'BETH',
    address: {
      56: '0x250632378E573c6Be1AC2f97Fcdf00515d0Aa91B',
    },
    decimals: 18,
    projectLink: 'https://ethereum.org/en/eth2/beacon-chain/',
  },
  mamzn: {
    symbol: 'mAMZN',
    address: {
      56: '0x3947B992DC0147D2D89dF0392213781b04B25075',
    },
    decimals: 18,
    projectLink: 'https://mirror.finance/',
  },
  mgoogl: {
    symbol: 'mGOOGL',
    address: {
      56: '0x62D71B23bF15218C7d2D7E48DBbD9e9c650B173f',
    },
    decimals: 18,
    projectLink: 'https://mirror.finance/',
  },
  mnflx: {
    symbol: 'mNFLX',
    address: {
      56: '0xa04F060077D90Fe2647B61e4dA4aD1F97d6649dc',
    },
    decimals: 18,
    projectLink: 'https://mirror.finance/',
  },
  mtsla: {
    symbol: 'mTSLA',
    address: {
      56: '0xF215A127A196e3988C09d052e16BcFD365Cd7AA3',
    },
    decimals: 18,
    projectLink: 'https://mirror.finance/',
  },
  ltc: {
    symbol: 'LTC',
    address: {
      56: '0x4338665CBB7B2485A8855A139b75D5e34AB0DB94',
    },
    decimals: 18,
    projectLink: 'https://litecoin.org/',
  },
  usdc: {
    symbol: 'USDC',
    address: {
      56: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
      250: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
    },
    decimals: 6,
    projectLink: 'https://www.centre.io/usdc',
  },
  dai: {
    symbol: 'DAI',
    address: {
      56: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
      250: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E',
    },
    decimals: 18,
    projectLink: 'http://www.makerdao.com/',
  },
  ada: {
    symbol: 'ADA',
    address: {
      56: '0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://www.cardano.org/',
  },
  band: {
    symbol: 'BAND',
    address: {
      56: '0xAD6cAEb32CD2c308980a548bD0Bc5AA4306c6c18',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://bandprotocol.com/',
  },
  dot: {
    symbol: 'DOT',
    address: {
      56: '0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://polkadot.network/',
  },
  eos: {
    symbol: 'EOS',
    address: {
      56: '0x56b6fB708fC5732DEC1Afc8D8556423A2EDcCbD6',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://eos.io/',
  },
  link: {
    symbol: 'LINK',
    address: {
      56: '0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      250: '0xb3654dc3D10Ea7645f8319668E8F54d2574FBdC8',
    },
    decimals: 18,
    projectLink: 'https://chain.link/',
  },
  usdt: {
    symbol: 'USDT',
    address: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0x55d398326f99059ff775485246999027b3197955',
    },
    decimals: 18,
    projectLink: 'https://tether.to/',
  },
  btcb: {
    symbol: 'BTCB',
    address: {
      56: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://bitcoin.org/',
  },
  btc: {
    symbol: 'BTC',
    address: { 
      97: '', 
      250: '0x321162Cd933E2Be498Cd2267a90534A804051b11' 
    },
    decimals: 8,
    projectLink: 'https://hyperjump.app/',
  },
  xrp: {
    symbol: 'XRP',
    address: {
      56: '0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://ripple.com/xrp/',
  },
  atom: {
    symbol: 'ATOM',
    address: {
      56: '0x0Eb3a705fc54725037CC9e008bDede697f62F335',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://cosmos.network/',
  },
  yfii: {
    symbol: 'YFII',
    address: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0x7F70642d88cf1C4a3a7abb072B53B929b653edA5',
    },
    decimals: 18,
    projectLink: 'https://dfi.money/#/',
  },
  xtz: {
    symbol: 'XTZ',
    address: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0x16939ef78684453bfDFb47825F8a5F714f12623a',
    },
    decimals: 18,
    projectLink: 'https://www.tezos.com/',
  },
  bch: {
    symbol: 'BCH',
    address: {
      56: '0x8fF795a6F4D97E7887C79beA79aba5cc76444aDf',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'http://bch.info/',
  },
  yfi: {
    symbol: 'YFI',
    address: {
      56: '0x88f1A5ae2A3BF98AEAF342D26B30a79438c9142e',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      250: '0x29b0Da86e484E1C0029B56e817912d778aC0EC69',
    },
    decimals: 18,
    projectLink: 'https://yearn.finance/',
  },
  uni: {
    symbol: 'UNI',
    address: {
      56: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://uniswap.org/',
  },
  fil: {
    symbol: 'FIL',
    address: {
      56: '0x0D8Ce2A99Bb6e3B7Db580eD848240e4a0F9aE153',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://filecoin.io/',
  },
  bake: {
    symbol: 'BAKE',
    address: {
      56: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://www.bakeryswap.org/',
  },
  burger: {
    symbol: 'BURGER',
    address: {
      56: '0xAe9269f27437f0fcBC232d39Ec814844a51d6b8f',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://burgerswap.org/',
  },
  bdigg: {
    symbol: 'bDIGG',
    address: {
      56: '0x5986D5c77c65e5801a5cAa4fAE80089f870A71dA',
    },
    decimals: 18,
    projectLink: 'https://badger.finance/',
  },
  bbadger: {
    symbol: 'bBadger',
    address: {
      56: '0x1F7216fdB338247512Ec99715587bb97BBf96eae',
    },
    decimals: 18,
    projectLink: 'https://badger.finance/',
  },
  trade: {
    symbol: 'TRADE',
    address: {
      56: '0x7af173F350D916358AF3e218Bdf2178494Beb748',
    },
    decimals: 18,
    projectLink: 'https://unitrade.app/',
  },
  pnt: {
    symbol: 'PNT',
    address: {
      56: '0xdaacB0Ab6Fb34d24E8a67BfA14BF4D95D4C7aF92',
    },
    decimals: 18,
    projectLink: 'https://ptokens.io/',
  },
  mir: {
    symbol: 'MIR',
    address: {
      56: '0x5B6DcF557E2aBE2323c48445E8CC948910d8c2c9',
    },
    decimals: 18,
    projectLink: 'https://mirror.finance/',
  },
  pbtc: {
    symbol: 'pBTC',
    address: {
      56: '0xeD28A457A5A76596ac48d87C0f577020F6Ea1c4C',
    },
    decimals: 18,
    projectLink: 'https://ptokens.io/',
  },
  lto: {
    symbol: 'LTO',
    address: {
      56: '0x857B222Fc79e1cBBf8Ca5f78CB133d1b7CF34BBd',
    },
    decimals: 18,
    projectLink: 'https://ltonetwork.com/',
  },
  pcws: {
    symbol: 'pCWS',
    address: {
      56: '0xbcf39F0EDDa668C58371E519AF37CA705f2bFcbd',
    },
    decimals: 18,
    projectLink: 'https://game.seascape.network/',
  },
  zil: {
    symbol: 'ZIL',
    address: {
      56: '0xb86AbCb37C3A4B64f74f59301AFF131a1BEcC787',
    },
    decimals: 12,
    projectLink: 'https://www.zilliqa.com/',
  },
  lien: {
    symbol: 'LIEN',
    address: {
      56: '0x5d684ADaf3FcFe9CFb5ceDe3abf02F0Cdd1012E3',
    },
    decimals: 8,
    projectLink: 'https://lien.finance/',
  },
  swth: {
    symbol: 'SWTH',
    address: {
      56: '0x250b211EE44459dAd5Cd3bCa803dD6a7EcB5d46C',
    },
    decimals: 8,
    projectLink: 'https://switcheo.network/',
  },
  dft: {
    symbol: 'DFT',
    address: {
      56: '0x42712dF5009c20fee340B245b510c0395896cF6e',
    },
    decimals: 18,
    projectLink: 'https://www.dfuture.com/home',
  },
  gum: {
    symbol: 'GUM',
    address: {
      56: '0xc53708664b99DF348dd27C3Ac0759d2DA9c40462',
    },
    decimals: 18,
    projectLink: 'https://gourmetgalaxy.io/',
  },
  dego: {
    symbol: 'DEGO',
    address: {
      56: '0x3FdA9383A84C05eC8f7630Fe10AdF1fAC13241CC',
    },
    decimals: 18,
    projectLink: 'https://bsc.dego.finance/home',
  },
  nrv: {
    symbol: 'NRV',
    address: {
      56: '0x42F6f551ae042cBe50C739158b4f0CAC0Edb9096',
    },
    decimals: 18,
    projectLink: 'https://nerve.fi/',
  },
  easy: {
    symbol: 'EASY',
    address: {
      56: '0x7C17c8bED8d14bAccE824D020f994F4880D6Ab3B',
    },
    decimals: 18,
    projectLink: 'https://easyfi.network/',
  },
  oddz: {
    symbol: 'ODDZ',
    address: {
      56: '0xCD40F2670CF58720b694968698A5514e924F742d',
    },
    decimals: 18,
    projectLink: 'https://oddz.fi/',
  },
  hoo: {
    symbol: 'HOO',
    address: {
      56: '0xE1d1F66215998786110Ba0102ef558b22224C016',
    },
    decimals: 8,
    projectLink: 'https://hoo.com/',
  },
  apys: {
    symbol: 'APYS',
    address: {
      56: '0x37dfACfaeDA801437Ff648A1559d73f4C40aAcb7',
    },
    decimals: 18,
    projectLink: 'https://apyswap.com/',
  },
  bondly: {
    symbol: 'BONDLY',
    address: {
      56: '0x96058f8C3e16576D9BD68766f3836d9A33158f89',
    },
    decimals: 18,
    projectLink: 'https://www.bondly.finance/',
  },
  tko: {
    symbol: 'TKO',
    address: {
      56: '0x9f589e3eabe42ebC94A44727b3f3531C0c877809',
    },
    decimals: 18,
    projectLink: 'https://www.tokocrypto.com/',
  },
  itam: {
    symbol: 'ITAM',
    address: {
      56: '0x04C747b40Be4D535fC83D09939fb0f626F32800B',
    },
    decimals: 18,
    projectLink: 'https://itam.network/',
  },
  arpa: {
    symbol: 'ARPA',
    address: {
      56: '0x6F769E65c14Ebd1f68817F5f1DcDb61Cfa2D6f7e',
    },
    decimals: 18,
    projectLink: 'https://arpachain.io/',
  },
  eps: {
    symbol: 'EPS',
    address: {
      56: '0xA7f552078dcC247C2684336020c03648500C6d9F',
    },
    decimals: 18,
    projectLink: 'https://ellipsis.finance/',
  },
  jgn: {
    symbol: 'JGN',
    address: {
      56: '0xC13B7a43223BB9Bf4B69BD68Ab20ca1B79d81C75',
    },
    decimals: 18,
    projectLink: 'https://jgndefi.com/',
  },
  tlm: {
    symbol: 'TLM',
    address: {
      56: '0x2222227E22102Fe3322098e4CBfE18cFebD57c95',
    },
    decimals: 4,
    projectLink: 'https://alienworlds.io/',
  },
  perl: {
    symbol: 'PERL',
    address: {
      56: '0x0F9E4D49f25de22c2202aF916B681FBB3790497B',
    },
    decimals: 18,
    projectLink: 'https://perlinx.finance/',
  },
  alpa: {
    symbol: 'ALPA',
    address: {
      56: '0xc5E6689C9c8B02be7C49912Ef19e79cF24977f03',
    },
    decimals: 18,
    projectLink: 'https://bsc.alpaca.city/',
  },
  hzn: {
    symbol: 'HZN',
    address: {
      56: '0xC0eFf7749b125444953ef89682201Fb8c6A917CD',
    },
    decimals: 18,
    projectLink: 'https://horizonprotocol.com/',
  },
  suter: {
    symbol: 'SUTER',
    address: {
      56: '0x4CfbBdfBd5BF0814472fF35C72717Bd095ADa055',
    },
    decimals: 18,
    projectLink: 'https://shield.suterusu.io/',
  },
  cgg: {
    symbol: 'CGG',
    address: {
      56: '0x1613957159E9B0ac6c80e824F7Eea748a32a0AE2',
    },
    decimals: 18,
    projectLink: 'https://chainguardians.io/',
  },
  mix: {
    symbol: 'MIX',
    address: {
      56: '0xB67754f5b4C704A24d2db68e661b2875a4dDD197',
    },
    decimals: 18,
    projectLink: 'https://mixie.chainguardians.io/',
  },
  hakka: {
    symbol: 'HAKKA',
    address: {
      56: '0x1D1eb8E8293222e1a29d2C0E4cE6C0Acfd89AaaC',
    },
    decimals: 18,
    projectLink: 'https://hakka.finance/',
  },
  xed: {
    symbol: 'XED',
    address: {
      56: '0x5621b5A3f4a8008c4CCDd1b942B121c8B1944F1f',
    },
    decimals: 18,
    projectLink: 'https://www.exeedme.com/',
  },
  τbtc: {
    symbol: 'τBTC',
    address: {
      56: '0x2cD1075682b0FCCaADd0Ca629e138E64015Ba11c',
    },
    decimals: 9,
    projectLink: 'https://www.btcst.finance/',
  },
  alpaca: {
    symbol: 'ALPACA',
    address: {
      56: '0x8F0528cE5eF7B51152A59745bEfDD91D97091d2F',
    },
    decimals: 18,
    projectLink: 'https://www.alpacafinance.org/',
  },
  dfd: {
    symbol: 'DFD',
    address: {
      56: '0x9899a98b222fCb2f3dbee7dF45d943093a4ff9ff',
    },
    decimals: 18,
    projectLink: 'https://dusd.finance/',
  },
  lmt: {
    symbol: 'LMT',
    address: {
      56: '0x9617857E191354dbEA0b714d78Bc59e57C411087',
    },
    decimals: 18,
    projectLink: 'https://lympo.io/lmt/',
  },
  btt: {
    symbol: 'BTT',
    address: {
      56: '0x8595F9dA7b868b1822194fAEd312235E43007b49',
    },
    decimals: 18,
    projectLink: 'https://www.bittorrent.com/',
  },
  trx: {
    symbol: 'TRX',
    address: {
      56: '0x85EAC5Ac2F758618dFa09bDbe0cf174e7d574D5B',
    },
    decimals: 18,
    projectLink: 'https://tron.network/',
  },
  win: {
    symbol: 'WIN',
    address: {
      56: '0xaeF0d72a118ce24feE3cD1d43d383897D05B4e99',
    },
    decimals: 18,
    projectLink: 'https://winklink.org/',
  },
  mcoin: {
    symbol: 'mCOIN',
    address: {
      56: '0x49022089e78a8D46Ec87A3AF86a1Db6c189aFA6f',
    },
    decimals: 18,
    projectLink: 'https://mirror.finance/',
  },
  math: {
    symbol: 'MATH',
    address: {
      56: '0xF218184Af829Cf2b0019F8E6F0b2423498a36983',
    },
    decimals: 18,
    projectLink: 'https://mathwallet.org/',
  },
  kun: {
    symbol: 'KUN',
    address: {
      56: '0x1A2fb0Af670D0234c2857FaD35b789F8Cb725584',
    },
    decimals: 18,
    projectLink: 'https://chemix.io/home',
  },
  qsd: {
    symbol: 'QSD',
    address: {
      56: '0x07AaA29E63FFEB2EBf59B33eE61437E1a91A3bb2',
    },
    decimals: 18,
    projectLink: 'https://chemix.io/home',
  },
  hyfi: {
    symbol: 'HYFI',
    address: {
      56: '0x9a319b959e33369C5eaA494a770117eE3e585318',
    },
    decimals: 18,
    projectLink: 'https://hyfi.pro/#/',
  },
  oin: {
    symbol: 'OIN',
    address: {
      56: '0x658E64FFcF40D240A43D52CA9342140316Ae44fA',
    },
    decimals: 8,
    projectLink: 'https://oin.finance/',
  },
  doge: {
    symbol: 'DOGE',
    address: {
      56: '0xbA2aE424d960c26247Dd6c32edC70B295c744C43',
    },
    decimals: 8,
    projectLink: 'https://dogecoin.com/',
  },
  fine: {
    symbol: 'FINE',
    address: {
      56: '0x4e6415a5727ea08aAE4580057187923aeC331227',
    },
    decimals: 18,
    projectLink: 'https://refinable.com/',
  },
  one: {
    symbol: 'ONE',
    address: {
      56: '0x04BAf95Fd4C52fd09a56D840bAEe0AB8D7357bf0',
    },
    decimals: 18,
    projectLink: 'https://www.bigone.com/',
  },
  pmon: {
    symbol: 'PMON',
    address: {
      56: '0x1796ae0b0fa4862485106a0de9b654eFE301D0b2',
    },
    decimals: 18,
    projectLink: 'https://polkamon.com/',
  },
  hotcross: {
    symbol: 'HOTCROSS',
    address: {
      56: '0x4FA7163E153419E0E1064e418dd7A99314Ed27b6',
    },
    decimals: 18,
    projectLink: 'https://www.hotcross.com/',
  },
  τdoge: {
    symbol: 'τDOGE',
    address: {
      56: '0xe550a593d09FBC8DCD557b5C88Cea6946A8b404A',
    },
    decimals: 8,
    projectLink: 'https://www.btcst.finance/',
  },
  btr: {
    symbol: 'BTR',
    address: {
      56: '0x5a16E8cE8cA316407c6E6307095dc9540a8D62B3',
    },
    decimals: 18,
    projectLink: 'https://www.bitrue.com/',
  },
  ubxt: {
    symbol: 'UBXT',
    address: {
      56: '0xBbEB90cFb6FAFa1F69AA130B7341089AbeEF5811',
    },
    decimals: 18,
    projectLink: 'https://upbots.com/',
  },
  wmass: {
    symbol: 'WMASS',
    address: {
      56: '0x7e396BfC8a2f84748701167c2d622F041A1D7a17',
    },
    decimals: 8,
    projectLink: 'https://massnet.org/en/',
  },
  rfox: {
    symbol: 'RFOX',
    address: {
      56: '0x0a3A21356793B49154Fd3BbE91CBc2A16c0457f5',
    },
    decimals: 18,
    projectLink: 'https://www.redfoxlabs.io/',
  },
  xend: {
    symbol: 'XEND',
    address: {
      56: '0x4a080377f83D669D7bB83B3184a8A5E61B500608',
    },
    decimals: 18,
    projectLink: 'https://xend.finance/',
  },
  cyc: {
    symbol: 'CYC',
    address: {
      56: '0x810EE35443639348aDbbC467b33310d2AB43c168',
    },
    decimals: 18,
    projectLink: 'https://cyclone.xyz/',
  },
  chr: {
    symbol: 'CHR',
    address: {
      56: '0xf9CeC8d50f6c8ad3Fb6dcCEC577e05aA32B224FE',
    },
    decimals: 6,
    projectLink: 'https://chromia.com/',
  },
  kalm: {
    symbol: 'KALM',
    address: {
      56: '0x4BA0057f784858a48fe351445C672FF2a3d43515',
    },
    decimals: 18,
    projectLink: 'https://kalmar.io/',
  },
  deri: {
    symbol: 'DERI',
    address: {
      56: '0xe60eaf5A997DFAe83739e035b005A33AfdCc6df5',
    },
    decimals: 18,
    projectLink: 'https://deri.finance/#/index',
  },
  well: {
    symbol: 'WELL',
    address: {
      56: '0xf07a32Eb035b786898c00bB1C64d8c6F8E7a46D5',
    },
    decimals: 18,
    projectLink: 'https://www.bitwellex.com/',
  },
  popen: {
    symbol: 'pOPEN',
    address: {
      56: '0xaBaE871B7E3b67aEeC6B46AE9FE1A91660AadAC5',
    },
    decimals: 18,
    projectLink: 'https://opendao.io/',
  },
  ez: {
    symbol: 'EZ',
    address: {
      56: '0x5512014efa6Cd57764Fa743756F7a6Ce3358cC83',
    },
    decimals: 18,
    projectLink: 'https://easyfi.network/',
  },
  vrt: {
    symbol: 'VRT',
    address: {
      56: '0x5F84ce30DC3cF7909101C69086c50De191895883',
    },
    decimals: 18,
    projectLink: 'https://venus.io/',
  },
  tusd: {
    symbol: 'TUSD',
    address: {
      56: '0x14016E85a25aeb13065688cAFB43044C2ef86784',
    },
    decimals: 18,
    projectLink: 'https://www.trueusd.com/',
  },
  mtrg: {
    symbol: 'MTRG',
    address: {
      56: '0xBd2949F67DcdC549c6Ebe98696449Fa79D988A9F',
    },
    decimals: 18,
    projectLink: 'https://www.meter.io/',
  },
  ktn: {
    symbol: 'KTN',
    address: {
      56: '0xDAe6c2A48BFAA66b43815c5548b10800919c993E',
    },
    decimals: 18,
    projectLink: 'https://kattana.io/',
  },
  qkc: {
    symbol: 'QKC',
    address: {
      56: '0xA1434F1FC3F437fa33F7a781E041961C0205B5Da',
    },
    decimals: 18,
    projectLink: 'https://quarkchain.io/',
  },
  bcfx: {
    symbol: 'bCFX',
    address: {
      56: '0x045c4324039dA91c52C55DF5D785385Aab073DcF',
    },
    decimals: 18,
    projectLink: 'https://www.confluxnetwork.org/',
  },
  mx: {
    symbol: 'MX',
    address: {
      56: '0x9F882567A62a5560d147d64871776EeA72Df41D3',
    },
    decimals: 18,
    projectLink: 'https://www.mxc.com/',
  },
  ata: {
    symbol: 'ATA',
    address: {
      56: '0xA2120b9e674d3fC3875f415A7DF52e382F141225',
    },
    decimals: 18,
    projectLink: 'https://www.ata.network/',
  },
  mbox: {
    symbol: 'MBOX',
    address: {
      56: '0x3203c9E46cA618C8C1cE5dC67e7e9D75f5da2377',
    },
    decimals: 18,
    projectLink: 'https://www.mobox.io/#/',
  },
  boring: {
    symbol: 'BORING',
    address: {
      56: '0xffEecbf8D7267757c2dc3d13D730E97E15BfdF7F',
    },
    decimals: 18,
    projectLink: 'https://www.boringdao.com/',
  },
  marsh: {
    symbol: 'MARSH',
    address: {
      56: '0x2FA5dAF6Fe0708fBD63b1A7D1592577284f52256',
    },
    decimals: 18,
    projectLink: 'https://unmarshal.io/',
  },
  crow: {
    symbol: 'CROW',
    address: {
      56: '0xcc2E12a9b5b75360c6FBf23B584c275D52cDdb0E',
    },
    decimals: 18,
    projectLink: 'https://www.crowfinance.net/',
  },
  wings: {
    symbol: 'WINGS',
    address: {
      56: '0x0487b824c8261462F88940f97053E65bDb498446',
    },
    decimals: 18,
    projectLink: 'https://jetswap.finance/',
  },
  keif: {
    symbol: 'KEIF',
    address: {
      56: '0x81bDb466317fE8E8559C67023bA5d83C37a2b098',
    },
    decimals: 9,
    projectLink: 'https://www.keifcoin.com/',
  },
  renbch: {
    symbol: 'renBCH',
    address: {
      56: '0xA164B067193bd119933e5C1e7877421FCE53D3E5',
      250: '0xc3fEd6eB39178A541D274e6Fc748d48f0Ca01CC3',
    },
    decimals: 8,
    projectLink: 'https://renproject.io/',
  },
  ice: {
    symbol: 'ICE',
    address: { 
      250: '0xf16e81dce15B08F326220742020379B855B87DF9' 
    },
    decimals: 18,
    projectLink: 'https://hyperjump.app/',
  },
  zoo: {
    symbol: 'ZOO',
    address: { 
      250: '0x09e145A1D53c0045F41aEEf25D8ff982ae74dD56' 
    },
    decimals: 0,
    projectLink: 'https://hyperjump.app/',
  },
  eswap: {
    symbol: 'ESWAP',
    address: { 
      250: '0x735aBE48e8782948a37C7765ECb76b98CdE97B0F' 
    },
    decimals: 8,
    projectLink: 'https://hyperjump.app/',
  },
  snx: {
    symbol: 'SNX',
    address: { 
      250: '0x56ee926bD8c72B2d5fa1aF4d9E4Cbb515a1E3Adc' 
    },
    decimals: 18,
    projectLink: 'https://hyperjump.app/',
  },
  cztears: {
    symbol: 'CZTEARS',
    address: { 
      250: '0x907f1A48918Bb5DE07c12443CAB0e6EEfCC611BC' 
    },
    decimals: 18,
    projectLink: 'https://hyperjump.app/',
  },
  axs: {
    symbol: 'AXS',
    address: {
      56: '0x715D400F88C167884bbCc41C5FeA407ed4D2f8A0',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://axieinfinity.com/',
  },
  curve: {
    symbol: 'CRV',
    address: { 
      97: '', 
      250: '0x1E4F97b9f9F913c46F1632781732927B9019C68b' 
    },
    decimals: 18,
    projectLink: 'https://curve.fi/',
  },
  hero: {
    symbol: 'HERO',
    address: { 
      56: '0x9B26e16377ad29A6CCC01770bcfB56DE3A36d8b2', 
      97: '', 
      250: '' 
    },
    decimals: 18,
    projectLink: 'https://www.farmhero.io/',
  },
  boo: {
    symbol: 'BOO',
    address: { 
      56: '', 
      97: '', 
      250: '0x841FAD6EAe12c286d1Fd18d1d525DFfA75C7EFFE' 
    },
    decimals: 18,
    projectLink: 'https://www.spookyswap.finance/',
  },
  wild: {
    symbol: 'WILD',
    address: { 
      56: '', 
      97: '', 
      250: '0xAe0C241Ec740309c2cbdc27456eB3C1a2aD74737' 
    },
    decimals: 18,
    projectLink: 'https://zoocoin.cash/',
  },
  krown: {
    symbol: 'KROWN',
    address: { 
      56: '0x1446f3CEdf4d86a9399E49f7937766E6De2A3AAB', 
      97: '', 
      250: '' 
    },
    decimals: 18,
    projectLink: 'https://kingdefi.io/',
  },
  atari: {
    symbol: 'ATARI',
    address: { 
      56: '', 
      97: '', 
      250: '0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b' 
    },
    decimals: 0,
    projectLink: 'https://www.atarichain.com/',
  },
  scream: {
    symbol: 'SCREAM',
    address: { 
      56: '', 
      97: '', 
      250: '0xe0654C8e6fd4D733349ac7E09f6f23DA256bF475' 
    },
    decimals: 18,
    projectLink: 'https://www.scream.sh/',
  },
  mim: {
    symbol: 'MIM',
    address: { 
      56: '', 
      97: '', 
      250: '0x82f0B8B456c1A451378467398982d4834b6829c1' 
    },
    decimals: 18,
    projectLink: 'https://abracadabra.money',
  },
  avax: {
    symbol: 'AVAX',
    address: {
      56: '0x1CE0c2827e2eF14D5C4f29a091d735A204794041',
      250: '0x511D35c52a3C244E7b8bd92c0C297755FbD89212',
    },
    decimals: 18,
    projectLink: '',
  },
  sol: {
    symbol: 'SOL',
    address: {
      56: '0x570A5D26f7765Ecb712C0924E4De545B89fD43dF',
    },
    decimals: 18,
    projectLink: 'https:www.solana.com',
  },
}

export default tokens
