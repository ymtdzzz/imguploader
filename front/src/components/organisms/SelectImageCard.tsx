import React from 'react'

import CardBaseStyle from './CardBaseStyle'
import CardDescHeader from '../molecules/CardDescHeader'
import UploadImageForm from '../molecules/UploadImageForm'

function SelectImageCard() {
  const onImageChange = () => {
    console.log('image changed')
  }

  return (
    <CardBaseStyle data-testid='select-image-card'>
      <CardDescHeader
        headerLabel="Upload your image"
        descLabel="File should be Jpeg Png..."
      />
      <UploadImageForm
        onImageChange={onImageChange}
      />
    </CardBaseStyle>
  )
}

export default SelectImageCard
