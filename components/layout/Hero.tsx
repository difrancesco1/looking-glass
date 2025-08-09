import Image from "next/image";
import bg from "@/public/heroSuzaku.jpg";
import styles from "./styles/Hero.module.css";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";
export default function Hero() {
  const [mode, setMode] = useState("Decks");

  return (
    <div className={styles.hero}>
      <Image src={bg} alt="Hero" fill className={styles.heroImage} />
      <div className={styles.heroContent}>
        <div className={styles.heroTextContainer}>
          <h1 className={styles.heroTitle}>LOOKING GLASS</h1>
          <span className={styles.heroSubtitle}>A modern deck builder for Grand Archive®</span>
        </div>
        <Toggle options={["Decks", "Cards"]} value={mode} onChange={setMode} className={styles.heroToggle} />
        <Input type="text" placeholder="Search" className={styles.heroInput} />
      </div>
    </div>
  );
}