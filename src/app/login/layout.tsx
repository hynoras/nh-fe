import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Noheir | Login",
  description: "Login to your account"
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
