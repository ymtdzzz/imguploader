import React, { ReactElement } from 'react'
import styled from 'styled-components'
import ButtonStyle from './ButtonStyle'

const Button = styled.input`
  display: none;
`

const ButtonContainer = styled.label`
  ${ButtonStyle}
  padding: 0.6rem 0.8rem;
`

export interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function UploadImageButton(props: Props): ReactElement<Props> {
  return (
    <ButtonContainer>
      Choose a file
      <Button type='file' onChange={props.onChange} data-testid='upload-image-button' />
    </ButtonContainer>
  )
}

export default UploadImageButton
