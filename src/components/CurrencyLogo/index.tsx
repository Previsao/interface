import { Currency, CETH, Token } from '@trisolaris/sdk'
import React, { useMemo } from 'react'
import styled from 'styled-components'

// import AvaxLogo from '../../assets/images/avalanche_token_round.png'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import { useActiveWeb3React } from '../../hooks'
import Logo from '../Logo'

const getTokenLogoURL = (address: string) =>
  `https://raw.githubusercontent.com/Previsao/tokens-bbb/master/assets/${address}/logo.png`

export const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.5);
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const { chainId } = useActiveWeb3React()
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (currency === CETH) return []

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, getTokenLogoURL(currency.address)]
      }

      return [...uriLocations, getTokenLogoURL(currency.address)]
    }
    return []
  }, [currency, uriLocations])

  if (currency === CETH) {
    if (chainId === 137) {
      return (
        <StyledEthereumLogo
          src={
            'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0/logo.png'
          }
          size={size}
          style={style}
        />
      )
    } else {
      return (
        <StyledEthereumLogo
          src={
            'https://raw.githubusercontent.com/pangolindex/tokens/main/assets/0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB/logo.png'
          }
          size={size}
          style={style}
        />
      )
    }
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
