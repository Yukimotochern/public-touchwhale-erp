interface OptionType {
	protocol: string
	host?: string
	token: string
	sixDigits: string
}

interface forgetPasswordOptionType extends Omit<OptionType, 'sixDigits'> {}

export const forgetPasswordMessage = (option: forgetPasswordOptionType) => {
	const { protocol, host, token } = option

	const resetUrl = `${protocol}://${host}/api/v1/user/forgetpassword/${token}`
	const message = `Make a PUT request to: \n ${resetUrl}`
	return message
}

interface sixDigitsOptionType extends Pick<OptionType, 'sixDigits'> {}
export const sixDigitsMessage = (option: sixDigitsOptionType) => {
	const { sixDigits } = option
	const message = `Your six digits number are: ${sixDigits}`

	return message
}
