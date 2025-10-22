import type { Metadata } from "next";

import Container from "@/components/Container";
import styles from "@/styles/legal.module.scss";

export const metadata: Metadata = {
  title: "Mentions légales | SeeLess SeeBetter",
  description:
    "Informations légales et coordonnées de SeeLess SeeBetter pour toute question relative au site.",
};

export default function MentionsLegalesPage() {
  return (
    <Container className={styles.page}>
      <h1 className={styles.title}>Mentions légales</h1>
      <p className={styles.intro}>
        Ce site est édité par SeeLess SeeBetter. Vous trouverez ci-dessous l’ensemble des
        informations requises par la législation française concernant l’identification de
        l’éditeur, le responsable de publication et les modalités de contact.
      </p>

      <section className={styles.section}>
        <h2>Éditeur du site</h2>
        <p>
          SeeLess SeeBetter, société spécialisée dans l’accessibilité numérique et les solutions
          inclusives. Pour toute question concernant le contenu publié, merci de nous contacter.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Responsable de la publication</h2>
        <p>Le responsable de la publication est l’équipe communication de SeeLess SeeBetter.</p>
      </section>

      <section className={styles.section}>
        <h2>Hébergement</h2>
        <p>
          Le site est hébergé par notre prestataire cloud au sein de l’Union européenne. Les
          infrastructures sont surveillées et sécurisées pour garantir la protection de vos
          données.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Propriété intellectuelle</h2>
        <p>
          L’ensemble des contenus présents sur ce site (textes, images, vidéos, graphismes, logos)
          est protégé par le droit de la propriété intellectuelle. Toute reproduction, distribution
          ou modification sans autorisation préalable est strictement interdite.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Contact</h2>
        <p>
          Pour toute demande d’information ou d’assistance, vous pouvez nous écrire à l’adresse
          suivante :
        </p>
        <p>
          <a href="mailto:contact@seeless-seebetter.fr">contact@seeless-seebetter.fr</a>
        </p>
      </section>
    </Container>
  );
}
