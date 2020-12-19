import axios, { AxiosResponse } from 'axios'

interface S3PostPolicy {
  'x-amz-signature': string,
  'x-amz-date': string,
  'x-amz-security-token': string,
  'x-amz-credential': string,
  'x-amz-algorithm': string,
  policy: string,
  'Content-Type': string,
  key: string,
  bucket: string,
}

interface GetUrlResponse {
  message: string,
  url: string,
  policy: S3PostPolicy,
}

export interface Error {
  message: string,
}

// eslint-disable-next-line
export const isError = (arg: any): arg is Error => {
  return (
    arg.message !== undefined
    && Object.keys(arg).length === 1
  )
}

// eslint-disable-next-line
const isS3PostPolicy = (arg: any): arg is S3PostPolicy => {
  return (
    arg['x-amz-signature'] !== undefined
      && arg['x-amz-date'] !== undefined
      && arg['x-amz-security-token'] !== undefined
      && arg['x-amz-credential'] !== undefined
      && arg['x-amz-algorithm'] !== undefined
      && arg.policy !== undefined
      && arg['Content-Type'] !== undefined
      && arg.key !== undefined
      && arg.bucket !== undefined
  )
}

// eslint-disable-next-line
const isGetUrlResponse = (arg: any): arg is GetUrlResponse => {
  return (
    arg.message !== undefined
      && arg.url !== undefined
      && arg.policy !== undefined
      && isS3PostPolicy(arg.policy)
  )
} 

export const getUrl = async (
  contentType: string,
  contentLength: number,
): Promise<GetUrlResponse | Error> => {
  const url = process.env.REACT_APP_API_ENDPOINT ?? ''

  let data: AxiosResponse | Error = await axios.post(url, {
    contentType: contentType,
    contentLength: contentLength,
  }).catch((e) => {
    return {
      message: e.toString()
    }
  })

  if (isError(data)) {
    return data
  }

  if (data.data.body !== undefined) {
    // response from local api wrapped in 'body' key
    data = JSON.parse(data.data.body)
  } else {
    data = data.data
  }
  
  if (isGetUrlResponse(data)) {
    return data
  } else {
    return {
      message: 'received data is malformed'
    }
  }
}

export const putImage = async (
  getUrlRepsponse: GetUrlResponse,
  file: File,
  // TODO: file-path, etc
): Promise<string | Error> => {
  const data = new FormData()

  // marshal policy instance
  data.append('policy', getUrlRepsponse.policy.policy)
  data.append('x-amz-signature', getUrlRepsponse.policy['x-amz-signature'])
  data.append('x-amz-date', getUrlRepsponse.policy['x-amz-date'])
  data.append('x-amz-security-token', getUrlRepsponse.policy['x-amz-security-token'])
  data.append('x-amz-credential', getUrlRepsponse.policy['x-amz-credential'])
  data.append('x-amz-algorithm', getUrlRepsponse.policy['x-amz-algorithm'])
  data.append('Content-Type', file.type)
  data.append('key', getUrlRepsponse.policy.key),
  data.append('bucket', getUrlRepsponse.policy.bucket)
  data.append('file', file)

  let url = `${getUrlRepsponse.url}`
  if (process.env.NODE_ENV == 'development') {
    url = `${url}/${getUrlRepsponse.policy.bucket}`
  }

  await axios.post(
    url,
    data,
  ).catch((e) => {
    return {
      message: e.toString()
    }
  })

  let s3Url = process.env.REACT_APP_S3_ENDPOINT ?? ''
  if (process.env.NODE_ENV == 'development') {
    s3Url = `${s3Url}/${getUrlRepsponse.policy.bucket}/${getUrlRepsponse.policy.key}`
  } else {
    s3Url = `${s3Url}/${getUrlRepsponse.policy.key}`
  }
  console.log(s3Url)

  return s3Url
}

