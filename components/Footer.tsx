import Link from "next/link";

import Container from "@/components/Container";
import styles from "@/styles/footer.module.scss";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container className={styles.inner}>
        <span>© {currentYear} SeeLess SeeBetter</span>
        <Link href="/mentions-legales" className={styles.link}>
          Mentions légales
        </Link>
      </Container>
    </footer>
  );
}
