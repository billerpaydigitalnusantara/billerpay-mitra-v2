"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/navigation";


declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>["push"]>[1]>;
  }
}

export function Providers({children}: { children: React.ReactNode }) {
  const router = useRouter();
  const useHref = (href: string) => process.env.BASE_URL + href;

  return (
      <HeroUIProvider locale="en-ID" navigate={router.push} useHref={useHref}>
        <NextThemesProvider attribute="class" defaultTheme="light">
          {children}
        </NextThemesProvider>
      </HeroUIProvider>
  );
}
