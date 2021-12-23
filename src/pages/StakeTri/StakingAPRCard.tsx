import React from 'react'
import styled from 'styled-components'
import { AutoColumn } from '../../components/Column'
import { RowBetween } from '../../components/Row'
import { TYPE } from '../../theme'
import { GradientCard, CardBGImage, CardSection } from '../../components/earn/styled'
import { useTriBarStats } from '../../state/stakeTri/hooks'
import { useFetchTriBarAPR } from '../../fetchers/bar'

const Card = styled(GradientCard)`
   background: linear-gradient(90deg, #0014FF 0%, #0050FF 16.66%, #32B4FF 33.33%, #5AFFFF 50%, #32B4FF 66.67%, #0050FF 83.33%, #0014FF 100%);
 `

const MediumHeaderWhite = styled(TYPE.mediumHeader)`
  color: white;
`
const SubHeaderWhite = styled(TYPE.subHeader)`
  color: white;
`
const LargeHeaderWhite = styled(TYPE.largeHeader)`
  color: white;
`

export default function StakingAPRCard() {
    const { xtriToTRIRatio } = useTriBarStats();
    const apr = useFetchTriBarAPR();

    const xtriToTRIRatioFormatted = xtriToTRIRatio?.toFixed(6);
    const ratioText = xtriToTRIRatioFormatted == null
        ? 'Loading...'
        : `1 xTRI = ${xtriToTRIRatioFormatted} TRI`;

    return (
        <Card>
            <CardSection>
                <AutoColumn gap="md">
                    <RowBetween>
                        <AutoColumn gap="sm" justify="start">
                            <MediumHeaderWhite fontWeight={600}>
                                Staking APR
                            </MediumHeaderWhite>
                            <SubHeaderWhite>
                                {ratioText}
                            </SubHeaderWhite>
                        </AutoColumn>
                        <AutoColumn gap="sm" justify="end">
                            <LargeHeaderWhite>
                                {apr == null
                                    ? 'Loading...'
                                    : `${apr?.toFixed(2)}%`}
                            </LargeHeaderWhite>
                            <SubHeaderWhite>
                                Yesterday's APR
                            </SubHeaderWhite>
                        </AutoColumn>
                    </RowBetween>
                </AutoColumn>
            </CardSection>
        </Card>
    )
}