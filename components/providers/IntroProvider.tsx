"use client";

import { createContext, useContext, useMemo, useState } from "react";

type IntroContextValue = {
  introDone: boolean;
  completeIntro: () => void;
};

const IntroContext = createContext<IntroContextValue>({
  introDone: false,
  completeIntro: () => {},
});

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [introDone, setIntroDone] = useState(false);

  const value = useMemo(
    () => ({
      introDone,
      completeIntro: () => setIntroDone(true),
    }),
    [introDone]
  );

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export function useIntro() {
  return useContext(IntroContext);
}
