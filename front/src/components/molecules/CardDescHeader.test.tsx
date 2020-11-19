import React from 'react'
import { render, getByText, screen } from '@testing-library/react'

import CardDescHeader, { Props } from './CardDescHeader'

describe('<CardDescHeader />', () => {
  test('should render header label and desc label', async () => {
    const props: Props = {
      headerLabel: 'header label',
      descLabel: 'description label',
    }
    render(<CardDescHeader {...props} />)
    expect(screen.getByText('header label')).toBeInTheDocument()
    expect(screen.getByText('description label')).toBeInTheDocument()
  })
})
