import Header from "components/Header";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-800">
      <Header />
      <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">
        Tailwind Gradient Test
      </h1>
    </main>
  )
}
