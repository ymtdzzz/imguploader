import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('<App>', () => {
  it('renders only SelectImageCard at first', async () => {
    render(<App />)
    const selectImageCard = screen.getByTestId('select-image-card')
    const uploadingCard = screen.queryByTestId('app-uploading-card')
    const completeCard = screen.queryByTestId('app-complete-card')
    expect(selectImageCard).toBeInTheDocument()
    expect(uploadingCard).not.toBeVisible()
    expect(completeCard).not.toBeVisible()
  })
})
