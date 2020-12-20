import React, { ReactElement, useState, useEffect, useRef } from 'react'
import { Reset } from 'styled-reset'
import styled from 'styled-components'
import { Transition } from 'react-transition-group'
import NotificationSystem, { System } from 'react-notification-system'

import GlobalStyle from './components/GlobalStyle'
import SelectImageCard from './components/organisms/SelectImageCard'
import UploadingCard from './components/organisms/UploadingCard'
import CompleteCard from './components/organisms/CompleteCard'
import { TransitionStatus } from 'react-transition-group/Transition'
import { Error, getUrl, isError, putImage } from './api/api'

const MainContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Container = styled.div<{status: TransitionStatus}>`
  transition: .2s;
  opacity: ${({status}) => status === 'entered' ? 1 : 0};
  display: ${({status}) => status === 'exited' ? 'none' : 'block'};
`

function App(): ReactElement {
  const [isSelectImage, setIsSelectImage] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  const notificationSystem = useRef<System>(null)

  useEffect(() => {
    console.log('changed')
  }, [isSelectImage, isUploading, isCompleted, imageUrl])

  enum CONTAINER {
    SELECT_IMAGE,
    UPLOADING,
    COMPLETED,
  }

  const showContainer = (container: CONTAINER) => {
    switch (container) {
    case CONTAINER.SELECT_IMAGE:
      setIsSelectImage(true)
      setIsUploading(false)
      setIsCompleted(false)
      break
    case CONTAINER.UPLOADING:
      setIsSelectImage(false)
      setIsUploading(true)
      setIsCompleted(false)
      break
    case CONTAINER.COMPLETED:
      setIsSelectImage(false)
      setIsUploading(false)
      setIsCompleted(true)
      break
    }
  }

  const onImageChange = async (file: File): Promise<void> => {
    console.log(file)
    showContainer(CONTAINER.UPLOADING)

    const params = await getUrl(file.type, file.size)
    if (!isError(params)) {
      const url = await putImage(params, file)
      if (!isError(url)) {
        setImageUrl(url)
        showContainer(CONTAINER.COMPLETED)
        return
      } else {
        addErrorNotification(url)
      }
    } else {
      addErrorNotification(params)
    }
    showContainer(CONTAINER.SELECT_IMAGE)
  }

  const addErrorNotification = (error: Error) => {
    const notification = notificationSystem.current
    if (notification !== null) {
      notification.addNotification({
        message: `Failed to upload your image. Please try again. \n(${error.message})`,
        level: 'error',
        position: 'bc',
      })
    }
  }

  return (
    <>
      <Reset />
      <GlobalStyle />
      <MainContainer>
        <Transition
          in={isSelectImage}
          timeout={1}
        >
          {status => {
            return (
              <Container status={status}>
                <SelectImageCard onImageChange={onImageChange} />
              </Container>
            )
          }}
        </Transition>
        <Transition
          in={isUploading}
          timeout={1}
        >
          {status => {
            return (
              <Container status={status} data-testid='app-uploading-card'>
                <UploadingCard />
              </Container>
            )
          }}
        </Transition>
        <Transition
          in={isCompleted}
          timeout={1}
        >
          {status => {
            return (
              <Container status={status} data-testid='app-complete-card'>
                <CompleteCard imageUrl={imageUrl} />
              </Container>
            )
          }}
        </Transition>
      </MainContainer>
      <NotificationSystem ref={notificationSystem} />
    </>
  )
}

export default App
