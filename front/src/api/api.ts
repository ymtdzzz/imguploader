import axios from 'axios'

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
): Promise<GetUrlResponse | null> => {
  const url = process.env.REACT_APP_ENDPOINT ?? ''
  
  const data = await axios.post(url, {
    contentType: contentType,
    contentLength: contentLength,
  })
  
  if (isGetUrlResponse(data)) {
    return data
  } else {
    console.log('data is not GetUrlResponse!')
    return null
  }
}

/*
export const putImage = async (
  policy: S3PostPolicy,
  // TODO: file-path, etc
): Promise<AxiosResponse<any>> => {
  // TODO:
}
*/
