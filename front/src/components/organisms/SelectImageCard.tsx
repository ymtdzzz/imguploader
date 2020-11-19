import React from 'react'
import styled from 'styled-components'

import CardDescHeader from '../molecules/CardDescHeader'
import UploadImageForm from '../molecules/UploadImageForm'

const SelectImageCardStyle = styled.div`
  min-width: 500px;
  border-radius: 10px;
  background-color: white;
  text-align: center;
  padding: 30px;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, .1);
`

function SelectImageCard() {
  const onImageChange = () => {
    console.log('image changed')
  }

  return (
    <SelectImageCardStyle data-testid='select-image-card'>
      <CardDescHeader
        headerLabel="Upload your image"
        descLabel="File should be Jpeg Png..."
      />
      <UploadImageForm
        onImageChange={onImageChange}
      />
    </SelectImageCardStyle>
  )
}

export default SelectImageCard
