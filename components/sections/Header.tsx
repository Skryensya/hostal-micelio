import Link from "next/link";
import { ModeToggle } from "@/components/ModeToggle";
import { Flower } from "lucide-react";
import { cn } from "@/lib/utils";
export function Header() {
  // check with state if i have scrolled down

  return (
    <header
      id="header"
      className={cn(
        "py-2 sticky bg-surface-light top-0 border-b border-border-light z-50 transition-all"
      )}
    >
      <div className=" py-0 flex items-center justify-between container mx-auto ">
        <Link href={"/"} className="flex items-center gap-4">
          <div className="h1 !font-extralight flex">
            Hostal Micelio <Flower size={20} />
          </div>
        </Link>

        <div className="flex items-center gap-4 ">
          <nav className="flex items-center gap-4">
            <Link href={"/habitaciones"}>Habitaciones</Link>
            <Link href={"#about"}>Nosotros</Link>
            <Link href={"#contact"}>Contactanos</Link>
            <Link href={"#"}>Consulta Precios</Link>
          </nav>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
