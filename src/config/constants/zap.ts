// instead of copy pasting for ever we use the farm config minus pool 0

import farms from './farms'

const farmsMinusPoolZero = { ...farms }

Object.keys(farmsMinusPoolZero).forEach((key, index) => {
  farmsMinusPoolZero[key].splice(0, 1)
})

const zapPairs = { ...farmsMinusPoolZero }

export default zapPairs
