import React, { useState } from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { TYPE, ExternalLink } from '../../theme'
import PoolCard from '../../components/earn/PoolCardTri'
import PoolCardTRIV2 from '../../components/earn/PoolCardTriV2'
import FarmBanner from '../../components/earn/FarmBanner'
import { RouteComponentProps } from 'react-router-dom'
import { RowBetween } from '../../components/Row'
import { CardSection, DataCard, CardNoise, CardBGImage, HighlightCard } from '../../components/earn/styled'
import { useTranslation } from 'react-i18next'
import { useFarms } from '../../state/stake/apr'
import { PageWrapper } from '../../components/Page'

const TopSection = styled(AutoColumn)`
  max-width: ${({ theme }) => `${theme.pageWidth}px`};
  width: 100%;
`

const PoolSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  column-gap: 10px;
  row-gap: 15px;
  width: 100%;
  justify-self: center;
`

const PoolSectionV2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  width: 100%;
  justify-self: center;
`

const DataRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
   flex-direction: column;
 `};
`

const SortSection = styled.div`
  display: flex;
`
const SortField = styled.div`
  margin: 0px 5px 0px 5px;
  font-weight: 400;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  line-height: 20px;
`

const SortFieldContainer = styled.div`
  display: flex;
  ${({ theme }) => theme.mediaWidth.upToSmall`
   display: none;
 `};
`

enum SortingType {
  totalStakedInWavax = 'totalStakedInWavax',
  multiplier = 'multiplier',
  totalApr = 'totalApr'
}

const POOLS_ORDER = [5, 8, 7, 0, 1, 2, 3, 4, 9, 10];

export default function Earn({
  match: {
    params: { version }
  }
}: RouteComponentProps<{ version: string }>) {
  const { t } = useTranslation()
  const farmArrs = useFarms();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const dualRewardPools = POOLS_ORDER.filter(index => farmArrs[index].doubleRewards)
  const nonDualRewardPools = POOLS_ORDER.filter(index => !farmArrs[index].doubleRewards)

  return (
    <PageWrapper gap="lg" justify="center">
      <FarmBanner />
      <TopSection gap="md">
        <HighlightCard>
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600}>{t('earnPage.liquidityMining')}</TYPE.white>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={14}>{t('earnPage.depositLiquidity')}</TYPE.white>
              </RowBetween>{' '}
              <ExternalLink
                style={{ color: 'white', textDecoration: 'underline' }}
                href="https://medium.com/trisolaris-labs"
                target="_blank"
              >
                <TYPE.white fontSize={14}>{t('earnPage.readMoreAboutPng')}</TYPE.white>
              </ExternalLink>
            </AutoColumn>
          </CardSection>
        </HighlightCard>
      </TopSection>

      <AutoColumn gap="lg" style={{ width: '100%' }}>
        <DataRow style={{ alignItems: 'baseline' }}>
          <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>
            Dual Rewards Pools
          </TYPE.mediumHeader>
        </DataRow>
        <PoolSectionV2>
          {dualRewardPools.map(index => (
            <PoolCardTRIV2
              key={index}
              stakingInfo={farmArrs[index]}
              version={farmArrs[index].ID}
            />
          ))}
        </PoolSectionV2>
      </AutoColumn>
      
      <AutoColumn gap="lg" style={{ width: '100%' }}>
        <DataRow style={{ alignItems: 'baseline' }}>
          <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>
            Participating Pools
          </TYPE.mediumHeader>
        </DataRow>
        <PoolSectionV2>
          {nonDualRewardPools.map(index => (
            <PoolCardTRIV2
              key={index}
              stakingInfo={farmArrs[index]}
              version={farmArrs[index].ID}
            />
          ))}
        </PoolSectionV2>
      </AutoColumn>
    </PageWrapper>
  )
}
