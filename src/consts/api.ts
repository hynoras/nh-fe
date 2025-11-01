/**
 * Auth API paths
 */
const authPath = "/auth"
export const authPaths = {
  login: `${authPath}/login`,
  register: `${authPath}/register`,
  logout: `${authPath}/logout`
}

const userPath = "/users"
export const userPaths = {
  getList: `${userPath}`,
  getMe: `${userPath}/me`,
  getDetail: (userId: string) => `${userPath}/${userId}`
}
