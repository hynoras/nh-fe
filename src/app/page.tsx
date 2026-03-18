import { redirect } from "next/navigation"
import { serverHttp } from "lib/http.server"
import { getMeApi } from "service/user"

export default async function IndexPage() {
  const response = await getMeApi(serverHttp)

  if (response.success && response.data) {
    redirect("/home")
  } else {
    redirect("/login")
  }
}
