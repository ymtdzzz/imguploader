import axios from 'axios'

import { getUrl } from './api'

jest.mock('axios')

describe('getUrl', () => {
  it('returns pre-signed url with params from an API', async () => {
    const data = {
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

    axios.post.mockImplementationOnce(() => Promise.resolve({
      data: data
    }))

    await expect(getUrl('image/png', 3000)).resolves.toEqual(data)
  })

  it('returns pre-signed url with params from an API (local)', async () => {
    const data = {
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

    axios.post.mockImplementationOnce(() => Promise.resolve({
      data: {
        body: JSON.stringify(data)
      }
    }))

    await expect(getUrl('image/png', 3000)).resolves.toEqual(data)
  })

  it('returns null when policy is not malformed', async () => {
    const data = {
      message: 'Succeeded',
      url: 'http://offline-imguploader.localhost:8000',
      policy: {
        malformed: 'wrong data!!'
      },
    }

    axios.post.mockImplementationOnce(() => Promise.resolve({
      data: data
    }))

    await expect(getUrl('image/png', 3000)).resolves.toBeNull()
  })

  it('returns null when data is not malformed', async () => {
    const data = {
      malformed: 'wrong data!!!'
    }

    axios.post.mockImplementationOnce(() => Promise.resolve({
      data: data
    }))

    await expect(getUrl('image/png', 3000)).resolves.toBeNull()
  })
})
