import React, { useState } from 'react'
import ImgCrop from 'antd-img-crop'
import { Upload, Menu, Dropdown, Spin } from 'antd'
import { UploadFile } from 'antd/lib/upload/interface'
import Avatar from 'antd/lib/avatar/avatar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faTrashCan, faPen } from '@fortawesome/free-solid-svg-icons'
import styles from './AvatarUpload.module.css'
import { getAvatarUploadUrl, deletAvatar } from '../../api/userActions'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { authSlice } from '../../redux/auth/authSlice'
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface'
import { useIsMounted } from '../../hooks/useIsMounted'

export const AvatarUpload = ({ avatar }: { avatar: string | undefined }) => {
  const dispatch = useDispatch()
  const [avatarLoading, setAvatarLoading] = useState(false)
  const isMounted = useIsMounted()

  const onUpload = async ({
    file: fileOrigin,
    onError,
    onProgress,
    onSuccess,
    withCredentials,
  }: RcCustomRequestOptions) => {
    setAvatarLoading(true)
    try {
      const data = await getAvatarUploadUrl().onErrorsButCancelAndAuth(() => {
        setAvatarLoading(false)
      })
      let file = fileOrigin as UploadFile
      let fileType = 'image/jpeg'
      if (file.type) {
        fileType = file.type
      }
      const url = data.uploadUrl
      await axios.put(url, file, {
        withCredentials,
        headers: {
          'Content-Type': encodeURI(fileType),
        },
        onUploadProgress: ({ total, loaded }) => {
          if (onProgress) {
            onProgress({
              percent: 67 + +Math.round((loaded / total) * 50).toFixed(2),
            })
          }
        },
      })
      dispatch(authSlice.actions.updateUserAvatar(data.avatar))
      if (isMounted()) {
        setAvatarLoading(false)
      }
    } catch (error) {
      await deletAvatar()
    }
  }
  const onDeleteAvatar = async () => {
    try {
      setAvatarLoading(true)
      await deletAvatar()
      dispatch(authSlice.actions.updateUserAvatar(''))
      setAvatarLoading(false)
    } catch (error) {
      console.error(error)
      setAvatarLoading(false)
    }
  }
  const editAvatarMenu = (
    <Menu className={styles['tw-edit-avatar-menu']}>
      <ImgCrop
        minZoom={0.1}
        maxZoom={10}
        modalTitle='Edit Your Avatar'
        shape='round'
        rotate={true}
        cropperProps={{
          restrictPosition: false,
        }}
      >
        <Upload
          name='avatar'
          showUploadList={false}
          disabled={avatarLoading}
          customRequest={onUpload}
        >
          <Menu.Item
            key='upload-new'
            icon={<FontAwesomeIcon icon={faPen} />}
            disabled={avatarLoading}
          >
            Upload New Avatar
          </Menu.Item>
        </Upload>
      </ImgCrop>
      <Menu.Item
        key='delete'
        onClick={onDeleteAvatar}
        icon={<FontAwesomeIcon icon={faTrashCan} />}
        disabled={avatarLoading}
      >
        Delete Current Avatar
      </Menu.Item>
    </Menu>
  )

  return (
    <>
      <Dropdown overlay={editAvatarMenu} trigger={['click']}>
        {avatarLoading ? (
          <Avatar className={styles['user-icon']} size={50} src={<Spin />} />
        ) : (
          <Avatar
            className={styles['user-icon']}
            size={50}
            src={avatar}
            icon={
              <FontAwesomeIcon
                icon={faUser}
                color='rgba(102, 101, 101, 0.849'
              />
            }
          />
        )}
      </Dropdown>
    </>
  )
}
