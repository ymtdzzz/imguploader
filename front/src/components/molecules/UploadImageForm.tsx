import React, { ReactElement, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import styled from 'styled-components'

import UploadImageButton from '../atoms/UploadImageButton'
import CardDescStyle from '../atoms/CardDescStyle'
import imageIcon from '../../assets/image-icon.svg'

const DropZone = styled.div<{isOnDrag: boolean}>`
  box-sizing: border-box;
  width: 100%;
  min-height: 300px;
  margin: auto;
  margin-bottom: 30px;
  border: ${({isOnDrag}) => isOnDrag ? '3px solid #8CB1E6' : '2px dashed #BED6F8'};
  border-radius: 20px;
  background-color: #F7F8FB;
  display: flex;
  flex-direction: column;
  p {
  margin-bottom: 50px;
  color: #828282;
  }
  &:hover {
    cursor: pointer;
  }
`

const ImageIconStyle = styled.img`
display: block;
max-width: 200px;
  margin: auto;
  opacity: .2;
`

export interface Props {
  onImageChange: (file: File) => void;
}

// Dropzone settings
const acceptFile = 'image/*'

function UploadImageForm(props: Props): ReactElement<Props> {
  const [isDragOver, setIsDragOver] = React.useState(false)

  // normal image input
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files.item(0)
      if (file) {
        props.onImageChange(file)
      }
    }
  }

  // Dropzone image input
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      props.onImageChange(acceptedFiles[0])
    }
    setIsDragOver(false)
  }, [])

  // Dropzone drag over
  const onDragOver = (_: React.DragEvent<HTMLDivElement>) => {
    setIsDragOver(true)
  }

  // Dropzone drag leave
  const onDragLeave = (_: React.DragEvent<HTMLDivElement>) => {
    setIsDragOver(false)
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: acceptFile, minSize: 0, multiple: false})
  
  return (
    <>
      <DropZone
        data-testid="dropzone-area"
        {...getRootProps()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        isOnDrag={isDragOver}
      >
        <input {...getInputProps()} />
        <ImageIconStyle src={imageIcon} />
        <p>Drag & Drop your image here</p>
      </DropZone>
      <CardDescStyle>
        Or
      </CardDescStyle>
      <UploadImageButton onChange={onChange} data-testid='upload-image-button' />
    </>
  )
}

export default UploadImageForm
