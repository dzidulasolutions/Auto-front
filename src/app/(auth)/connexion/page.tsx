import { Suspense } from "react";
import ConnexionForm from "@/components/auth/connexion-form";

export default function Page() {
  return (
    <Suspense>
      <ConnexionForm />
    </Suspense>
  );
}