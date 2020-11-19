import React from 'react'
import { render, getByText, screen } from '@testing-library/react'

import CardHeader, { Props } from './CardHeader'

describe('<CardHeader />', () => {
  test('should render header label', async () => {
    const props: Props = {
      label: 'test header label'
    }
    render(<CardHeader {...props} />)
    expect(screen.getByText('test header label')).toBeInTheDocument()
  })
})
