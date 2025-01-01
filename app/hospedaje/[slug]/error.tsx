'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Algo salió mal</h2>
      <p className="text-gray-600 mb-8">
        Lo sentimos, ha ocurrido un error al cargar la información de la habitación.
      </p>
      <Button
        onClick={() => reset()}
        variant="outline"
      >
        Intentar de nuevo
      </Button>
    </div>
  );
} 