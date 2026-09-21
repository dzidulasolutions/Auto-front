import { Suspense } from "react";
import MotDePasseOublieForm from "@/components/auth/mot-de-passe-oublie-form";

export default function Page() {
  return (
    <Suspense>
      <MotDePasseOublieForm />
    </Suspense>
  );
}