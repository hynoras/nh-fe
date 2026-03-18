/**
 * Check if a user has all the required permission codes.
 * Works with both server-side and client-side User.
 */
export function hasPermissions(
  permissionCodes: string[] | undefined,
  ...required: string[]
): boolean {
  if (!permissionCodes) return false
  return required.every((code) => permissionCodes.includes(code))
}
