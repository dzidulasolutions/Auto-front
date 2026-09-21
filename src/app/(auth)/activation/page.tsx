import { Suspense } from "react";
import ActivationForm from "@/components/auth/activation-form";

export default function Page() {
  return (
    <Suspense>
      <ActivationForm />
    </Suspense>
  );
}