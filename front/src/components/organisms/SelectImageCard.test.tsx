import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'

import SelectImageCard from './SelectImageCard'

describe('<SelectImageCard />', () => {
  test('should call onChangeImage function', async () => {
    const event: React.ChangeEvent<HTMLInputElement> = {
      target: {
        files: [new File(['testdata'], 'test.png', { type: 'image/png' })],
      }
    }
    const onChangeImage = jest.fn()
    const { getByTestId } = render(<SelectImageCard onImageChange={onChangeImage} />)
    const dropzoneArea = getByTestId('dropzone-area')
    fireEvent.drop(dropzoneArea, event)
    await waitFor(() => expect(onChangeImage).toHaveBeenCalledTimes(1))
  })
})
