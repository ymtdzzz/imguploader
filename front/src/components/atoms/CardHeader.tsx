import React, { ReactElement } from 'react'
import styled from 'styled-components'

const CardHeaderStyle = styled.h1`
  font-weight: bold;
  font-size: 30px;
  margin: 10px 0 30px 0;
`

export interface Props {
  label: string;
}

function CardHeader(props: Props): ReactElement<Props> {
  return (
    <CardHeaderStyle data-testid='card-header'>
      {props.label}
    </CardHeaderStyle>
  )
}

export default CardHeader
