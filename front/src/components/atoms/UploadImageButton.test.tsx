import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import UploadImageButton, { Props } from './UploadImageButton'

describe('<UploadImageButton />', () => {
  test('should execute onChange when change event fired', async () => {
    const onChange = jest.fn()
    const props: Props = {
      onChange: onChange
    }
    const event: React.ChangeEvent<HTMLInputElement> = {
      target: {
        files: [new File(['testdata'], 'test.png', { type: 'image/png' })],
      }
    }
    const { findByTestId } = render(<UploadImageButton {...props} />)
    const imageInputButton = await findByTestId('upload-image-button')

    fireEvent.change( imageInputButton, event)

    expect(onChange).toHaveBeenCalled()
  })
})
