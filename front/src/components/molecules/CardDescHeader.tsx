import React, { ReactElement } from 'react'

import CardHeader from '../atoms/CardHeader'
import CardDescStyle from '../atoms/CardDescStyle'

export interface Props {
  headerLabel: string;
  descLabel: string;
}

function CardDescHeader(props: Props): ReactElement<Props> {
  return (
    <>
      <CardHeader label={props.headerLabel} />
      <CardDescStyle>
        {props.descLabel}
      </CardDescStyle>
    </>
  )
}

export default CardDescHeader
