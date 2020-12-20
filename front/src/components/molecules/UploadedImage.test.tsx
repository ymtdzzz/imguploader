import React from 'react'
import { fireEvent, render } from '@testing-library/react'

import UploadedImage from './UploadedImage'

describe('<UploadedImage />', () => {
  test('should render image with correct image url', async () => {
    const imageUrl = 'http://example.com'
    const { getByTestId } = render(<UploadedImage imageUrl={imageUrl} />)
    const image = getByTestId('uploaded-image')
    expect(image.getElementsByTagName('img').item(0).getAttribute('src')).toEqual(imageUrl)
  })
  test('should render correct url', async () => {
    const imageUrl = 'http://example.com'
    const { getByTestId } = render(<UploadedImage imageUrl={imageUrl} />)
    const copyContainer = getByTestId('uploaded-image-copy')
    expect(copyContainer.getElementsByTagName('p').item(0).textContent).toEqual(imageUrl)
  })
  test('should render notification when copy button clicked', async () => {
    // eslint-disable-next-line
    window.prompt = () => {}
    const imageUrl = 'http://example.com'
    const { getByText, getByTestId } = render(<UploadedImage imageUrl={imageUrl} />)
    const copyButton = getByTestId('uploaded-image-copy')
    fireEvent.click(copyButton)

    const notification = getByText('Copied!')
    expect(notification).toBeInTheDocument()
  })
})
