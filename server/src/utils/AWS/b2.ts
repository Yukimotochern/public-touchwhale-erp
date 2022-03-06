import AWS from 'aws-sdk'

const endpoint = new AWS.Endpoint('s3.us-west-000.backblazeb2.com')

const s3 = new AWS.S3({
  endpoint,
  region: 'us-west-000',
  credentials: {
    accessKeyId: process.env.B2_KEY_ID,
    secretAccessKey: process.env.B2_SECRET_KEY,
  },
  signatureVersion: 'v4',
})

// @todo This function will handle more upload image condition with other routes .
export const uploadImg = async (resource: string, id: string) => {
  const Key = `${resource}/${id}`

  let url = await s3.getSignedUrlPromise('putObject', {
    Bucket: 'tw-user-data',
    ContentType: 'image/*',
    Key,
  })
  return { Key, url }
}

export const deleteImg = async (resource: string, id: string) => {
  const Key = `${resource}/${id}`
  await s3
    .deleteObject({
      Bucket: 'tw-user-data',
      Key,
    })
    .promise()
}
