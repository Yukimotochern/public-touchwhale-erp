import app from '../../server'

import request from 'supertest'
import axios from 'axios'
import fs from 'fs'
import FormData from 'form-data'
// import imageCompression from 'browser-image-compression'

let verification_code: string
let resetPassword_url: string
let resetPassword_token: string
let token: string
let getUploadAvatar: any

const RequestServer = request(app)

export const User_Test = () =>
  describe('Test all user routes.', () => {
    it('POST SignUp User', async () => {
      const res = await RequestServer.post('/api/v1/user/signUp')
        .send({
          email: 'testEmail@gmail.com',
        })
        .set('Accept', 'application/json')

      expect(res.status).toBe(200)
      expect(typeof res.body.message).toBe('string')
    })

    it('Get verification code from mailtrap...', async () => {
      const options = {
        headers: { 'Api-Token': '8dc36cac15386caa83a61fdaeced2cb8' },
      }

      // await fetch('https://mailtrap.io/api/v1/user', options)
      const res_inbox = await axios.get(
        'https://mailtrap.io/api/v1/inboxes/1616396/messages',
        options
      )
      const mail_id = res_inbox.data[0]['id']

      const res_mail = await axios.get(
        `https://mailtrap.io/api/v1/inboxes/1616396/messages/${mail_id}/body.txt`,
        options
      )
      const data = res_mail.data.split(' ')
      verification_code = data[data.length - 1].split('\n')[0]

      console.log(
        '****'.bgBlue,
        'Verification code:',
        verification_code,
        '****'.bgBlue
      )
    })

    it('POST Verify User', async () => {
      const res = await RequestServer.post('/api/v1/user/signUp/verify')
        .send({
          email: 'testEmail@gmail.com',
          password: verification_code,
        })
        .set('Accept', 'application/json')

      expect(res.status).toBe(200)
      expect(typeof res.body.data).toBe('string')
      token = res.body.data
    })

    it('PUT Set Password', async () => {
      const res = await RequestServer.put('/api/v1/user/changePassword')
        .set('Cookie', [`token=${token}`])
        .send({
          newPassword: 'test1234',
        })

      expect(res.status).toBe(200)
    })

    it('POST User SignIn', async () => {
      const res = await RequestServer.post('/api/v1/user/signIn')
        .send({
          email: 'testEmail@gmail.com',
          password: 'test1234',
        })
        .set('Accept', 'application/json')

      expect(res.status).toBe(200)
    })

    it('GET Get User infomation', async () => {
      const res = await RequestServer.get('/api/v1/user').set('Cookie', [
        `token=${token}`,
      ])

      expect(res.status).toBe(200)
      expect(typeof res.body).toBe('object')
    })

    it('PUT Update User', async () => {
      const res = await RequestServer.put('/api/v1/user')
        .send({
          username: 'testAccount',
          company: 'FacGooAmazFilx',
        })
        .set('Accept', 'application/json')
        .set('Cookie', [`token=${token}`])

      expect(res.status).toBe(200)
      expect(typeof res.body).toBe('object')
      // expect(console.log(res))
    })

    it('GET Upload Avatar URL', async () => {
      const res = await RequestServer.get('/api/v1/user/avatar').set('Cookie', [
        `token=${token}`,
      ])

      expect(res.status).toBe(200)
      expect(typeof res.body).toBe('object')

      getUploadAvatar = res.body.data
    })

    it('Upload Avatar to B2 ...', async () => {
      const { uploadUrl, avatar } = getUploadAvatar
      let image = fs.createReadStream(
        './src/__tests__/public/testAvatar.png'
      ) as any
      let data = image.toString()
      const formData = new FormData()

      formData.append('image', image)

      await axios.put(
        uploadUrl,
        { data: Buffer.from(data, 'binary') },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'image/jpeg' },
        }
      )
    })

    it('Delete Avatar', async () => {
      const res = await RequestServer.delete('/api/v1/user/avatar').set(
        'Cookie',
        [`token=${token}`]
      )

      expect(res.status).toBe(200)
      expect(res.body.message).toBe('Avatar deleted.')
    })

    it('Change Password', async () => {
      const res = await RequestServer.put('/api/v1/user/changePassword')
        .send({
          currentPassword: 'test1234',
          newPassword: 'Test2345',
        })
        .set('Cookie', [`token=${token}`])

      expect(res.status).toBe(200)
    })

    it('Forget Passwrod', async () => {
      const res = await RequestServer.post('/api/v1/user/forgetPassword').send({
        email: 'testEmail@gmail.com',
      })

      expect(res.status).toBe(200)
    })

    it('Get resetPassword url from mailtrap...', async () => {
      const options = {
        headers: { 'Api-Token': '8dc36cac15386caa83a61fdaeced2cb8' },
      }

      // await fetch('https://mailtrap.io/api/v1/user', options)
      const res_inbox = await axios.get(
        'https://mailtrap.io/api/v1/inboxes/1616396/messages',
        options
      )
      const mail_id = res_inbox.data[0]['id']

      const res_mail = await axios.get(
        `https://mailtrap.io/api/v1/inboxes/1616396/messages/${mail_id}/body.txt`,
        options
      )
      const data = res_mail.data.split(' ')
      resetPassword_url = data[data.length - 1].split('\n')[0]
      resetPassword_token = resetPassword_url
        .split('/')
        [resetPassword_url.split('/').length - 1].split('#')[1]

      console.log(
        '****'.bgBlue,
        'Reset Password URL:',
        resetPassword_url,
        'Reset Password Token:',
        resetPassword_token,
        '****'.bgBlue
      )
    })

    it('Reset Password First Call', async () => {
      const res = await RequestServer.put('/api/v1/user/forgetPassword').send({
        token: resetPassword_token,
      })

      expect(res.status).toBe(200)
      expect(typeof res.body.data.token).toBe('string')

      resetPassword_token = res.body.data.token
      console.log(
        '****'.bgBlue,
        'New Reset Password Token:',
        resetPassword_token,
        '****'.bgBlue
      )
    })

    it('Resrt Password Second Call', async () => {
      const res = await RequestServer.put('/api/v1/user/forgetPassword').send({
        token: resetPassword_token,
        password: 'test3456',
      })

      expect(res.status).toBe(200)
      expect(res.body.message).toBe('Your password has been set.')
    })

    it('POST User SignIn After Resetpassword', async () => {
      const res = await RequestServer.post('/api/v1/user/signIn')
        .send({
          email: 'testEmail@gmail.com',
          password: 'test3456',
        })
        .set('Accept', 'application/json')

      expect(res.status).toBe(200)
      token = res.body
    })

    // it('POST Create Worker', async () => {
    // 	const res = await request(app)
    // 		.post('/api/v1/user/workers')
    // 		.send({
    // 			login_name: 'TestWorker',
    // 			password: 'test1234',
    // 			role_type: 'default',
    // 			permission_groups: ['human resource'],
    // 			provider: 'TouchWhale',
    // 			isActice: true,
    // 			isOwner: false,
    // 		})
    // 		.set('Accept', 'application/json')
    // 		.set('Cookie', [`token=${token}`])
    // 	console.log(res)

    // 	expect(res.status).toBe(200)
    // })
  })
