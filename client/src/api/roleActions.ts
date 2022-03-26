import {
  GetRole,
  GetRoles,
  CreateRole,
  UpdateRole,
  DeleteRole,
} from 'api/dist/role/roleApi'
import { chain } from './apiErrorDealer'

export const getRole = (id: string, abortController?: AbortController) =>
  chain(GetRole.API).get(`/role/${id}`, abortController)

export const getRoles = (abortController?: AbortController) =>
  chain(GetRoles.API).get('/role', abortController)

export const createRole = (
  newRole: CreateRole.Body,
  abortController?: AbortController
) => chain(CreateRole.API).post('/role', newRole, abortController)

export const updateRole = (
  id: string,
  updates: UpdateRole.Body,
  abortController?: AbortController
) => chain(UpdateRole.API).put(`/role/${id}`, updates, abortController)

export const deleteRole = (id: string, abortController?: AbortController) =>
  chain(DeleteRole.API).delete(`/role/${id}`, undefined, abortController)
