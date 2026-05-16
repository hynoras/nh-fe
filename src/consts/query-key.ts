export const queryKey = {
  user: {
    all: ["users"] as const,
    lists: () => [...queryKey.user.all, "list"] as const,
    list: (filter: any) => [...queryKey.user.lists(), filter] as const,
    details: () => [...queryKey.user.all, "detail"] as const,
    detail: (userId: string) => [...queryKey.user.details(), userId] as const
  },
  permissionGroup: {
    all: ["permissionGroups"] as const,
    lists: () => [...queryKey.permissionGroup.all, "list"] as const,
    list: (filter: any) => [...queryKey.permissionGroup.lists(), filter] as const,
    details: () => [...queryKey.permissionGroup.all, "detail"] as const,
    detail: (permissionGroupId: string) =>
      [...queryKey.permissionGroup.details(), permissionGroupId] as const
  },
  experiment: {
    all: ["experiments"] as const,
    lists: () => [...queryKey.experiment.all, "list"] as const,
    list: (filter: any) => [...queryKey.experiment.lists(), filter] as const,
    details: () => [...queryKey.experiment.all, "detail"] as const,
    detail: (experimentId: string) =>
      [...queryKey.experiment.details(), experimentId] as const
  },
  permission: {
    all: ["permissions"] as const
  }
}
