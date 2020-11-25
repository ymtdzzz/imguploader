import React, { ReactElement } from 'react'
import styled from 'styled-components'
import CopyToClipBoard from 'react-copy-to-clipboard'

import ButtonStyle from '../atoms/ButtonStyle'

const ImageContainer = styled.div`
  height: 300px;
  overflow: hidden;
  img {
  border-radius: 20px;
  width: 100%;
  }
`

const CopyContainer = styled.div`
  display: flex;
  border-radius: 10px;
  height: 50px;
  background-color: #F7F8FB;
  border: 1px solid #E0E0E0;
  p {
  width: 100%;
  line-height: 50px;
  padding: 0 0.4rem;
  overflow: auto;
  }
`

const Button = styled.button`
  ${ButtonStyle}
  border: none;
  outline: none;
  margin: 0.1rem;
  font-size: 0.7rem;
  min-width: 6rem;
`

export interface Props {
  imageUrl: string;
}

function UploadedImage(props: Props): ReactElement {
  return (
    <>
      <ImageContainer data-testid="uploaded-image">
        <img src={props.imageUrl} />
      </ImageContainer>
      <CopyToClipBoard text={props.imageUrl}>
        <CopyContainer data-testid="uploaded-image-copy">
          <p>{props.imageUrl}</p>
          <Button data-link={props.imageUrl}>Copy Link</Button>
        </CopyContainer>
      </CopyToClipBoard>
    </>
  )
}

export default UploadedImage
