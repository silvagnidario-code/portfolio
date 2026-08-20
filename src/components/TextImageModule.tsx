import styles from "./TextImageModule.module.css";

type TextImageModuleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  cta?: { label: string; href: string };
  image: {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  /** Su quale lato sta l'immagine. Default "right". */
  imagePosition?: "left" | "right";
  /** true = immagine a piena larghezza, senza raggio agli angoli. */
  fullBleed?: boolean;
};

/**
 * TextImageModule
 * Modulo a due colonne: testo da un lato, immagine dall'altro.
 * Usa le stesse custom property CSS del tema (colori, font, e il raggio
 * --corner-glass-lg, lo stesso dell'header) quindi eredita lo stile del sito
 * senza bisogno di configurazione aggiuntiva.
 */
export default function TextImageModule({
  eyebrow,
  title,
  description,
  cta,
  image,
  imagePosition = "right",
  fullBleed = false,
}: TextImageModuleProps) {
  const isImageLeft = imagePosition === "left";

  return (
    <section className={`${styles.section} ${isImageLeft ? styles.reversed : ""}`}>
      <div className={styles.text}>
        {eyebrow ? <span className={styles.eyebrow}>{eyebrow}</span> : null}
        <h2 className={styles.title}>{title}</h2>
        {description ? <p className={styles.description}>{description}</p> : null}
        {cta ? (
          <a className={styles.cta} href={cta.href}>
            {cta.label}
          </a>
        ) : null}
      </div>

      <div className={styles.imageCol}>
        <div className={`${styles.imageFrame} ${fullBleed ? styles.fullBleed : ""}`}>
          {/* Sostituisci con next/image se il resto del progetto lo usa già */}
          <img
            className={styles.image}
            src={image.src}
            alt={image.alt ?? ""}
            width={image.width}
            height={image.height}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
