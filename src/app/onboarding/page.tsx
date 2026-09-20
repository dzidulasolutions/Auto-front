"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconlyArrowRight } from "@/components/ui/icons";
import { useRouter } from "next/navigation";

const Page = () => {
  const [slide, setSlide] = useState(1);
  const [identifier, setIdentifier] = useState("");
  const router = useRouter();

  useEffect(() => {
    const seen = localStorage.getItem("autogo_onboarding_seen");
    const savedIdentifier = localStorage.getItem("autogo_last_identifier");
    if (seen) {
      router.replace(
        savedIdentifier
          ? `/connexion?identifiant=${encodeURIComponent(savedIdentifier)}`
          : "/connexion"
      );
    }
  }, [router]);

  const handleContinue = () => {
    localStorage.setItem("autogo_onboarding_seen", "1");
    if (identifier) {
      localStorage.setItem("autogo_last_identifier", identifier);
      router.push(`/connexion?identifiant=${encodeURIComponent(identifier)}`);
    } else {
      router.push("/connexion");
    }
  };

  return (
    <section className="w-screen h-screen">

      <div className="w-full h-full bg-black flex justify-center items-center image-bg p-4">
        <div className="w-full lg:w-120 h-full flex flex-col justify-center items-center">
          <div className="w-full h-[10%] pb-16 font-ui font-bold text-xl text-white">Autogo.</div>

          <div className="relative h-[90%] flex items-end">
            <AnimatePresence mode="wait">
              {slide === 1 && (
                <motion.div
                  key="slide-1"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="w-full pb-6"
                >
                  <div className="w-full flex flex-col gap-2">
                    <p className="font-ui text-xs text-white/60 uppercase">
                      Près de chez vous
                    </p>
                    <h1 className="font-ui text-2xl text-white font-bold">
                      La solution moderne pour gérer votre tontine en toute
                      sérénité.
                    </h1>
                    <p className="font-ui text-sm text-white/60">
                      Sécurité • Confidentialité • Disponibilité
                    </p>
                  </div>

                  <button
                    onClick={() => setSlide(2)}
                    className="w-full h-11 flex justify-between pl-4 pr-1 items-center bg-white mt-10 text-black font-ui text-sm font-medium"
                  >
                    Commencer dès maintenant
                    <span className="w-10 h-9 bg-black text-white flex justify-center items-center">
                      <IconlyArrowRight color="currentColor" size={24} />
                    </span>
                  </button>
                </motion.div>
              )}

              {slide === 2 && (
                <motion.div
                  key="slide-2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="w-full pb-6"
                >
                  <p className="font-ui text-sm text-white/60 mb-4">
                    Simplifiez la gestion de votre tontine, épargne et crédit.
                  </p>

                  <h2 className="font-ui text-white uppercase text-xs font-semibold">
                    Connexion
                  </h2>

                  <div className="mt-3 w-full">
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Email ou Téléphone"
                      className="w-full h-11 placeholder:text-white/50 text-white font-ui text-sm border outline-none border-white/30 p-4 bg-transparent"
                    />
                  </div>

                  <button
                    onClick={handleContinue}
                    className="w-full h-11 flex justify-between pl-4 pr-1 items-center bg-white mt-6 text-black font-ui text-sm font-medium"
                  >
                    Continuer
                    <span className="w-10 h-9 bg-black text-white flex justify-center items-center">
                      <IconlyArrowRight color="currentColor" size={24} />
                    </span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

    </section>
  );
};

export default Page;