import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'

test('renders SelectImageCard', () => {
  render(<App />)
  const selectImageCard = screen.getByTestId('select-image-card')
  expect(selectImageCard).toBeInTheDocument()
})
