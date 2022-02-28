import React from 'react'
import styles from './VerifyCodeInput.module.css'
import VFI from 'react-verification-input'

interface VFIProps {
  value?: string
  onChange?: (value: string) => void
}

const VerificationInput: React.FC<VFIProps> = ({ value, onChange }) => {
  return (
    <VFI
      removeDefaultStyles
      validChars='0-9'
      placeholder='∙'
      classNames={{
        container: styles.container,
        character: styles.character,
        characterInactive: styles['character--inactive'],
        characterSelected: styles['character--selected'],
      }}
      onChange={onChange}
      value={value}
    />
  )
}

export default VerificationInput
