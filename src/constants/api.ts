import { buildUrl } from "utils/api"

/**
 * Auth API paths
 */
const authPath = "auth"
export const authPaths = {
  login: `${authPath}/login`,
  register: `${authPath}/register`,
  logout: `${authPath}/logout`
}

const userPath = "users"
export const userPaths = {
  getList: (search?: string, page?: number, pageSize?: number) =>
    buildUrl(userPath, { search, page, pageSize }),
  getMe: `${userPath}/me`,
  getDetail: (userId: string) => `${userPath}/${userId}`,
  create: `${userPath}`,
  update: (userId: string) => `${userPath}/${userId}`,
  delete: `${userPath}`
}

const permissionPath = "permissions"
export const permissionPaths = {
  getList: `${permissionPath}`,
  getDetail: (permissionId: string) => `${permissionPath}/${permissionId}`
}

const permissionGroupPath = "permission-groups"
export const permissionGroupPaths = {
  getList: (search?: string, page?: number, pageSize?: number) =>
    buildUrl(permissionGroupPath, { search, page, pageSize }),
  getDetail: (permissionGroupId: string) => `${permissionGroupPath}/${permissionGroupId}`,
  create: `${permissionGroupPath}`,
  update: (permissionGroupId: string) => `${permissionGroupPath}/${permissionGroupId}`,
  delete: (permissionGroupId: string) => `${permissionGroupPath}/${permissionGroupId}`
}

const experimentPath = "experiments"
export const experimentPaths = {
  getList: (search: string, page: number, pageSize: number) =>
    buildUrl(experimentPath, { search, page, pageSize }),
  getDetail: (experimentId: string) => `${experimentPath}/${experimentId}`,
  create: `${experimentPath}`,
  update: (experimentId: string) => `${experimentPath}/${experimentId}`,
  updateStatus: (experimentId: string) => `${experimentPath}/${experimentId}/status`,
  delete: (experimentId: string) => `${experimentPath}/${experimentId}`
}
