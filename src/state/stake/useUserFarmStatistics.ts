import { JSBI, Token, TokenAmount } from '@trisolaris/sdk'
import { useTotalStakedInPool } from '../../data/TotalStakedInPool'
import { ChefVersions } from './stake-constants'
import { addCommasToNumber } from '../../utils'

type Props = {
  lpToken?: Token
  userLPStakedAmount?: TokenAmount | null
  totalPoolAmountUSD?: number
  chefVersion?: ChefVersions
}

export default function useUserFarmStatistics({ lpToken, userLPStakedAmount, totalPoolAmountUSD, chefVersion }: Props) {
  const totalStakedInPool = useTotalStakedInPool(lpToken, chefVersion)

  if (
    totalStakedInPool == null ||
    lpToken == null ||
    userLPStakedAmount == null ||
    totalPoolAmountUSD == null ||
    userLPStakedAmount.equalTo(JSBI.BigInt(0))
  ) {
    return null
  }

  const userLPShare = userLPStakedAmount.divide(totalStakedInPool)
  const userLPAmountUSD = userLPShare?.multiply(JSBI.BigInt(totalPoolAmountUSD))
  const userLPAmountUSDFormatted = userLPAmountUSD != null ? `$${addCommasToNumber(userLPAmountUSD.toFixed(2))}` : null

  return {
    totalStakedInPool,
    userLPShare,
    userLPAmountUSD,
    userLPAmountUSDFormatted
  }
}
