import { redirect } from "next/navigation"
import { navigationRoutes } from "consts/navigation"

export default function SettingPage() {
  redirect(navigationRoutes.setting.profile)
}
