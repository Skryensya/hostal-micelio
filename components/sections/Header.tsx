import Link from "next/link";
import { ModeToggle } from "@/components/ModeToggle";

export function Header() {
  return (
    <header className="py-3 sticky bg-surface-light top-0 border-b border-border-light z-50">
      <div className=" py-0 flex items-center justify-between container mx-auto ">
        <Link href={"/"} className="flex items-center gap-4">
          <div className="h1 !font-extralight">Hostal Micelio</div>
        </Link>

        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-4">
            <Link href={"/"}>Estadia prolongada</Link>
            <Link href={"#about"}>Sobre nosotros</Link>
            <Link href={"#contact"}>Contactanos</Link>
            <Link href={"#"}>Consulta Precios</Link>
          </nav>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}