import tokens from './tokens'

const { jump, ...removeJumpFromTokenList } = tokens

export default {
  ...removeJumpFromTokenList,
}
