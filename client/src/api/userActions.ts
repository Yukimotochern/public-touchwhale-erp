import {
  SignUp,
  Verify,
  SignIn,
  Update,
  GetUser,
  GetAvatarUploadUrl,
  ChangePassword,
  ForgetPassword,
  ResetPassword,
  GetWorkers,
  GetWorker,
  CreateWorker,
  UpdateWorker,
  DeleteWorker,
} from 'api/dist/user/userApi'
import { chain } from './apiErrorDealer'
import { api } from 'api/dist/api'

export const signUp = async (
  email: SignUp.Body['email'],
  abortController?: AbortController
) => chain(SignUp.API).post('/user/signUp', { email }, abortController)

export const verify = async (
  credential: Verify.Body,
  abortController?: AbortController
) => chain(Verify.API).post('/user/signUp/verify', credential, abortController)

export const signIn = async (
  credential: SignIn.Body,
  abortController?: AbortController
) => chain(SignIn.API).post('/user/signIn', credential, abortController)

export const signOut = async (abortController?: AbortController) =>
  chain(new api({})).get('/user/signOut')

export const updateUser = async (
  edits: Update.Body,
  abortController?: AbortController
) => chain(Update.API).post('/user', edits, abortController)

export const getUser = async (abortController?: AbortController) =>
  chain(GetUser.API).get('/user', abortController)

export const getUserUnchained = async (abortController?: AbortController) =>
  GetUser.API.get('/user', abortController)

export const getAvatarUploadUrl = async (abortController?: AbortController) =>
  chain(GetAvatarUploadUrl.API).get('/user/avatar', abortController)

export const deletAvatar = async (abortController?: AbortController) =>
  chain(new api({})).delete('/user/avatar', undefined, abortController)

export const changePassword = async (
  body: ChangePassword.Body,
  abortController?: AbortController
) =>
  chain(ChangePassword.API).put('/user/changePassword', body, abortController)

export const forgetPassword = async (
  email: ForgetPassword.Body['email'],
  abortController?: AbortController
) =>
  chain(ForgetPassword.API).post(
    '/user/forgetPassword',
    { email },
    abortController
  )

export const resetPassword = async (
  body: ResetPassword.Body,
  abortController?: AbortController
) => chain(ResetPassword.API).put('/user/forgetPassword', body, abortController)

export const getWorkers = async (abortController?: AbortController) =>
  chain(GetWorkers.API).get('/user/workers', abortController)

export const getWorker = async (
  id: string,
  abortController?: AbortController
) => chain(GetWorker.API).get(`/user/worker/${id}`, abortController)

export const createWorker = async (
  worker: CreateWorker.Body,
  abortController?: AbortController
) => chain(CreateWorker.API).post('/user/worker', worker, abortController)

export const updateWorker = async (
  id: string,
  worker: UpdateWorker.Body,
  abortController?: AbortController
) => chain(UpdateWorker.API).put(`/worker/${id}`, worker, abortController)

export const deleteWork = async (
  id: string,
  abortController?: AbortController
) =>
  chain(DeleteWorker.API).delete(
    `/user/worker/${id}`,
    undefined,
    abortController
  )
