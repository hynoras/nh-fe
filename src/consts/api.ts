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
  getList: (search: string, role: string, page: number, pageSize: number) =>
    `${userPath}?search=${search}&role=${role}&page=${page}&pageSize=${pageSize}`,
  getMe: `${userPath}/me`,
  getDetail: (userId: string) => `${userPath}/${userId}`
}
