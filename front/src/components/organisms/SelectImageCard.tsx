import React, { ReactElement } from 'react'

import CardBaseStyle from './CardBaseStyle'
import CardDescHeader from '../molecules/CardDescHeader'
import UploadImageForm from '../molecules/UploadImageForm'

export interface Props {
  onImageChange: (file: File) => void;
}

function SelectImageCard(props: Props): ReactElement {
  const onImageChange = (f: File) => {
    console.log('image changed')
    props.onImageChange(f)
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
