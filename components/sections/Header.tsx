// import { cn } from "@/lib/utils";
// import { MenuBar } from "../composed/MenuBar";
import Link from "next/link";
import { ModeToggle } from "@/components/ModeToggle";

export function Header() {
  return (
    <header className="py-5 bg-background absolute top-0 left-0 right-0 z-50 border-b border-border">
      <div className=" py-2 flex items-center justify-between container mx-auto ">
        <Link href={"/"}>Hostal micelio</Link>

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
