import Container from '@/components/Container';
import ArticleFeed from '@/components/ArticleFeed';

import styles from '@/styles/category-page.module.scss';

type Props = {
  title: string;
  description?: string;
  categories: string[];
  pageSize?: number;
};

export default function CategoryPage({
  title,
  description,
  categories,
  pageSize = 6,
}: Props) {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <Container className={styles.heroInner}>
          <div>
            <span className={styles.badge}>Selection</span>
            <h1 className={styles.title}>{title}</h1>
            {description ? <p className={styles.description}>{description}</p> : null}
          </div>
        </Container>
      </section>

      <section className={styles.feedSection}>
        <Container>
          <ArticleFeed categories={categories} pageSize={pageSize} />
        </Container>
      </section>
    </div>
  );
}
