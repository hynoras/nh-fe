import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Noheir | Setting",
  description: "Setting your account"
}

export default function SettingLayout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
