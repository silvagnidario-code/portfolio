import { revalidateTag } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

/**
 * Fase 9 — invalidazione per tag.
 *
 * Ogni lettura pubblica passa da `unstable_cache` con un tag per collection/
 * global (vedi `lib/payload.ts` e `lib/queries.ts`). Questi hook sono l'altra
 * metà: alla pubblicazione (o cancellazione) di un documento, invalidano
 * esattamente il tag di quella collection/global, cosa che rende la pagina
 * fresca alla prossima richiesta invece che dopo un timeout arbitrario.
 *
 * Granularità volutamente per collection e non per singolo documento: un
 * salvataggio in "projects" invalida tutta la cache "projects", non solo lo
 * slug toccato. Costa qualche lettura in più nel caso raro di pubblicazioni
 * simultanee, evita ogni possibilità di un tag scritto male che lascia una
 * pagina non aggiornata — scambio giudicato corretto per un sito con questo
 * volume di pubblicazioni.
 *
 * Ogni hook accetta più tag: "clients", "services", "team-members" e
 * "industries" sono anche letti per relazione dentro "pages" e "projects"
 * (un blocco Servizi può incorporare un servizio scelto a mano), quindi il
 * loro salvataggio invalida anche quelle due cache — altrimenti un progetto
 * già in cache continuerebbe a mostrare il vecchio titolo di un servizio
 * modificato.
 */

export const revalidateOnChange =
  (...tags: string[]): CollectionAfterChangeHook =>
  ({ doc }) => {
    for (const tag of tags) revalidateTag(tag)
    return doc
  }

export const revalidateOnDelete =
  (...tags: string[]): CollectionAfterDeleteHook =>
  ({ doc }) => {
    for (const tag of tags) revalidateTag(tag)
    return doc
  }

export const revalidateGlobalOnChange =
  (...tags: string[]): GlobalAfterChangeHook =>
  ({ doc }) => {
    for (const tag of tags) revalidateTag(tag)
    return doc
  }
