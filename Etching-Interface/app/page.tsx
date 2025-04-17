'use client';

import { GameScene } from "@/components/canvas/GameScene";
import Hero from "@/components/sections/Hero";

export default function Home() {
  return (
    <main className="bg-[#1a1510]">
      <GameScene />
      <div className="relative">
        <Hero />
      </div>
    </main>
  );
}
