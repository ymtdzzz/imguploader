import React from 'react'

import CardBaseStyle from './CardBaseStyle'
import CardDescHeader from '../molecules/CardDescHeader'
import UploadedImage from '../molecules/UploadedImage'

function CompleteCard() {
  return (
    <CardBaseStyle>
      <CardDescHeader headerLabel="Uploaded Successfully!" descLabel="" />
      <UploadedImage imageUrl="https://cdnuploads.aa.com.tr/uploads/Contents/2020/05/14/thumbs_b_c_88bedbc66bb57f0e884555e8250ae5f9.jpg?v=140708" />
    </CardBaseStyle>
  )
}

export default CompleteCard
