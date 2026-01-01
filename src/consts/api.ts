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
  getList: (search: string, page: number, pageSize: number) =>
    `${userPath}?search=${search}&page=${page}&pageSize=${pageSize}`,
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
  getList: (search: string, page: number, pageSize: number) =>
    `${permissionGroupPath}?search=${search}&page=${page}&pageSize=${pageSize}`,
  getDetail: (permissionGroupId: string) => `${permissionGroupPath}/${permissionGroupId}`,
  create: `${permissionGroupPath}`,
  update: (permissionGroupId: string) => `${permissionGroupPath}/${permissionGroupId}`,
  delete: (permissionGroupId: string) => `${permissionGroupPath}/${permissionGroupId}`
}

const experimentPath = "experiments"
export const experimentPaths = {
  getList: (search: string, page: number, pageSize: number) =>
    `${experimentPath}?search=${search}&page=${page}&pageSize=${pageSize}`,
  getDetail: (experimentId: string) => `${experimentPath}/${experimentId}`,
  create: `${experimentPath}`,
  update: (experimentId: string) => `${experimentPath}/${experimentId}`,
  delete: (experimentId: string) => `${experimentPath}/${experimentId}`
}
