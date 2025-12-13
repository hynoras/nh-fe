"use client"
import { useSearchParams } from "next/navigation"
import RoleList from "./_components/role-list"
import UserList from "./_components/user-list"

const UsersAndAccessPage = () => {
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab")

  const renderContent = () => {
    if (tab === "users") {
      return <UserList />
    }
    return <RoleList />
  }

  return renderContent()
}

export default UsersAndAccessPage
