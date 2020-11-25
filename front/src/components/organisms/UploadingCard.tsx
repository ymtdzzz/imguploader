import React, { ReactElement } from 'react'

import CardBaseStyle from './CardBaseStyle'
import CardDescHeader from '../molecules/CardDescHeader'
import Loader from '../atoms/Loader'

function UploadingCard(): ReactElement {
  return (
    <CardBaseStyle>
      <CardDescHeader headerLabel="Uploading..." descLabel="" />
      <Loader />
    </CardBaseStyle>
  )
}

export default UploadingCard
