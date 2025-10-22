import Image from "next/image";
import Link from "next/link";

import Container from "@/components/Container";
import styles from "@/styles/footer.module.scss";

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/seelessseebetter",
    icon: (
      <svg aria-hidden="true" className={styles.socialIcon} viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M16.5 3h-9A4.5 4.5 0 0 0 3 7.5v9A4.5 4.5 0 0 0 7.5 21h9a4.5 4.5 0 0 0 4.5-4.5v-9A4.5 4.5 0 0 0 16.5 3Zm3 12.75A3.75 3.75 0 0 1 15.75 19.5h-7.5A3.75 3.75 0 0 1 4.5 15.75v-7.5A3.75 3.75 0 0 1 8.25 4.5h7.5A3.75 3.75 0 0 1 19.5 8.25Zm-3.375-6.9a1.125 1.125 0 1 0 1.125 1.125 1.125 1.125 0 0 0-1.125-1.125ZM12 7.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 7.5Zm0 7.2A2.7 2.7 0 1 1 14.7 12 2.7 2.7 0 0 1 12 14.7Z"
        />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@seelessseebetter",
    icon: (
      <svg aria-hidden="true" className={styles.socialIcon} viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M21.6 7.2a2.4 2.4 0 0 0-1.68-1.68C18.224 5 12 5 12 5s-6.224 0-7.92.52A2.4 2.4 0 0 0 2.4 7.2 25.391 25.391 0 0 0 2 12a25.391 25.391 0 0 0 .4 4.8 2.4 2.4 0 0 0 1.68 1.68C5.776 18.998 12 19 12 19s6.224 0 7.92-.52a2.4 2.4 0 0 0 1.68-1.68A25.391 25.391 0 0 0 22 12a25.391 25.391 0 0 0-.4-4.8ZM10.5 15.1V8.9L15.5 12Z"
        />
      </svg>
    ),
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container className={styles.inner}>
        <Link
          href="/"
          className={styles.logoSlot}
          aria-label="Retour à l'accueil"
        >
          <Image
            src="/img/image.png"
            alt="SeeLess SeeBetter"
            width={60}
            height={60}
            className={styles.logoImage}
            sizes="60px"
            priority
          />
        </Link>
        <div className={styles.center}>
          <span className={styles.brand}>
            © {currentYear} SeeLess SeeBetter
          </span>
          <Link href="/mentions-legales" className={styles.link}>
            Mentions légales
          </Link>
        </div>
        <div className={styles.socials} aria-label="Réseaux sociaux">
          {socialLinks.map((social) => (
            <Link
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className={styles.socialLink}
            >
              {social.icon}
            </Link>
          ))}
        </div>
      </Container>
    </footer>
  );
}
