import RegularUserModel from '../models/RegularUser'
import GoogleStrategy from 'passport-google-oauth20'
import ErrorResponse from './errorResponse'
import crypto from 'crypto'

const passportOAuth = (passport: any) => {
	passport.use(
		new GoogleStrategy.Strategy(
			{
				clientID:
					'854772499634-6dpb25lhg30eh5b77f83pq3uufgjau0q.apps.googleusercontent.com',
				clientSecret: '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',
				callbackURL:
					'http://localhost:5000/api/v1/regularUser/googleOAuth/callback',
			},
			async function (accessToken, refreshToken, profile, cb) {
				try {
					cb(null, profile)

					const { picture, email } = profile._json

					const user = await RegularUserModel.findOne({ email })

					if (!user) {
						const user = new RegularUserModel({
							email,
							avatar: picture,
							provider: 'Google',
							password: crypto.randomBytes(10).toString('hex'),
						})

						await user.save()
					}
				} catch (err) {
					return new ErrorResponse('BBBBBBBBBB')
				}
			}
		)
	)
}

export default passportOAuth
