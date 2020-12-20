import axios, { AxiosError, AxiosResponse } from 'axios'

import { getUrl, putImage } from './api'

jest.mock('axios')

const validGetUrlResponse = { 
  message: 'Succeeded',
  url: 'http://offline-imguploader.localhost:8000',
  policy: {
    'x-amz-signature': '26807fb3645829266b889954099d25a6a7e683cfdcb0b269992cecb4a372f983',
    'x-amz-date': '20201215T130522Z',
    'x-amz-security-token': 'session-token',
    'x-amz-credential': 'S3RVER/20201215/ap-northeast-1/s3/aws4_request',
    'x-amz-algorithm': 'AWS4-HMAC-SHA256',
    policy: 'eyJleHBpcmF0aW9uIjoiMjAyMC0xMi0xNVQxMzowNTo1Mi4wMDBaIiwiY29uZGl0aW9ucyI6W1siZXEiLCIkYnVja2V0Iiwib2ZmbGluZS1pbWd1cGxvYWRlciJdLFsiZXEiLCIka2V5IiwidGVzdC50eHQiXSxbImVxIiwiJENvbnRlbnQtVHlwZSIsImltYWdlL3BuZyJdLFsiZXEiLCIkeC1hbXotZGF0ZSIsIjIwMjAxMjE1VDEzMDUyMloiXSxbImVxIiwiJHgtYW16LWFsZ29yaXRobSIsIkFXUzQtSE1BQy1TSEEyNTYiXSxbImVxIiwiJHgtYW16LWNyZWRlbnRpYWwiLCJTM1JWRVIvMjAyMDEyMTUvYXAtbm9ydGhlYXN0LTEvczMvYXdzNF9yZXF1ZXN0Il0sWyJlcSIsIiR4LWFtei1zZWN1cml0eS10b2tlbiIsInNlc3Npb24tdG9rZW4iXSxbImNvbnRlbnQtbGVuZ3RoLXJhbmdlIiwyMDAsMjAwXV19',
    'Content-Type': 'image/png',
    key: 'test.txt',
    bucket: 'offline-imguploader',
  },
}

const file = new File(['testdata'], 'test.png', { type: 'image/png' }) 

const mockAxiosError = (
  code: number,
  msg: string,
  isEmpty: boolean,
): AxiosError<string> => {
  const response: AxiosResponse<string> = {
    data: msg,
    status: code,
    statusText: 'status text',
    headers: [],
    config: {},
    request: {},
  }
  return {
    config: {},
    code: code.toString(),
    response: isEmpty ? undefined : response,
    isAxiosError: true,
    toJSON: () => {
      return {}
    }
  }
}

describe('getUrl', () => {
  it('returns pre-signed url with params from an API', async () => {
    axios.post.mockImplementationOnce(() => Promise.resolve({
      data: validGetUrlResponse
    }))
    await expect(getUrl('image/png', 3000)).resolves.toEqual(validGetUrlResponse)
  })

  it('returns pre-signed url with params from an API (local)', async () => {
    axios.post.mockImplementationOnce(() => Promise.resolve({
      data: {
        body: JSON.stringify(validGetUrlResponse)
      }
    }))
    await expect(getUrl('image/png', 3000)).resolves.toEqual(validGetUrlResponse)
  })

  it('returns Error when policy is malformed', async () => {
    const data = {
      message: 'Succeeded',
      url: 'http://offline-imguploader.localhost:8000',
      policy: {
        malformed: 'wrong data!!'
      },
    }
    const expected = {
      message: 'received data is malformed'
    }
    axios.post.mockImplementationOnce(() => Promise.resolve({
      data: data
    }))
    await expect(getUrl('image/png', 3000)).resolves.toStrictEqual(expected)
  })

  it('returns null when data is malformed', async () => {
    const data = {
      malformed: 'wrong data!!!'
    }
    const expected = {
      message: 'received data is malformed'
    }
    axios.post.mockImplementationOnce(() => Promise.resolve({
      data: data
    }))
    await expect(getUrl('image/png', 3000)).resolves.toStrictEqual(expected)
  })

  it('returns error when failed with AxiosError which has response', async () => {
    const expected = {
      message: 'code: 400, msg: "some data is missing!"'
    }
    axios.post
      .mockImplementationOnce(() => Promise.reject(
        mockAxiosError(400, 'some data is missing!', false)
      ))
    await expect(getUrl('image/png', 3000)).resolves.toStrictEqual(expected)
  })

  it('returns error when failed with AxiosError which doesn\'t have response', async () => {
    const expected = {
      message: '{}'
    }
    axios.post
      .mockImplementationOnce(() => Promise.reject(
        mockAxiosError(400, 'some data is missing!', true)
      ))
    await expect(getUrl('image/png', 3000)).resolves.toStrictEqual(expected)
  })
})

describe('putImage', () => {
  it('returns image url when succeeded', async () => {
    const expected = 'http://localhost:8000/test.txt'
    axios.post.mockImplementationOnce(() => Promise.resolve({}))
    await expect(putImage(validGetUrlResponse, file)).resolves.toEqual(expected)
  })

  it('returns error when failed with AxiosError which has response', async () => {
    const expected = {
      message: 'code: 400, msg: "some data is missing!"'
    }
    axios.post
      .mockImplementationOnce(() => Promise.reject(
        mockAxiosError(400, 'some data is missing!', false)
      ))
    await expect(putImage(validGetUrlResponse, file)).resolves.toStrictEqual(expected)
  })

  it('returns error when failed with AxiosError which doesn\'t have response', async () => {
    const expected = {
      message: '{}'
    }
    axios.post
      .mockImplementationOnce(() => Promise.reject(
        mockAxiosError(400, 'some data is missing!', true)
      ))
    await expect(putImage(validGetUrlResponse, file)).resolves.toStrictEqual(expected)
  })
})
