import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'

import UploadImageForm, { Props } from './UploadImageForm'

class FileListMock {
  files: File[]|null[];
  length: number;

  constructor(files: File[]) {
    this.files = files
    this.length = files.length
  }

  item(index: number): File|null {
    if (index < this.length) {
      return this.files[index]
    } else {
      return null
    }
  }

  setNullForTest() {
    for (let i = 0; i < this.length; i++) {
      this.files[i] = null
    }
  }
}

describe('<UploadImageForm />', () => {
  const onDragOverStyle = 'border: 3px solid #8CB1E6'
  const onDragLeaveStyle = 'border: 2px dashed #BED6F8'
  const onImageChange = jest.fn()
  const props: Props = {
    onImageChange,
  }
  
  test('should have solid border box when onDrag', async () => {
    const { getByTestId } = render(<UploadImageForm {...props} />)
    const dropzone = getByTestId('dropzone-area')
    expect(dropzone).toHaveStyle(onDragLeaveStyle)
    fireEvent.dragOver(dropzone, {})
    expect(dropzone).toHaveStyle(onDragOverStyle)
    fireEvent.dragLeave(dropzone, {})
    expect(dropzone).toHaveStyle(onDragLeaveStyle)
  })

  test('should call onImageChange with selected file when onDrop (single file)', async () => {
    const { getByTestId } = render(<UploadImageForm {...props} />)
    const dropzone = getByTestId('dropzone-area')
    const file = new File(['testfile'], 'test.png', { type: 'image/png' })
    const event = {
      target: {
        files: [file],
      },
    }
    fireEvent.drop(dropzone, event)
    await waitFor(() => expect(onImageChange).toHaveBeenCalledWith(file))
  })

  test('should not call onImageChange when onDrop (multi files)', async () => {
    const { getByTestId } = render(<UploadImageForm {...props} />)
    const dropzone = getByTestId('dropzone-area')
    const files = [
      new File(['testfile1'], 'test1.png', { type: 'image/png' }),
      new File(['testfile2'], 'test2.png', { type: 'image/png' }),
      new File(['testfile3'], 'test3.png', { type: 'image/png' }),
    ]
    const event = {
      target: {
        files: files,
      },
    }
    fireEvent.drop(dropzone, event)
    await waitFor(() => expect(onImageChange).toHaveBeenCalledTimes(0))
  })

  test('should call onImageChange with selected file when onChange (empty file)', async () => {
    const { getByTestId } = render(<UploadImageForm {...props} />)
    const uploadImageButton = getByTestId('upload-image-button')
    
    const fileList = new FileListMock([])
    
    expect(fileList.length).toBe(0)
    expect(fileList.item(0)).toBe(null)

    const event = {
      target: {
        files: fileList,
      },
    }
    fireEvent.change(uploadImageButton, event)
    expect(onImageChange).toHaveBeenCalledTimes(0)
  })

  test('should call onImageChange with selected file when onChange (single file)', async () => {
    const { getByTestId } = render(<UploadImageForm {...props} />)
    const uploadImageButton = getByTestId('upload-image-button')
    
    const file = new File(['testfile'], 'test.png', { type: 'image/png' })
    const fileList = new FileListMock([file])
    
    expect(fileList.length).toBe(1)
    expect(fileList.item(0)).toBe(file)

    const event = {
      target: {
        files: fileList,
      },
    }
    fireEvent.change(uploadImageButton, event)
    expect(onImageChange).toHaveBeenCalledWith(file)
  })

  test('should call onImageChange with selected file when onChange (multi files)', async () => {
    const { getByTestId } = render(<UploadImageForm {...props} />)
    const uploadImageButton = getByTestId('upload-image-button')
    
    const files = [
      new File(['testfile1'], 'test1.png', { type: 'image/png' }),
      new File(['testfile2'], 'test2.png', { type: 'image/png' }),
      new File(['testfile3'], 'test3.png', { type: 'image/png' }),
    ]
    const fileList = new FileListMock(files)
    
    expect(fileList.length).toBe(3)
    expect(fileList.item(0)).toBe(files[0])

    const event = {
      target: {
        files: fileList,
      },
    }
    fireEvent.change(uploadImageButton, event)
    expect(onImageChange).toHaveBeenCalledWith(files[0])
  })

  test('should call onImageChange with selected file when onChange (null file)', async () => {
    const { getByTestId } = render(<UploadImageForm {...props} />)
    const uploadImageButton = getByTestId('upload-image-button')
    
    const file = new File(['testfile'], 'test.png', { type: 'image/png' })
    const fileList = new FileListMock([file])
    fileList.setNullForTest()
    
    expect(fileList.length).toBe(1)
    expect(fileList.item(0)).toBe(null)

    const event = {
      target: {
        files: fileList,
      },
    }
    fireEvent.change(uploadImageButton, event)
    expect(onImageChange).toHaveBeenCalledTimes(0)
  })
})
