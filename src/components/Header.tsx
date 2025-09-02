import Image from "next/image"

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black text-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        <Image
            className=""
            src="/Logo.svg"
            alt="QVQ logo"
            width={100}
            height={16}
            priority
        />
        <nav className="hidden md:flex space-x-6 items-center">
          <a href="#about" className="nav-link">About</a>
          <a href="#projects" className="nav-link">Projects</a>
          <a href="#contact" className="nav-link">Contact</a>
          <a href="/resume.pdf" download className="resume-button">Download resume</a>
        </nav>
      </div>
    </header>
  );
}
