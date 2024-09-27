import Link from "next/link";
import { ModeToggle } from "@/components/ModeToggle";

export function Header() {
  return (
    <header className="py-3 absolute top-0 left-0 right-0 z-50 border-b border-border">
      <div className=" py-0 flex items-center justify-between container mx-auto ">
        <Link href={"/"} className="flex items-center gap-4">
          {/* <Image
            src="/assets/LOGO_COLOR.png"
            alt="Hostal Micelio"
            className="object-cover"
            priority
            unoptimized
            width={80}
            height={80}
          /> */}
          <div className="h1">Hostal Micelio</div>
        </Link>

        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-4">
            <Link href={"/"}>Home</Link>
            <Link href={"#about"}>About</Link>
            <Link href={"#contact"}>Contact</Link>
            <Link href={"#blog"}>Blog</Link>
          </nav>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
