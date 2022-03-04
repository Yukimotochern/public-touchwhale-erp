import AWS from 'aws-sdk'
import RegularUserModel from '../../models/RegularUser'

const endpoint = new AWS.Endpoint('s3.us-west-000.backblazeb2.com')

const s3 = new AWS.S3({
	endpoint,
	region: 'us-west-000',
	signatureVersion: 'v4',
})

// @todo This function will handle more upload image condition with other routes .
export default async function (resource: string, id: string) {
	const Key = `${resource}/${id}`
	let url = await s3.getSignedUrlPromise('putObject', {
		Bucket: 'tw-user-data',
		ContentType: 'image/*',
		Key,
	})
	return { Key, url }
}
