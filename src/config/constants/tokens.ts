import { Token } from './types'

const tokens: Record<string, Token> = {
  bnb: {
    symbol: 'BNB',
    address: { 56: '', 250: '0xd67de0e0a0fd7b15dc8348bb9be742f3c5850454' },
    projectLink: 'https://www.binance.com/',
  },
  wftm: {
    symbol: 'WFTM',
    address: {
      250: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
    },
    decimals: 18,
    projectLink: 'https://www.fantom.foundation/',
  },
  ftm: {
    symbol: 'FTM',
    address: {
      250: '',
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
    projectLink: 'https://hyperjump.fi/',
  },
  alloy: {
    symbol: 'ALLOY',
    address: { 56: '0x5ef5994fa33ff4eb6c82d51ee1dc145c546065bd', 97: '0xC5FD6F3eB1f63082Daee9e09E17D870005962309' },
    decimals: 18,
    projectLink: 'https://hyperjump.fi/',
  },
  ori: {
    symbol: 'ORI',
    address: { 250: '0x0575f8738EFdA7F512e3654F277C77e80C7d2725' },
    decimals: 18,
    projectLink: 'https://hyperjump.fi/',
  },
  hypr: {
    symbol: 'HYPR',
    address: { 56: '0x03d6bd3d48f956d783456695698c407a46ecd54d', 97: '0x03D6BD3d48F956D783456695698C407A46ecD54d' },
    decimals: 18,
    projectLink: 'https://hyperjump.fi/',
  },
  aurora: {
    symbol: 'AURORA',
    address: { 250: '0xbc2451AaD349b6B43FD05F4F0cC327F8A6bcA2d4' },
    decimals: 18,
    projectLink: 'https://hyperjump.fi/',
  },
  mech: {
    symbol: 'MECH',
    address: {
      56: '0x3ae713c662b8852d686e718e0762631a4cb84954',
      97: '0xcba0FA601C44509e671283d071c600EFA7EdDC6a',
      250: '0x85c85647e1A79c2b8bc3Ed2B6a1DdE326eeC66c5',
    },
    decimals: 18,
    projectLink: 'https://hyperjump.fi/',
  },
  supra: {
    symbol: 'supra',
    address: { 56: '0x4ae2f11df681eec979bd93085dd1a05e9593c8c6' },
    decimals: 18,
    projectLink: 'https://hyperjump.fi/',
  },
  shilling: {
    symbol: 'shilling',
    address: { 56: '0x643B6ef6306417A0b3FA2813eb5BAf30F5dd8736' },
    decimals: 18,
    projectLink: 'https://hyperjump.fi/',
  },
  spg: {
    symbol: 'spg',
    address: { 56: '0x3aabcf53a1930a42e18d938c019e83ebee50a849' },
    decimals: 18,
    projectLink: 'https://hyperjump.fi/',
  },
  dvt: {
    symbol: 'DVT',
    address: { 56: '0xa47d132bfc00bc7b1b99238e08b91f1a08ccdbf3' },
    decimals: 18,
    projectLink: 'https://hyperjump.fi/',
  },
  btd: {
    symbol: 'BTD',
    address: { 56: '0xd1102332a213e21faf78b69c03572031f3552c33' },
    decimals: 18,
    projectLink: 'https://hyperjump.fi/',
  },
  slime: {
    symbol: 'SLIME',
    address: { 56: '0x4fcfa6cc8914ab455b5b33df916d90bfe70b6ab1' },
    decimals: 18,
    projectLink: 'https://hyperjump.fi/',
  },
  ramen: {
    symbol: 'RAMEN',
    address: { 56: '0x4f47a0d15c1e53f3d94c069c7d16977c29f9cb6b' },
    decimals: 18,
    projectLink: 'https://ramenswap.finance/',
  },
  brew: {
    symbol: 'BREW',
    address: { 56: '0x790be81c3ca0e53974be2688cdb954732c9862e1' },
    decimals: 18,
    projectLink: 'https://cafeswap.finance/',
  },
  voodoo: {
    symbol: 'VOODOO',
    address: { 56: '0x68a66a7c35e037192f6e38c766d6692d54219e6d' },
    decimals: 18,
    projectLink: 'https://voodoo.supra.finance/',
  },
  oil: {
    symbol: 'OIL',
    address: { 56: '0xb1b17dff66d75b29d34f0bf8622c406d8219b507' },
    decimals: 18,
    projectLink: 'https://crudeoil.finance/',
  },
  innbc: {
    symbol: 'INNBC',
    address: { 97: '0xdf1f0026374d4bcc490be5e316963cf6df2fff19', 56: '0xdf1f0026374d4bcc490be5e316963cf6df2fff19' },
    decimals: 18,
    projectLink: 'https://www.innovativebioresearch.com/',
  },
  soak: {
    symbol: 'SOAK',
    address: { 97: '0x849233ff1aea15d80ef658b2871664c9ca994063', 56: '0x849233ff1aea15d80ef658b2871664c9ca994063' },
    decimals: 18,
    projectLink: 'https://sponge.finance/',
  },
  hps: {
    symbol: 'HPS',
    address: { 56: '0xeda21b525ac789eab1a08ef2404dd8505ffb973d' },
    decimals: 18,
    projectLink: 'https://hyperjump.fi/',
  },
  bhc: {
    symbol: 'BHC',
    address: { 56: '0x6fd7c98458a943f469e1cf4ea85b173f5cd342f4' },
    decimals: 18,
    projectLink: 'https://hyperjump.fi/',
  },
  ont: {
    symbol: 'ONT',
    address: { 56: '0xfd7b3a77848f1c2d67e05e54d78d174a0c850335' },
    decimals: 18,
    projectLink: 'https://ont.io/',
  },
  sphn: {
    symbol: 'SPHN',
    address: { 56: '0xb58a579e8f987b52564a5fe08fe5181dc2621a9c' },
    decimals: 18,
    projectLink: 'https://siphon.finance/',
  },
  bfi: {
    symbol: 'BFI',
    address: { 56: '0x81859801b01764D4f0Fa5E64729f5a6C3b91435b' },
    decimals: 18,
    projectLink: 'https://hyperjump.fi/',
  },
  sbdo: {
    symbol: 'sBDO',
    address: { 56: '0x0d9319565be7f53CeFE84Ad201Be3f40feAE2740' },
    decimals: 18,
    projectLink: 'https://hyperjump.fi/',
  },
  auto: {
    symbol: 'AUTO',
    address: { 56: '0xa184088a740c695E156F91f5cC086a06bb78b827' },
    decimals: 18,
    projectLink: 'https://hyperjump.fi/',
  },
  lusd: {
    symbol: 'lUSD',
    address: { 56: '0x23e8a70534308a4AAF76fb8C32ec13d17a3BD89e' },
    decimals: 18,
    projectLink: 'https://hyperjump.fi/',
  },
  renbtc: {
    symbol: 'renBTC',
    address: {
      56: '0xfCe146bF3146100cfe5dB4129cf6C82b0eF4Ad8c',
      250: '0xDBf31dF14B66535aF65AaC99C32e9eA844e14501',
    },
    decimals: 8,
    projectLink: 'https://hyperjump.fi/',
  },
  rendoge: {
    symbol: 'renDOGE',
    address: { 56: '0xc3fEd6eB39178A541D274e6Fc748d48f0Ca01CC3' },
    decimals: 8,
    projectLink: 'https://hyperjump.fi/',
  },
  anymtlx: {
    symbol: 'anyMTLX',
    address: { 56: '0x5921DEE8556c4593EeFCFad3CA5e2f618606483b' },
    decimals: 18,
    projectLink: 'https://hyperjump.fi/',
  },
  renzec: {
    symbol: 'renZEC',
    address: {
      56: '0x695FD30aF473F2960e81Dc9bA7cB67679d35EDb7',
      250: '0x31a0D1A199631D244761EEba67e8501296d2E383',
    },
    decimals: 8,
    projectLink: 'https://hyperjump.fi/',
  },
  tpt: {
    symbol: 'TPT',
    address: { 56: '0xECa41281c24451168a37211F0bc2b8645AF45092' },
    decimals: 4,
    projectLink: 'https://hyperjump.fi/',
  },
  bel: {
    symbol: 'BEL',
    address: { 56: '0x8443f091997f06a61670B735ED92734F5628692F' },
    decimals: 18,
    projectLink: 'https://hyperjump.fi/',
  },
  dexe: {
    symbol: 'DEXE',
    address: { 56: '0x039cB485212f996A9DBb85A9a75d898F94d38dA6' },
    decimals: 18,
    projectLink: 'https://hyperjump.fi/',
  },
  ramp: {
    symbol: 'RAMP',
    address: { 56: '0x8519EA49c997f50cefFa444d240fB655e89248Aa' },
    decimals: 18,
    projectLink: 'https://hyperjump.fi/',
  },
  belt: {
    symbol: 'BELT',
    address: { 56: '0xE0e514c71282b6f4e823703a39374Cf58dc3eA4f' },
    decimals: 18,
    projectLink: 'https://hyperjump.fi/',
  },
  bat: {
    symbol: 'BAT',
    address: { 56: '0x101d82428437127bF1608F699CD651e6Abf9766E' },
    decimals: 18,
    projectLink: 'https://hyperjump.fi/',
  },
  bux: {
    symbol: 'BUX',
    address: { 56: '0x211FfbE424b90e25a15531ca322adF1559779E45' },
    decimals: 18,
    projectLink: 'https://hyperjump.fi/',
  },
  for: {
    symbol: 'FOR',
    address: { 56: '0x658A109C5900BC6d2357c87549B651670E5b0539' },
    decimals: 18,
    projectLink: 'https://hyperjump.fi/',
  },
  alice: {
    symbol: 'ALICE',
    address: { 56: '0xAC51066d7bEC65Dc4589368da368b212745d63E8' },
    decimals: 6,
    projectLink: 'https://hyperjump.fi/',
  },
  bunny: {
    symbol: 'BUNNY',
    address: { 56: '0xC9849E6fdB743d08fAeE3E34dd2D1bc69EA11a51' },
    decimals: 18,
    projectLink: 'https://hyperjump.fi/',
  },
  beluga: {
    symbol: 'BELUGA',
    address: { 56: '0x181dE8C57C4F25eBA9Fd27757BBd11Cc66a55d31' },
    decimals: 18,
    projectLink: 'https://app.beluga.fi/',
  },
  gfce: {
    symbol: 'GFCE',
    address: { 56: '0x94BaBBE728D9411612Ee41b20241a6FA251b26Ce' },
    decimals: 9,
    projectLink: 'https://jetfuel.finance/gforce/g-force',
  },
  treat: {
    symbol: 'TREAT',
    address: { 56: '0xac0C7d9B063eD2C0946982dDB378e03886C064E6' },
    decimals: 18,
    projectLink: 'https://treatdao.com/',
  },
  xblzd: {
    symbol: 'xBLZD',
    address: { 56: '0x9a946c3Cb16c08334b69aE249690C236Ebd5583E' },
    decimals: 18,
    projectLink: 'https://www.blizzard.money/',
  },
  soul: {
    symbol: 'SOUL',
    address: { 56: '0x67d012F731c23F0313CEA1186d0121779c77fcFE' },
    decimals: 8,
    projectLink: 'http://apoyield.com/',
  },
  brn: {
    symbol: 'BRN',
    address: { 56: '0x5749085C36A521f71AD2050Cb600B2165aabdF68' },
    decimals: 8,
    projectLink: 'https://www.brainaut.net/',
  },
  banana: {
    symbol: 'BANANA',
    address: { 56: '0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95' },
    decimals: 18,
    projectLink: 'https://apeswap.finance/',
  },
  pmp: {
    symbol: 'PMP',
    address: { 56: '0x8d4FBB3AC63bf33851dCE80D63613Df1A515BC00' },
    decimals: 18,
    projectLink: 'https://pumpy.farm/',
  },
  milk2: {
    symbol: 'MILK2',
    address: { 56: '0x4A5a34212404f30C5aB7eB61b078fA4A55AdC5a5' },
    decimals: 18,
    projectLink: 'https://spaceswap.app/',
  },
  grand: {
    symbol: 'GRAND',
    address: { 56: '0xeE814F5B2bF700D2e843Dc56835D28d095161dd9' },
    decimals: 18,
    projectLink: 'https://www.thegrandbanks.finance/#/',
  },
  fts: {
    symbol: 'FTS',
    address: { 56: '0x4437743ac02957068995c48E08465E0EE1769fBE' },
    decimals: 18,
    projectLink: 'https://hyperjump.fi/',
  },
  naut: {
    symbol: 'NAUT',
    address: { 56: '0x05B339B0A346bF01f851ddE47a5d485c34FE220c' },
    decimals: 8,
    projectLink: 'https://astronaut.to/',
  },
  ccbd: {
    symbol: 'cCBD',
    address: { 56: '0x131DEd61462cb0f8034656D9294F79247f72Ad0b' },
    decimals: 18,
    projectLink: 'https://cbd-cash.io/',
  },
  scbd: {
    symbol: 'sCBD',
    address: { 56: '0x7a0fFA3db812701e711fc38eacb99675352f31be' },
    decimals: 18,
    projectLink: 'https://cbd-cash.io/',
  },
  shililng: {
    symbol: 'SHILILNG',
    address: { 56: '0x643B6ef6306417A0b3FA2813eb5BAf30F5dd8736' },
    decimals: 18,
    projectLink: 'https://hyperjump.fi/',
  },
  cake: {
    symbol: 'CAKE',
    address: {
      56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
      97: '0xa35062141Fa33BCA92Ce69FeD37D0E8908868AAe',
    },
    decimals: 18,
    projectLink: 'https://pancakeswap.finance/',
  },
  txl: {
    symbol: 'TXL',
    address: {
      56: '0x1ffd0b47127fdd4097e54521c9e2c7f0d66aafc5',
    },
    decimals: 18,
    projectLink: 'https://tixl.org/',
  },
  nuls: {
    symbol: 'NULS',
    address: {
      56: '0x8cd6e29d3686d24d3c2018cee54621ea0f89313b',
    },
    decimals: 8,
    projectLink: 'https://www.nuls.io/',
  },
  watch: {
    symbol: 'WATCH',
    address: {
      56: '0x7a9f28eb62c791422aa23ceae1da9c847cbec9b0',
    },
    decimals: 18,
    projectLink: 'https://yieldwatch.net/',
  },
  xmark: {
    symbol: 'xMARK',
    address: {
      56: '0x26a5dfab467d4f58fb266648cae769503cec9580',
    },
    decimals: 9,
    projectLink: 'https://benchmarkprotocol.finance/',
  },
  bmxx: {
    symbol: 'bMXX',
    address: {
      56: '0x4131b87f74415190425ccd873048c708f8005823',
    },
    decimals: 18,
    projectLink: 'https://multiplier.finance/',
  },
  iotx: {
    symbol: 'IOTX',
    address: {
      56: '0x9678e42cebeb63f23197d726b29b1cb20d0064e5',
    },
    decimals: 18,
    projectLink: 'https://iotex.io/',
  },
  bor: {
    symbol: 'BOR',
    address: {
      56: '0x92d7756c60dcfd4c689290e8a9f4d263b3b32241',
    },
    decimals: 18,
    projectLink: 'https://www.boringdao.com/',
  },
  bopen: {
    symbol: 'bOPEN',
    address: {
      56: '0xf35262a9d427f96d2437379ef090db986eae5d42',
    },
    decimals: 18,
    projectLink: 'https://opendao.io/',
  },
  dodo: {
    symbol: 'DODO',
    address: {
      56: '0x67ee3cb086f8a16f34bee3ca72fad36f7db929e2',
    },
    decimals: 18,
    projectLink: 'https://dodoex.io/',
  },
  swingby: {
    symbol: 'SWINGBY',
    address: {
      56: '0x71de20e0c4616e7fcbfdd3f875d568492cbe4739',
    },
    decimals: 18,
    projectLink: 'https://swingby.network/',
  },
  bry: {
    symbol: 'BRY',
    address: {
      56: '0xf859bf77cbe8699013d6dbc7c2b926aaf307f830',
    },
    decimals: 18,
    projectLink: 'https://berrydata.co/',
  },
  zee: {
    symbol: 'ZEE',
    address: {
      56: '0x44754455564474a89358b2c2265883df993b12f0',
    },
    decimals: 18,
    projectLink: 'https://zeroswap.io/',
  },
  swgb: {
    symbol: 'SWGb',
    address: {
      56: '0xe40255c5d7fa7ceec5120408c78c787cecb4cfdb',
    },
    decimals: 18,
    projectLink: 'https://swirgepay.com/',
  },
  swg: {
    symbol: 'SWG',
    address: {
      56: '0xe792f64c582698b8572aaf765bdc426ac3aefb6b',
    },
    decimals: 18,
    projectLink: 'https://swirgepay.com/',
  },
  sfp: {
    symbol: 'SFP',
    address: {
      56: '0xd41fdb03ba84762dd66a0af1a6c8540ff1ba5dfb',
    },
    decimals: 18,
    projectLink: 'https://www.safepal.io/',
  },
  lina: {
    symbol: 'LINA',
    address: {
      56: '0x762539b45a1dcce3d36d080f74d1aed37844b878',
    },
    decimals: 18,
    projectLink: 'https://linear.finance/',
  },
  lit: {
    symbol: 'LIT',
    address: {
      56: '0xb59490ab09a0f526cc7305822ac65f2ab12f9723',
    },
    decimals: 18,
    projectLink: 'https://www.litentry.com/',
  },
  hget: {
    symbol: 'HGET',
    address: {
      56: '0xc7d8d35eba58a0935ff2d5a33df105dd9f071731',
    },
    decimals: 6,
    projectLink: 'https://www.hedget.com/',
  },
  bdo: {
    symbol: 'BDO',
    address: {
      56: '0x190b589cf9fb8ddeabbfeae36a813ffb2a702454',
    },
    decimals: 18,
    projectLink: 'https://bdollar.fi/',
  },
  egld: {
    symbol: 'EGLD',
    address: {
      56: '0xbf7c81fff98bbe61b40ed186e4afd6ddd01337fe',
    },
    decimals: 18,
    projectLink: 'https://elrond.com/',
  },
  ust: {
    symbol: 'UST',
    address: {
      56: '0x23396cf899ca06c4472205fc903bdb4de249d6fc',
    },
    decimals: 18,
    projectLink: 'https://mirror.finance/',
  },
  wsote: {
    symbol: 'wSOTE',
    address: {
      56: '0x541e619858737031a1244a5d0cd47e5ef480342c',
    },
    decimals: 18,
    projectLink: 'https://soteria.finance/#/',
  },
  front: {
    symbol: 'FRONT',
    address: {
      56: '0x928e55dab735aa8260af3cedada18b5f70c72f1b',
    },
    decimals: 18,
    projectLink: 'https://frontier.xyz/',
  },
  helmet: {
    symbol: 'Helmet',
    address: {
      56: '0x948d2a81086a075b3130bac19e4c6dee1d2e3fe8',
    },
    decimals: 18,
    projectLink: 'https://www.helmet.insure/',
  },
  btcst: {
    symbol: 'BTCST',
    address: {
      56: '0x78650b139471520656b9e7aa7a5e9276814a38e9',
    },
    decimals: 17,
    projectLink: 'https://www.1-b.tc/',
  },
  bscx: {
    symbol: 'BSCX',
    address: {
      56: '0x5ac52ee5b2a633895292ff6d8a89bb9190451587',
    },
    decimals: 18,
    projectLink: 'https://bscex.org/',
  },
  ten: {
    symbol: 'TEN',
    address: {
      56: '0xdff8cb622790b7f92686c722b02cab55592f152c',
    },
    decimals: 18,
    projectLink: 'https://www.tenet.farm/',
  },
  balbt: {
    symbol: 'bALBT',
    address: {
      56: '0x72faa679e1008ad8382959ff48e392042a8b06f7',
    },
    decimals: 18,
    projectLink: 'https://allianceblock.io/',
  },
  asr: {
    symbol: 'ASR',
    address: {
      56: '0x80d5f92c2c8c682070c95495313ddb680b267320',
    },
    decimals: 2,
    projectLink: 'https://www.chiliz.com',
  },
  atm: {
    symbol: 'ATM',
    address: {
      56: '0x25e9d05365c867e59c1904e7463af9f312296f9e',
    },
    decimals: 2,
    projectLink: 'https://www.chiliz.com',
  },
  og: {
    symbol: 'OG',
    address: {
      56: '0xf05e45ad22150677a017fbd94b84fbb63dc9b44c',
    },
    decimals: 2,
    projectLink: 'https://www.chiliz.com',
  },
  reef: {
    symbol: 'REEF',
    address: {
      56: '0xf21768ccbc73ea5b6fd3c687208a7c2def2d966e',
    },
    decimals: 18,
    projectLink: 'https://reef.finance/',
  },
  ditto: {
    symbol: 'DITTO',
    address: {
      56: '0x233d91a0713155003fc4dce0afa871b508b3b715',
    },
    decimals: 9,
    projectLink: 'https://ditto.money/',
  },
  xditto: {
    symbol: 'xDITTO',
    address: {
      56: '0xb0a1de764a033a76f28e821fbe402edbfee937db',
    },
    decimals: 9,
    projectLink: 'https://ditto.money/',
  },
  juv: {
    symbol: 'JUV',
    address: {
      56: '0xc40c9a843e1c6d01b7578284a9028854f6683b1b',
    },
    decimals: 2,
    projectLink: 'https://www.chiliz.com',
  },
  psg: {
    symbol: 'PSG',
    address: {
      56: '0xbc5609612b7c44bef426de600b5fd1379db2ecf1',
    },
    decimals: 2,
    projectLink: 'https://www.chiliz.com',
  },
  vai: {
    symbol: 'VAI',
    address: {
      56: '0x4bd17003473389a42daf6a0a729f6fdb328bbbd7',
    },
    decimals: 18,
    projectLink: 'https://venus.io/',
  },
  wbnb: {
    symbol: 'wBNB',
    address: {
      56: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
      97: '0xae13d989dac2f0debff460ac112a837c89baa7cd',
    },
    decimals: 18,
    projectLink: 'https://hyperjump.fi/',
  },
  blink: {
    symbol: 'BLINK',
    address: {
      56: '0x63870a18b6e42b01ef1ad8a2302ef50b7132054f',
    },
    decimals: 6,
    projectLink: 'https://blink.wink.org',
  },
  unfi: {
    symbol: 'UNFI',
    address: {
      56: '0x728c5bac3c3e370e372fc4671f9ef6916b814d8b',
    },
    decimals: 18,
    projectLink: 'https://unifiprotocol.com',
  },
  twt: {
    symbol: 'TWT',
    address: {
      56: '0x4b0f1812e5df2a09796481ff14017e6005508003',
    },
    decimals: 18,
    projectLink: 'https://trustwallet.com/',
  },
  hard: {
    symbol: 'HARD',
    address: {
      56: '0xf79037f6f6be66832de4e7516be52826bc3cbcc4',
    },
    decimals: 6,
    projectLink: 'https://hard.kava.io',
  },
  broobee: {
    symbol: 'bROOBEE',
    address: {
      56: '0xe64f5cb844946c1f102bd25bbd87a5ab4ae89fbe',
    },
    decimals: 18,
    projectLink: 'https://roobee.io/',
  },
  stax: {
    symbol: 'STAX',
    address: {
      56: '0x0da6ed8b13214ff28e9ca979dd37439e8a88f6c4',
    },
    decimals: 18,
    projectLink: 'http://stablexswap.com/',
  },
  nar: {
    symbol: 'NAR',
    address: {
      56: '0xa1303e6199b319a891b79685f0537d289af1fc83',
    },
    decimals: 18,
    projectLink: 'https://narwhalswap.org/',
  },
  nya: {
    symbol: 'NYA',
    address: {
      56: '0xbfa0841f7a90c4ce6643f651756ee340991f99d5',
    },
    decimals: 18,
    projectLink: 'https://nyanswop.org/',
  },
  ctk: {
    symbol: 'CTK',
    address: {
      56: '0xa8c2b8eec3d368c0253ad3dae65a5f2bbb89c929',
    },
    decimals: 6,
    projectLink: 'https://www.certik.foundation/',
  },
  inj: {
    symbol: 'INJ',
    address: {
      56: '0xa2b726b1145a4773f68593cf171187d8ebe4d495',
    },
    decimals: 18,
    projectLink: 'https://injectiveprotocol.com/',
  },
  sxp: {
    symbol: 'SXP',
    address: {
      56: '0x47bead2563dcbf3bf2c9407fea4dc236faba485a',
    },
    decimals: 18,
    projectLink: 'https://swipe.io/',
  },
  alpha: {
    symbol: 'ALPHA',
    address: {
      56: '0xa1faa113cbe53436df28ff0aee54275c13b40975',
    },
    decimals: 18,
    projectLink: 'https://alphafinance.io/',
  },
  xvs: {
    symbol: 'XVS',
    address: {
      56: '0xcf6bb5389c92bdda8a3747ddb454cb7a64626c63',
    },
    decimals: 18,
    projectLink: 'https://venus.io/',
  },
  sushi: {
    symbol: 'SUSHI',
    address: {
      56: '0x947950bcc74888a40ffa2593c5798f11fc9124c4',
      250: '0xae75a438b2e0cb8bb01ec1e1e376de11d44477cc',
    },
    decimals: 18,
    projectLink: 'https://sushi.com/',
  },
  comp: {
    symbol: 'COMP',
    address: {
      56: '0x52ce071bd9b1c4b00a0b92d298c512478cad67e8',
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
    projectLink: 'https://hyperjump.fi/',
  },
  bifi: {
    symbol: 'BIFI',
    address: {
      56: '0xca3f508b8e4dd382ee878a314789373d80a5190a',
    },
    decimals: 18,
    projectLink: 'https://beefy.finance/',
  },
  dusk: {
    symbol: 'DUSK',
    address: {
      56: '0xb2bd0749dbe21f623d9baba856d3b0f0e1bfec9c',
    },
    decimals: 18,
    projectLink: 'https://dusk.network/',
  },
  busd: {
    symbol: 'BUSD',
    address: {
      56: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      97: '0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee',
    },
    decimals: 18,
    projectLink: 'https://www.paxos.com/busd/',
  },
  eth: {
    symbol: 'ETH',
    address: {
      56: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
      250: '0x74b23882a30290451a17c44f4f05243b6b58c76d',
    },
    decimals: 18,
    projectLink: 'https://ethereum.org/en/',
  },
  beth: {
    symbol: 'BETH',
    address: {
      56: '0x250632378e573c6be1ac2f97fcdf00515d0aa91b',
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
      56: '0x4338665cbb7b2485a8855a139b75d5e34ab0db94',
    },
    decimals: 18,
    projectLink: 'https://litecoin.org/',
  },
  usdc: {
    symbol: 'USDC',
    address: {
      56: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      250: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
    },
    decimals: 6,
    projectLink: 'https://www.centre.io/usdc',
  },
  dai: {
    symbol: 'DAI',
    address: {
      56: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
      250: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e',
    },
    decimals: 18,
    projectLink: 'http://www.makerdao.com/',
  },
  ada: {
    symbol: 'ADA',
    address: {
      56: '0x3ee2200efb3400fabb9aacf31297cbdd1d435d47',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://www.cardano.org/',
  },
  band: {
    symbol: 'BAND',
    address: {
      56: '0xad6caeb32cd2c308980a548bd0bc5aa4306c6c18',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://bandprotocol.com/',
  },
  dot: {
    symbol: 'DOT',
    address: {
      56: '0x7083609fce4d1d8dc0c979aab8c869ea2c873402',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://polkadot.network/',
  },
  eos: {
    symbol: 'EOS',
    address: {
      56: '0x56b6fb708fc5732dec1afc8d8556423a2edccbd6',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://eos.io/',
  },
  link: {
    symbol: 'LINK',
    address: {
      56: '0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      250: '0xb3654dc3d10ea7645f8319668e8f54d2574fbdc8',
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
      56: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://bitcoin.org/',
  },
  btc: {
    symbol: 'BTC',
    address: { 97: '', 250: '0x321162cd933e2be498cd2267a90534a804051b11' },
    decimals: 8,
    projectLink: 'https://hyperjump.fi/',
  },
  xrp: {
    symbol: 'XRP',
    address: {
      56: '0x1d2f0da169ceb9fc7b3144628db156f3f6c60dbe',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://ripple.com/xrp/',
  },
  atom: {
    symbol: 'ATOM',
    address: {
      56: '0x0eb3a705fc54725037cc9e008bdede697f62f335',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://cosmos.network/',
  },
  yfii: {
    symbol: 'YFII',
    address: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0x7f70642d88cf1c4a3a7abb072b53b929b653eda5',
    },
    decimals: 18,
    projectLink: 'https://dfi.money/#/',
  },
  xtz: {
    symbol: 'XTZ',
    address: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0x16939ef78684453bfdfb47825f8a5f714f12623a',
    },
    decimals: 18,
    projectLink: 'https://www.tezos.com/',
  },
  bch: {
    symbol: 'BCH',
    address: {
      56: '0x8ff795a6f4d97e7887c79bea79aba5cc76444adf',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'http://bch.info/',
  },
  yfi: {
    symbol: 'YFI',
    address: {
      56: '0x88f1a5ae2a3bf98aeaf342d26b30a79438c9142e',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      250: '0x29b0da86e484e1c0029b56e817912d778ac0ec69',
    },
    decimals: 18,
    projectLink: 'https://yearn.finance/',
  },
  uni: {
    symbol: 'UNI',
    address: {
      56: '0xbf5140a22578168fd562dccf235e5d43a02ce9b1',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://uniswap.org/',
  },
  fil: {
    symbol: 'FIL',
    address: {
      56: '0x0d8ce2a99bb6e3b7db580ed848240e4a0f9ae153',
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
      56: '0xae9269f27437f0fcbc232d39ec814844a51d6b8f',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://burgerswap.org/',
  },
  bdigg: {
    symbol: 'bDIGG',
    address: {
      56: '0x5986d5c77c65e5801a5caa4fae80089f870a71da',
    },
    decimals: 18,
    projectLink: 'https://badger.finance/',
  },
  bbadger: {
    symbol: 'bBadger',
    address: {
      56: '0x1f7216fdb338247512ec99715587bb97bbf96eae',
    },
    decimals: 18,
    projectLink: 'https://badger.finance/',
  },
  trade: {
    symbol: 'TRADE',
    address: {
      56: '0x7af173f350d916358af3e218bdf2178494beb748',
    },
    decimals: 18,
    projectLink: 'https://unitrade.app/',
  },
  pnt: {
    symbol: 'PNT',
    address: {
      56: '0xdaacb0ab6fb34d24e8a67bfa14bf4d95d4c7af92',
    },
    decimals: 18,
    projectLink: 'https://ptokens.io/',
  },
  mir: {
    symbol: 'MIR',
    address: {
      56: '0x5b6dcf557e2abe2323c48445e8cc948910d8c2c9',
    },
    decimals: 18,
    projectLink: 'https://mirror.finance/',
  },
  pbtc: {
    symbol: 'pBTC',
    address: {
      56: '0xed28a457a5a76596ac48d87c0f577020f6ea1c4c',
    },
    decimals: 18,
    projectLink: 'https://ptokens.io/',
  },
  lto: {
    symbol: 'LTO',
    address: {
      56: '0x857b222fc79e1cbbf8ca5f78cb133d1b7cf34bbd',
    },
    decimals: 18,
    projectLink: 'https://ltonetwork.com/',
  },
  pcws: {
    symbol: 'pCWS',
    address: {
      56: '0xbcf39f0edda668c58371e519af37ca705f2bfcbd',
    },
    decimals: 18,
    projectLink: 'https://game.seascape.network/',
  },
  zil: {
    symbol: 'ZIL',
    address: {
      56: '0xb86abcb37c3a4b64f74f59301aff131a1becc787',
    },
    decimals: 12,
    projectLink: 'https://www.zilliqa.com/',
  },
  lien: {
    symbol: 'LIEN',
    address: {
      56: '0x5d684adaf3fcfe9cfb5cede3abf02f0cdd1012e3',
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
      56: '0x3fda9383a84c05ec8f7630fe10adf1fac13241cc',
    },
    decimals: 18,
    projectLink: 'https://bsc.dego.finance/home',
  },
  nrv: {
    symbol: 'NRV',
    address: {
      56: '0x42f6f551ae042cbe50c739158b4f0cac0edb9096',
    },
    decimals: 18,
    projectLink: 'https://nerve.fi/',
  },
  easy: {
    symbol: 'EASY',
    address: {
      56: '0x7c17c8bed8d14bacce824d020f994f4880d6ab3b',
    },
    decimals: 18,
    projectLink: 'https://easyfi.network/',
  },
  oddz: {
    symbol: 'ODDZ',
    address: {
      56: '0xcd40f2670cf58720b694968698a5514e924f742d',
    },
    decimals: 18,
    projectLink: 'https://oddz.fi/',
  },
  hoo: {
    symbol: 'HOO',
    address: {
      56: '0xe1d1f66215998786110ba0102ef558b22224c016',
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
      56: '0x96058f8c3e16576d9bd68766f3836d9a33158f89',
    },
    decimals: 18,
    projectLink: 'https://www.bondly.finance/',
  },
  tko: {
    symbol: 'TKO',
    address: {
      56: '0x9f589e3eabe42ebc94a44727b3f3531c0c877809',
    },
    decimals: 18,
    projectLink: 'https://www.tokocrypto.com/',
  },
  itam: {
    symbol: 'ITAM',
    address: {
      56: '0x04c747b40be4d535fc83d09939fb0f626f32800b',
    },
    decimals: 18,
    projectLink: 'https://itam.network/',
  },
  arpa: {
    symbol: 'ARPA',
    address: {
      56: '0x6f769e65c14ebd1f68817f5f1dcdb61cfa2d6f7e',
    },
    decimals: 18,
    projectLink: 'https://arpachain.io/',
  },
  eps: {
    symbol: 'EPS',
    address: {
      56: '0xa7f552078dcc247c2684336020c03648500c6d9f',
    },
    decimals: 18,
    projectLink: 'https://ellipsis.finance/',
  },
  jgn: {
    symbol: 'JGN',
    address: {
      56: '0xc13b7a43223bb9bf4b69bd68ab20ca1b79d81c75',
    },
    decimals: 18,
    projectLink: 'https://jgndefi.com/',
  },
  tlm: {
    symbol: 'TLM',
    address: {
      56: '0x2222227e22102fe3322098e4cbfe18cfebd57c95',
    },
    decimals: 4,
    projectLink: 'https://alienworlds.io/',
  },
  perl: {
    symbol: 'PERL',
    address: {
      56: '0x0f9e4d49f25de22c2202af916b681fbb3790497b',
    },
    decimals: 18,
    projectLink: 'https://perlinx.finance/',
  },
  alpa: {
    symbol: 'ALPA',
    address: {
      56: '0xc5e6689c9c8b02be7c49912ef19e79cf24977f03',
    },
    decimals: 18,
    projectLink: 'https://bsc.alpaca.city/',
  },
  hzn: {
    symbol: 'HZN',
    address: {
      56: '0xc0eff7749b125444953ef89682201fb8c6a917cd',
    },
    decimals: 18,
    projectLink: 'https://horizonprotocol.com/',
  },
  suter: {
    symbol: 'SUTER',
    address: {
      56: '0x4cfbbdfbd5bf0814472ff35c72717bd095ada055',
    },
    decimals: 18,
    projectLink: 'https://shield.suterusu.io/',
  },
  cgg: {
    symbol: 'CGG',
    address: {
      56: '0x1613957159e9b0ac6c80e824f7eea748a32a0ae2',
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
      56: '0x1d1eb8e8293222e1a29d2c0e4ce6c0acfd89aaac',
    },
    decimals: 18,
    projectLink: 'https://hakka.finance/',
  },
  xed: {
    symbol: 'XED',
    address: {
      56: '0x5621b5a3f4a8008c4ccdd1b942b121c8b1944f1f',
    },
    decimals: 18,
    projectLink: 'https://www.exeedme.com/',
  },
  τbtc: {
    symbol: 'τBTC',
    address: {
      56: '0x2cd1075682b0fccaadd0ca629e138e64015ba11c',
    },
    decimals: 9,
    projectLink: 'https://www.btcst.finance/',
  },
  alpaca: {
    symbol: 'ALPACA',
    address: {
      56: '0x8f0528ce5ef7b51152a59745befdd91d97091d2f',
    },
    decimals: 18,
    projectLink: 'https://www.alpacafinance.org/',
  },
  dfd: {
    symbol: 'DFD',
    address: {
      56: '0x9899a98b222fcb2f3dbee7df45d943093a4ff9ff',
    },
    decimals: 18,
    projectLink: 'https://dusd.finance/',
  },
  lmt: {
    symbol: 'LMT',
    address: {
      56: '0x9617857e191354dbea0b714d78bc59e57c411087',
    },
    decimals: 18,
    projectLink: 'https://lympo.io/lmt/',
  },
  btt: {
    symbol: 'BTT',
    address: {
      56: '0x8595f9da7b868b1822194faed312235e43007b49',
    },
    decimals: 18,
    projectLink: 'https://www.bittorrent.com/',
  },
  trx: {
    symbol: 'TRX',
    address: {
      56: '0x85eac5ac2f758618dfa09bdbe0cf174e7d574d5b',
    },
    decimals: 18,
    projectLink: 'https://tron.network/',
  },
  win: {
    symbol: 'WIN',
    address: {
      56: '0xaef0d72a118ce24fee3cd1d43d383897d05b4e99',
    },
    decimals: 18,
    projectLink: 'https://winklink.org/',
  },
  mcoin: {
    symbol: 'mCOIN',
    address: {
      56: '0x49022089e78a8d46ec87a3af86a1db6c189afa6f',
    },
    decimals: 18,
    projectLink: 'https://mirror.finance/',
  },
  math: {
    symbol: 'MATH',
    address: {
      56: '0xf218184af829cf2b0019f8e6f0b2423498a36983',
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
      56: '0xba2ae424d960c26247dd6c32edc70b295c744c43',
    },
    decimals: 8,
    projectLink: 'https://dogecoin.com/',
  },
  fine: {
    symbol: 'FINE',
    address: {
      56: '0x4e6415a5727ea08aae4580057187923aec331227',
    },
    decimals: 18,
    projectLink: 'https://refinable.com/',
  },
  one: {
    symbol: 'ONE',
    address: {
      56: '0x04baf95fd4c52fd09a56d840baee0ab8d7357bf0',
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
      56: '0xe550a593d09fbc8dcd557b5c88cea6946a8b404a',
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
      56: '0xbbeb90cfb6fafa1f69aa130b7341089abeef5811',
    },
    decimals: 18,
    projectLink: 'https://upbots.com/',
  },
  wmass: {
    symbol: 'WMASS',
    address: {
      56: '0x7e396bfc8a2f84748701167c2d622f041a1d7a17',
    },
    decimals: 8,
    projectLink: 'https://massnet.org/en/',
  },
  rfox: {
    symbol: 'RFOX',
    address: {
      56: '0x0a3a21356793b49154fd3bbe91cbc2a16c0457f5',
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
      56: '0x810ee35443639348adbbc467b33310d2ab43c168',
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
      56: '0xf07a32eb035b786898c00bb1c64d8c6f8e7a46d5',
    },
    decimals: 18,
    projectLink: 'https://www.bitwellex.com/',
  },
  popen: {
    symbol: 'pOPEN',
    address: {
      56: '0xabae871b7e3b67aeec6b46ae9fe1a91660aadac5',
    },
    decimals: 18,
    projectLink: 'https://opendao.io/',
  },
  ez: {
    symbol: 'EZ',
    address: {
      56: '0x5512014efa6cd57764fa743756f7a6ce3358cc83',
    },
    decimals: 18,
    projectLink: 'https://easyfi.network/',
  },
  vrt: {
    symbol: 'VRT',
    address: {
      56: '0x5f84ce30dc3cf7909101c69086c50de191895883',
    },
    decimals: 18,
    projectLink: 'https://venus.io/',
  },
  tusd: {
    symbol: 'TUSD',
    address: {
      56: '0x14016e85a25aeb13065688cafb43044c2ef86784',
    },
    decimals: 18,
    projectLink: 'https://www.trueusd.com/',
  },
  mtrg: {
    symbol: 'MTRG',
    address: {
      56: '0xbd2949f67dcdc549c6ebe98696449fa79d988a9f',
    },
    decimals: 18,
    projectLink: 'https://www.meter.io/',
  },
  ktn: {
    symbol: 'KTN',
    address: {
      56: '0xdae6c2a48bfaa66b43815c5548b10800919c993e',
    },
    decimals: 18,
    projectLink: 'https://kattana.io/',
  },
  qkc: {
    symbol: 'QKC',
    address: {
      56: '0xa1434f1fc3f437fa33f7a781e041961c0205b5da',
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
      56: '0x9f882567a62a5560d147d64871776eea72df41d3',
    },
    decimals: 18,
    projectLink: 'https://www.mxc.com/',
  },
  ata: {
    symbol: 'ATA',
    address: {
      56: '0xa2120b9e674d3fc3875f415a7df52e382f141225',
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
      56: '0xcc2e12a9b5b75360c6fbf23b584c275d52cddb0e',
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
    address: { 250: '0xf16e81dce15b08f326220742020379b855b87df9' },
    decimals: 18,
    projectLink: 'https://hyperjump.fi/',
  },
  zoo: {
    symbol: 'ZOO',
    address: { 250: '0x09e145a1d53c0045f41aeef25d8ff982ae74dd56' },
    decimals: 0,
    projectLink: 'https://hyperjump.fi/',
  },
  eswap: {
    symbol: 'ESWAP',
    address: { 250: '0x735aBE48e8782948a37C7765ECb76b98CdE97B0F' },
    decimals: 8,
    projectLink: 'https://hyperjump.fi/',
  },
  snx: {
    symbol: 'SNX',
    address: { 250: '0x56ee926bd8c72b2d5fa1af4d9e4cbb515a1e3adc' },
    decimals: 18,
    projectLink: 'https://hyperjump.fi/',
  },
  cztears: {
    symbol: 'CZTEARS',
    address: { 250: '0x907f1a48918bb5de07c12443cab0e6eefcc611bc' },
    decimals: 18,
    projectLink: 'https://hyperjump.fi/',
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
    address: { 97: '', 250: '0x1E4F97b9f9F913c46F1632781732927B9019C68b' },
    decimals: 18,
    projectLink: 'https://curve.fi/',
  },
  hero: {
    symbol: 'HERO',
    address: { 56: '0x9b26e16377ad29a6ccc01770bcfb56de3a36d8b2', 97: '', 250: '' },
    decimals: 18,
    projectLink: 'https://www.farmhero.io/',
  },
  boo: {
    symbol: 'BOO',
    address: { 56: '', 97: '', 250: '0x841FAD6EAe12c286d1Fd18d1d525DFfA75C7EFFE' },
    decimals: 18,
    projectLink: 'https://www.spookyswap.finance/',
  },
  wild: {
    symbol: 'WILD',
    address: { 56: '', 97: '', 250: '0xAe0C241Ec740309c2cbdc27456eB3C1a2aD74737' },
    decimals: 18,
    projectLink: 'https://zoocoin.cash/',
  },
  krown: {
    symbol: 'KROWN',
    address: { 56: '0x1446f3CEdf4d86a9399E49f7937766E6De2A3AAB', 97: '', 250: '' },
    decimals: 18,
    projectLink: 'https://kingdefi.io/',
  },
  atari: {
    symbol: 'ATARI',
    address: { 56: '', 97: '', 250: '0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b' },
    decimals: 0,
    projectLink: 'https://www.atarichain.com/',
  },
  scream: {
    symbol: 'SCREAM',
    address: { 56: '', 97: '', 250: '0xe0654C8e6fd4D733349ac7E09f6f23DA256bF475' },
    decimals: 18,
    projectLink: 'https://www.scream.sh/',
  },
}

export default tokens
