import styles from "./TextImageModule.module.css";

/**
 * TextImageModule
 * Modulo a due colonne: testo da un lato, immagine dall'altro.
 * Pensato per essere coerente con il resto del sito (usa le stesse
 * custom property CSS del tema: colori "grey-*", font "Zen Kaku Gothic New",
 * spaziature "--space-*" e il raggio "--corner-glass-lg" usato dall'header).
 *
 * Props
 * ----------------------------------------------------------------------
 * eyebrow       string   Piccola etichetta sopra il titolo (opzionale)
 * title         string   Titolo del modulo
 * description   string   Testo descrittivo
 * cta           object   { label, href } — link/CTA opzionale
 * image         object   { src, alt, width, height }
 * imagePosition "right" | "left"   Su quale lato sta l'immagine (default "right")
 * fullBleed     boolean  true = immagine a piena larghezza, senza margini
 *                         né raggio agli angoli (es. hero a tutta pagina).
 *                         false (default) = immagine "contenuta", con gli
 *                         angoli arrotondati come l'header (--corner-glass-lg).
 *
 * Esempio
 * ----------------------------------------------------------------------
 * <TextImageModule
 *   eyebrow="Servizio"
 *   title="Titolo del modulo"
 *   description="Testo descrittivo del modulo, breve e chiaro."
 *   cta={{ label: "Scopri di più", href: "/progetto" }}
 *   image={{ src: "/img/esempio.jpg", alt: "Descrizione immagine", width: 1200, height: 900 }}
 *   imagePosition="left"   // per invertire le colonne basta cambiare questa prop
 *   fullBleed={false}
 * />
 */
export default function TextImageModule({
  eyebrow,
  title,
  description,
  cta,
  image,
  imagePosition = "right",
  fullBleed = false,
}) {
  const isImageLeft = imagePosition === "left";

  return (
    <section
      className={`${styles.section} ${isImageLeft ? styles.reversed : ""}`}
    >
      <div className={styles.text}>
        {eyebrow ? <span className={styles.eyebrow}>{eyebrow}</span> : null}
        {title ? <h2 className={styles.title}>{title}</h2> : null}
        {description ? <p className={styles.description}>{description}</p> : null}
        {cta ? (
          <a className={styles.cta} href={cta.href}>
            {cta.label}
          </a>
        ) : null}
      </div>

      <div className={styles.imageCol}>
        <div
          className={`${styles.imageFrame} ${fullBleed ? styles.fullBleed : ""}`}
        >
          {/* Sostituisci <img> con next/image se il progetto lo usa già */}
          <img
            className={styles.image}
            src={image?.src}
            alt={image?.alt ?? ""}
            width={image?.width}
            height={image?.height}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
