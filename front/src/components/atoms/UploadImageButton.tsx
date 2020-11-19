import React, { ReactElement } from 'react'
import styled from 'styled-components'

const Button = styled.input`
  display: none;
`

const ButtonStyle = styled.label`
  display: inline-block;
  background-color: #2F80ED;
  border-radius: 10px;
  padding: 10px 20px;
  color: white;
  transition: background-color 0.15s;
  &:hover {
    cursor: pointer;
    background-color: #5b9cf1;
  }
`

export interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function UploadImageButton(props: Props): ReactElement<Props> {
  return (
    <ButtonStyle>
      Choose a file
      <Button type='file' onChange={props.onChange} data-testid='upload-image-button' />
    </ButtonStyle>
  )
}

export default UploadImageButton
