import React, { ReactElement, useState, useEffect } from 'react'
import { Reset } from 'styled-reset'
import styled from 'styled-components'
import { Transition } from 'react-transition-group'

import GlobalStyle from './components/GlobalStyle'
import SelectImageCard from './components/organisms/SelectImageCard'
import UploadingCard from './components/organisms/UploadingCard'
import CompleteCard from './components/organisms/CompleteCard'
import { TransitionStatus } from 'react-transition-group/Transition'
import { getUrl } from './api/api'

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

  useEffect(() => {
    console.log('changed')
  }, [isSelectImage, isUploading, isCompleted])

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

  const onImageChange = async (file: File) => {
    console.log(file)
    showContainer(CONTAINER.UPLOADING)

    const params = await getUrl('image/png', 300)

    console.log(params)
    
    showContainer(CONTAINER.COMPLETED)
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
              <Container status={status}>
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
              <Container status={status}>
                <CompleteCard />
              </Container>
            )
          }}
        </Transition>
      </MainContainer>
    </>
  )
}

export default App
