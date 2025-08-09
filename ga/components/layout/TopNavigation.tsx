import Link from "next/link";
import styles from "./styles/TopNavigation.module.css";
import BedtimeRoundedIcon from '@mui/icons-material/BedtimeRounded';

export default function TopNavigation() {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <h1 className={styles.title}>Looking Glass</h1>
        <div className={styles.menu}>
          <Link href="/">Search</Link>
          <Link href="/about">Decks</Link>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.menu}>
          <Link href="/register">Register</Link>
          <Link href="/login">Login</Link>
          <BedtimeRoundedIcon sx={{ cursor: "pointer", scale: 0.85 }} />
        </div>
      </div>
    </div>
  );
}