import Link from "next/link";
import styles from "./styles/TopNavigation.module.css";
import BedtimeRoundedIcon from "@mui/icons-material/BedtimeRounded";
import { useAuth } from "@/hooks/useAuth";

export default function TopNavigation() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <h1 className={styles.title}>Looking Glass</h1>
        <div className={styles.menu}>
          <Link href="/">Search</Link>
          <Link href="/builder">Deck Builder</Link>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.menu}>
          {isAuthenticated ? (
            <>
              <p>{user?.username}</p>
              <Link onClick={() => logout()} href="/account/login">
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link href="/account/register">Register</Link>
              <Link href="/account/login">Login</Link>
            </>
          )}
          <BedtimeRoundedIcon sx={{ cursor: "pointer", scale: 0.85 }} />
        </div>
      </div>
    </div>
  );
}
