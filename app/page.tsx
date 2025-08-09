"use client";

import TopNavigation from "@/components/layout/TopNavigation";
import Hero from "@/components/layout/Hero";
import CardContainer from "@/components/layout/CardContainer";

export default function Home() {
  return (
    <div>
      <TopNavigation />
      <Hero />
      <CardContainer />
    </div>
  );
}
