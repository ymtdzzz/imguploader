import React, { ReactElement, useRef } from 'react'
import styled from 'styled-components'
import CopyToClipBoard from 'react-copy-to-clipboard'
import NotificationSystem, { System } from 'react-notification-system'

import ButtonStyle from '../atoms/ButtonStyle'

const ImageContainer = styled.div`
  overflow: hidden;
  img {
    border-radius: 20px;
    width: 100%;
  }
`

const CopyContainer = styled.div`
  margin-top: 0.2rem;
  display: flex;
  border-radius: 10px;
  height: 50px;
  background-color: #F7F8FB;
  border: 1px solid #E0E0E0;
  p {
  text-align: left;
  width: 100%;
  padding: 0 0.4rem;
  overflow: auto;
  }
`

const Button = styled.button`
  ${ButtonStyle}
  border: none;
  outline: none;
  margin: 0.1rem;
  font-size: 0.85rem;
  min-width: 6rem;
`

export interface Props {
  imageUrl: string;
}

function UploadedImage(props: Props): ReactElement {
  const notificationSystem = useRef<System>(null)

  const onCopyClicked = () => {
    const notification = notificationSystem.current
    if (notification != null) {
      notification.addNotification({
        message: 'Copied!',
        level: 'info',
        position: 'bc',
      })
    }
  } 
  
  return (
    <>
      <ImageContainer data-testid="uploaded-image">
        <img src={props.imageUrl} />
      </ImageContainer>
      <CopyToClipBoard text={props.imageUrl}>
        <CopyContainer data-testid="uploaded-image-copy" onClick={onCopyClicked}>
          <p>{props.imageUrl}</p>
          <Button data-link={props.imageUrl}>Copy Link</Button>
        </CopyContainer>
      </CopyToClipBoard>
      <NotificationSystem ref={notificationSystem} />
    </>
  )
}

export default UploadedImage
