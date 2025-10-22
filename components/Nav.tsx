'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import Container from '@/components/Container';
import styles from '@/styles/nav.module.scss';

type NavItem = {
  href: string;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Accueil' },
  { href: '/paris', label: 'Paris' },
  { href: '/fashion', label: 'Fashion' },
  { href: '/shopping', label: 'Shopping' },
];

export default function Nav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <header className={styles.wrapper}>
      <nav className={styles.nav} aria-label="Navigation principale">
        <Container className={styles.inner}>
          <Link href="/" className={styles.brand}>
            SeeLess SeeBetter
          </Link>

          <button
            type="button"
            className={styles.toggle}
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-controls="menu-principal"
            aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            <span className={styles.srOnly}>
              {isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            </span>
            <span className={`${styles.bar} ${isOpen ? styles.barTopOpen : ''}`} />
            <span className={`${styles.bar} ${isOpen ? styles.barMiddleOpen : ''}`} />
            <span className={`${styles.bar} ${isOpen ? styles.barBottomOpen : ''}`} />
          </button>

          <div
            id="menu-principal"
            className={`${styles.menu} ${isOpen ? styles.menuOpen : ''}`}
          >
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.link} ${isActive ? styles.active : ''}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </Container>
      </nav>
    </header>
  );
}
