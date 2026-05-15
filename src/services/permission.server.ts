import { User } from "app/(protected)/user-and-access/user/_domain/entity/user"
import { serverHttp } from "lib/api/http.server"
import { getMeApi } from "services/user"

export type PermissionCheckResult =
  | { authorized: true; user: User }
  | { authorized: false; user: null }

/**
 * Server-side permission check.
 * Calls the backend using the server HTTP client (with forwarded cookies)
 * and verifies the user has ALL of the required permission codes.
 */
export const checkPermissionServer = async (
  ...requiredPermissions: string[]
): Promise<PermissionCheckResult> => {
  try {
    const response = await getMeApi(serverHttp)

    if (!response.success || !response.data) {
      return { authorized: false, user: null }
    }

    const user = response.data
    const userPermissions = user.permissionCodes || []

    const hasAllPermissions = requiredPermissions.every((permission) =>
      userPermissions.includes(permission)
    )

    if (!hasAllPermissions) {
      return { authorized: false, user: null }
    }

    return { authorized: true, user }
  } catch (error) {
    console.error("Server permission check failed:", error)
    return { authorized: false, user: null }
  }
}
