interface OptionType {
  protocol: string
  host?: string
  token: string
  sixDigits: string
}

interface forgetPasswordOptionType extends Omit<OptionType, 'sixDigits'> {}

export const forgetPasswordMessage = (option: forgetPasswordOptionType) => {
  const { protocol, host, token } = option

  const resetUrl =
    process.env.NODE_ENV === 'production'
      ? `${protocol}://${host}/resetPassword#${token}`
      : `${process.env.FRONTEND_DEV_URL}/resetPassword#${token}`
  const message = `Click the following link to reset password: \n ${resetUrl}`
  return message
}

interface sixDigitsOptionType extends Pick<OptionType, 'sixDigits'> {}
export const sixDigitsMessage = (option: sixDigitsOptionType) => {
  const { sixDigits } = option
  const message = `Your six digits number are: ${sixDigits}`

  return message
}
