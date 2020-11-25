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

function CompleteCard(): ReactElement {
  return (
    <CardBaseStyle>
      <IconStyle>
        <FontAwesomeIcon icon={faCheckCircle} />
      </IconStyle>
      <CardDescHeader headerLabel="Uploaded Successfully!" descLabel="" />
      <UploadedImage imageUrl="https://cdnuploads.aa.com.tr/uploads/Contents/2020/05/14/thumbs_b_c_88bedbc66bb57f0e884555e8250ae5f9.jpg?v=140708" />
    </CardBaseStyle>
  )
}

export default CompleteCard
