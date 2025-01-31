import { Contract } from '@ethersproject/contracts'
import { ChainId, Token, WETH } from '@trisolaris/sdk'
import IUniswapV2Pair_ABI from '../constants/abis/polygon/IUniswapV2Pair.json'
import { abi as STAKING_REWARDS_ABI } from '@pangolindex/governance/artifacts/contracts/StakingRewards.sol/StakingRewards.json'
import { abi as AIRDROP_ABI } from '@pangolindex/governance/artifacts/contracts/Airdrop.sol/Airdrop.json'
import { abi as GOVERNANCE_ABI } from '@pangolindex/governance/artifacts/contracts/GovernorAlpha.sol/GovernorAlpha.json'
import { abi as PNG_ABI } from '@pangolindex/governance/artifacts/contracts/PNG.sol/Png.json'
import { abi as BRIDGE_MIGRATOR_ABI } from '@pangolindex/exchange-contracts/artifacts/contracts/pangolin-periphery/PangolinBridgeMigrationRouter.sol/PangolinBridgeMigrationRouter.json'
import { useMemo } from 'react'

import COMPLEX_REWARDER_ABI from '../constants/abis/complex-rewarder.json'
import ENS_PUBLIC_RESOLVER_ABI from '../constants/abis/ens-public-resolver.json'
import { ERC20_BYTES32_ABI } from '../constants/abis/erc20'
import ERC20_ABI from '../constants/abis/erc20.json'
import BRIDGE_TOKEN_ABI from '../constants/abis/bridge-token.json'
import { MIGRATOR_ABI, MIGRATOR_ADDRESS } from '../constants/abis/migrator'
import WETH_ABI from '../constants/abis/polygon/weth.json'
import { MULTICALL_ABI, MULTICALL_NETWORKS } from '../constants/multicall'
import { getContract } from '../utils'
import { useActiveWeb3React } from './index'
import { AIRDROP_ADDRESS, BRIDGE_MIGRATOR_ADDRESS, TRI, USDC, WNEAR } from '../constants'
import { GOVERNANCE_ADDRESS, PNG } from '../constants'
import { STAKING } from '../state/stake/stake-constants'

// returns null on errors
function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useV2MigratorContract(): Contract | null {
  return useContract(MIGRATOR_ADDRESS, MIGRATOR_ABI, true)
}

export function useBridgeMigratorContract(): Contract | null {
  return useContract(BRIDGE_MIGRATOR_ADDRESS, BRIDGE_MIGRATOR_ABI, true)
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useBridgeTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, BRIDGE_TOKEN_ABI, withSignerIfPossible)
}

export function useWETHContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? WETH[chainId]?.address : undefined, WETH_ABI, withSignerIfPossible)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, IUniswapV2Pair_ABI, withSignerIfPossible)
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false)
}

export function useGovernanceContract(): Contract | null {
  return useContract(GOVERNANCE_ADDRESS, GOVERNANCE_ABI, true)
}

export function usePngContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? PNG[chainId].address : undefined, PNG_ABI, true)
}

export function useStakingContract(stakingAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(stakingAddress, STAKING_REWARDS_ABI, withSignerIfPossible)
}

export function useAirdropContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? AIRDROP_ADDRESS[chainId] : undefined, AIRDROP_ABI, true)
}

export function useUSDCWNEARPoolContract(): Contract | null {
  const contractAddress = findPoolContract(WNEAR[ChainId.AURORA], USDC[ChainId.AURORA])?.lpAddress
  return useContract(contractAddress, IUniswapV2Pair_ABI)
}

export function useTRIWNEARPoolContract(): Contract | null {
  const contractAddress = findPoolContract(WNEAR[ChainId.AURORA], TRI[ChainId.AURORA])?.lpAddress
  return useContract(contractAddress, IUniswapV2Pair_ABI)
}

function findPoolContract(tokenA: Token, tokenB: Token) {
  const pools = STAKING[ChainId.AURORA]

  return pools.find(pool => {
    const [poolTokenA, poolTokenB] = pool.tokens
    const hasTokenA = [poolTokenA.address, poolTokenB.address].includes(tokenA.address)
    const hasTokenB = [poolTokenA.address, poolTokenB.address].includes(tokenB.address)

    return hasTokenA && hasTokenB
  })
}
