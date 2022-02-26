import GoogleStrategy, { Profile } from 'passport-google-oauth20'

export interface RequestWithGoogleProfile extends Express.Request {
	user?: Profile
}

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
				cb(null, profile)
			}
		)
	)
}

export default passportOAuth
