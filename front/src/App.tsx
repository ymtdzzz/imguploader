import React, { ReactElement } from 'react'
import { Reset } from 'styled-reset'
import styled from 'styled-components'

import GlobalStyle from './components/GlobalStyle'
import SelectImageCard from './components/organisms/SelectImageCard'

const MainContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

function App(): ReactElement {
  return (
    <>
      <Reset />
      <GlobalStyle />
      <MainContainer>
        <SelectImageCard />
      </MainContainer>
    </>
  )
}

export default App
