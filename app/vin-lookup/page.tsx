import { Suspense } from "react";
import { VinLookupContent } from "./vin-lookup-content";

export default function VinLookupPage() {
  return (
    <Suspense>
      <VinLookupContent />
    </Suspense>
  );
}
