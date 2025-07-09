import { InnerHero } from "@/components/sections/InnerHero";
import { ReviewSection } from "@/components/sections/ReviewSection";
import { Breadcrumb } from "@/components/composed/_Breadcrumb";

export default function ReviewsPage() {
  return (
    <>
      <InnerHero title="Lo que dicen nuestros huespedes"></InnerHero>
      <Breadcrumb
        levels={[
          { label: "Inicio", href: "/" },
          { label: "Reseñas", href: "/reviews" },
        ]}
      />
      <ReviewSection />
    </>
  );
}
