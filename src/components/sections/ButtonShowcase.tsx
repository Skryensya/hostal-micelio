import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";

export function ButtonShowcase() {
  return (
    <div className="space-y-4">
      <div className="flex gap-1">
        <Button variant="primary">Button Primary</Button>
        <Button variant="secondary">Button Secondary</Button>
        <Button variant="outline">Button Outline</Button>
        <Button variant="ghost">Button Ghost</Button>
        <Button variant="link">Button Link</Button>
      </div>

      <div className="flex gap-1">
        <Button variant="primary" size="icon">
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon">
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
        <Button variant="link" size="icon">
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
