import React, { ReactElement } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

import CardBaseStyle from './CardBaseStyle'
import CardDescHeader from '../molecules/CardDescHeader'
import UploadedImage from '../molecules/UploadedImage'
import styled from 'styled-components'

const IconStyle = styled.p`
  color: green;
  font-size: 2.5rem;
`

export interface Props {
  imageUrl: string;
}

function CompleteCard(props: Props): ReactElement {
  return (
    <CardBaseStyle>
      <IconStyle>
        <FontAwesomeIcon icon={faCheckCircle} />
      </IconStyle>
      <CardDescHeader headerLabel="Uploaded Successfully!" descLabel="" />
      <UploadedImage imageUrl={props.imageUrl} />
    </CardBaseStyle>
  )
}

export default CompleteCard
