import tokens from './tokens'

// tokens moved to the bottom, they now use the addresses from the token list

export default {
  // masterchefs 2.1 - current version
  masterChef: {
    56: '0x1985CD7aF3B410Cfe87B59EAF8A0833816729c49',
    250: '0xb0AA3a0458BD85F859345e2251C7665C5f7A9d18',
    1088: '0x7B649F38286231755FFccBe6C82E8d7529800eD4',
  },
  masterChef20: {
    56: '0x7A0De9A006129A18AE8d3C4e609fa866EE29A5B3',
    250: '0x2E03284727Ff6E50BB00577381059a11e5Bb01dE',
  },
  actionInitiators: {
    56: '0x559C93cf64005DfdA3e417E7C866a7F40F52C6C6',
    250: '0xF24B855689F315037dE778C83F5bB7B25Cc4a674',
    1088: '0xCB46BAaaB0667615F3E90c3edd4Ec7f021A5DcA1',
  },
  // distribution system
  mainDistributor: {
    250: '0xFeDd479723B03350cff007fe0DB19D1C6F179457',
  },
  localFarmTokenDistributor: {
    56: '0x2B4618996faD3eE7Bc9Ba8c98969A8eaf01B5E20',
    250: '0xD27D38694aadb487AEa67dB70fcEbB411A7Ac3ae',
    1088: '0xA565037058DF44F336e01683E096CDDe45cFE5c2',
  },
  ftmToBscBridgeDistributor: { 250: '0x863130381c476a3dAbcd6F287Ab967fE4c3a7D13' },
  // other utility contracts
  burnContract: {
    56: '0xFD5b495D6ce1a98102a14A7443928FC1B31a200D',
    250: '0x7AfCA69dCD68a8b36764ccE35B89A76450ccA411',
    1088: '0x3339e128FE4dF4d80f2Aa95ffDA953b983815c4e',
  },
  multiCall: {
    56: '0x1282fE78d092E6077B05FeE27f239b49b2725978',
    250: '0x6185A664e90754F4967B9962Fe7B1183b147fc48',
    97: '0x67ADCB4dF3931b0C5Da724058ADC2174a9844412',
  },
  lottery: {
    56: '0x96f83a5A3572f38D9Bf147973B132820Ea4446f4',
    250: '0x1e8763f80E57209E26300b3002bbAEAd7CEA3Bd1', // '0x98fA02eC9Feafe8ABf3AD71693BC5D562aa38f95',
    97: '',
  },
  // TODO: rename this migrator to correctly reflect which migration
  migrator: {
    56: '0x55Bf73Afcf2622E979aEE0831AC624B40c0DD297', // '0xAA1504c878B158906B78A471fD6bDbf328688aeB',
    250: '0xA256f0D2e12bE9404C9CCd33FB430648F7243bc2', // '0x1e2339616899A3130C72C62D35DC2b2B23598949',
  },
  synapse: {
    56: '0x749F37Df06A99D6A8E065dd065f8cF947ca23697',
    250: '0x7BC05Ff03397950E8DeE098B354c37f449907c20', // 0xE910dfaa50094C6BC1bF68E3CD7B244E9eC09D57
  },
  mechmigrator: {
    56: '0x9A493874B5E1fa9EC900A48D46C2791d894be454',
    250: '0x4E81dba135Eb3E541c65EE811EC071EAecB531A5',
  },
  hyperJumpClaimLpRewards: {
    56: '0xF153911d912de1f4FE576FbE4Ab29C075d656B58',
    250: '0x2B4618996faD3eE7Bc9Ba8c98969A8eaf01B5E20',
  },
  zap: {
    56: '0xDFb9F73fb56D5AACeDF0D1D650a3614d21AcfDeB',
    250: '0x61D791390ed5067E43BBd9760d26Ed2E57d24523',
  },
  l2BridgeZap: {
    56: '0x749F37Df06A99D6A8E065dd065f8cF947ca23697',
    250: '0xB003e75f7E0B5365e814302192E99b4EE08c0DEd',
  },
  // tokens
  alloy: {
    56: tokens.alloy.address[56],
  },
  jump: {
    56: tokens.jump.address[56],
    250: tokens.jump.address[250],
  },
  // old xJump from farm 2.0
  xjump20: {
    56: tokens.xjump20.address[56],
    250: tokens.xjump20.address[250],
  },
  // new xJump for Farm 2.1
  xjump: {
    56: tokens.xjump.address[56],
    250: tokens.xjump.address[250],
  },
  ori: {
    250: tokens.ori.address[250],
  },
  aurora: {
    250: tokens.aurora.address[250],
  },
  mech: {
    56: tokens.mech.address[56],
    250: tokens.mech.address[250],
  },
  busd: {
    56: tokens.busd.address[56],
  },
  usdc: {
    56: tokens.usdc.address[56],
    250: tokens.usdc.address[250],
  },
  eth: {
    56: tokens.eth.address[56],
    250: tokens.eth.address[250],
  },
  wbnb: {
    56: tokens.wbnb.address[56],
    250: tokens.wbnb.address[250],
  },
  wftm: {
    56: tokens.wftm.address[56],
    250: tokens.wftm.address[250],
  },
}
