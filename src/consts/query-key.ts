export const queryKey = {
  users: (filter?: { search?: string; page?: number; pageSize?: number }) =>
    filter ? ["users", filter] : ["users"],
  userDetail: (userId: string) => ["userDetail", userId],
  permissionGroups: (filter?: { search?: string; page?: number; pageSize?: number }) =>
    filter ? ["permissionGroups", filter] : ["permissionGroups"],
  permissionGroupDetail: (permissionGroupId: string) => [
    "permissionGroupDetail",
    permissionGroupId
  ],
  permissions: () => ["permissions"],
  experiments: (filter?: { search?: string; page?: number; pageSize?: number }) =>
    filter ? ["experiments", filter] : ["experiments"],
  experimentDetail: (experimentId: string) => ["experimentDetail", experimentId]
}
