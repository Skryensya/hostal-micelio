import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";

export function ButtonShowcase() {
  return (
    <div className="flex justify-center items-center gap-1">
      <Button variant="primary">Button Primary</Button>
      <Button variant="secondary">Button Secondary</Button>
      <Button variant="outline">Button Outline</Button>
      <Button variant="link">Button Link</Button>

      <Button variant="primary" size="icon">
        <ArrowRightIcon className="h-4 w-4" />
      </Button>
      <Button variant="secondary" size="icon">
        <ArrowRightIcon className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon">
        <ArrowRightIcon className="h-4 w-4" />
      </Button>
      <Button variant="link" size="icon">
        <ArrowRightIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
