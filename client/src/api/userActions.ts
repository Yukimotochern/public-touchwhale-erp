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

export const signUp = (
  email: SignUp.Body['email'],
  abortController?: AbortController
) => chain(SignUp.API).post('/user/signUp', { email }, abortController)

export const verify = (
  credential: Verify.Body,
  abortController?: AbortController
) => chain(Verify.API).post('/user/signUp/verify', credential, abortController)

export const signIn = (
  credential: SignIn.Body,
  abortController?: AbortController
) => chain(SignIn.API).post('/user/signIn', credential, abortController)

export const signOut = (abortController?: AbortController) =>
  chain(new api()).get('/user/signOut', abortController)

export const updateUser = (
  edits: Update.Body,
  abortController?: AbortController
) => chain(Update.API).put('/user', edits, abortController)

export const getUser = (abortController?: AbortController) =>
  chain(GetUser.API).get('/user', abortController)

export const getUserUnchained = (abortController?: AbortController) =>
  GetUser.API.get('/user', abortController)

export const getAvatarUploadUrl = (abortController?: AbortController) =>
  chain(GetAvatarUploadUrl.API).get('/user/avatar', abortController)

export const deletAvatar = (abortController?: AbortController) =>
  chain(new api()).delete('/user/avatar', undefined, abortController)

export const changePassword = (
  body: ChangePassword.Body,
  abortController?: AbortController
) =>
  chain(ChangePassword.API).put('/user/changePassword', body, abortController)

export const forgetPassword = (
  email: ForgetPassword.Body['email'],
  abortController?: AbortController
) =>
  chain(ForgetPassword.API).post(
    '/user/forgetPassword',
    { email },
    abortController
  )

export const resetPassword = (
  body: ResetPassword.Body,
  abortController?: AbortController
) => chain(ResetPassword.API).put('/user/forgetPassword', body, abortController)

export const getWorkers = (abortController?: AbortController) =>
  chain(GetWorkers.API).get('/user/workers', abortController)

export const getWorker = (id: string, abortController?: AbortController) =>
  chain(GetWorker.API).get(`/user/worker/${id}`, abortController)

export const createWorker = (
  worker: CreateWorker.Body,
  abortController?: AbortController
) => chain(CreateWorker.API).post('/user/worker', worker, abortController)

export const updateWorker = (
  id: string,
  worker: UpdateWorker.Body,
  abortController?: AbortController
) => chain(UpdateWorker.API).put(`/worker/${id}`, worker, abortController)

export const deleteWork = (id: string, abortController?: AbortController) =>
  chain(DeleteWorker.API).delete(
    `/user/worker/${id}`,
    undefined,
    abortController
  )
