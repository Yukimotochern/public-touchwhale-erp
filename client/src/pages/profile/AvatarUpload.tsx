import React from 'react'
import ImgCrop from 'antd-img-crop'
import { Upload } from 'antd'

export const AvatarUpload = () => {
  return (
    <ImgCrop>
      <Upload listType='picture-card' name='avatar' showUploadList={false}>
        + Add image
      </Upload>
    </ImgCrop>
  )
}
