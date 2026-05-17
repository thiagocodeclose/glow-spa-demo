"use client";
import { useEffect, useRef, useState } from "react";
import type { Garrison365ElementPayload } from "@/components/Garrison365LivePreview";

/** Props to spread on the DOM element for Canva-style canvas editing */
export interface Garrison365EditProps {
  "data-cg-el": string;
}

/**
 * Metadata describing an element — used to auto-generate the admin panel
 * without any hardcoded TEMPLATE_ELEMENTS arrays.
 */
export interface Garrison365ElementMeta {
  /** Human-readable section name: 'Hero', 'Classes', 'Pricing', etc. */
  section: string;
  /** Human-readable label: 'Headline', 'CTA Button', 'Description' */
  label: string;
  /** Element type for the admin panel icon + controls */
  type: "text" | "eyebrow" | "button" | "image" | "link" | "widget";
}

/** Global registry — populated by each useGarrison365Element call, read by Garrison365LivePreview */

/**
 * Returns the current value of a canvas element, updating in real-time
 * when the Garrison365 admin sends GARRISON365_ELEMENT_UPDATE / GARRISON365_ELEMENT_BATCH.
 *
 * Also:
 *  - auto-registers the element in window.__GARRISON365_REGISTRY__ so Garrison365LivePreview
 *    can send a GARRISON365_MANIFEST to the admin without any hardcoded element arrays.
 *  - returns `editProps` to spread on the DOM node for Canva-style editing overlay.
 *
 * Usage:
 *   const el = useGarrison365Element('hero_headline', { content: 'Default' }, { section: 'Hero', label: 'Headline', type: 'text' });
 *   <h1 {...el.editProps}>{el.content}</h1>
 */
export function useGarrison365Element(
  id: string,
  defaults: Partial<Garrison365ElementPayload>,
  meta?: Garrison365ElementMeta,
): Garrison365ElementPayload & { visible: boolean; editProps: Garrison365EditProps } {
  const [overrides, setOverrides] = useState<Partial<Garrison365ElementPayload>>({});
  const registeredRef = useRef(false);

  // Auto-register in global registry (idempotent — safe to re-run)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.__GARRISON365_REGISTRY__) {
      window.__GARRISON365_REGISTRY__ = new Map();
    }
    window.__GARRISON365_REGISTRY__.set(id, { defaults, meta });
    registeredRef.current = true;

    return () => {
      // Only unregister on actual unmount (component removed from DOM)
      window.__GARRISON365_REGISTRY__?.delete(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent<Garrison365ElementPayload>).detail;
      if (detail.id !== id) return;
      setOverrides((prev: Partial<Garrison365ElementPayload>) => ({
        ...prev,
        ...detail,
      }));
    }
    window.addEventListener("garrison365:element", handler);
    return () => window.removeEventListener("garrison365:element", handler);
  }, [id]);

  const merged = { id, ...defaults, ...overrides } as Garrison365ElementPayload & {
    visible: boolean;
  };
  if (merged.visible === undefined) merged.visible = true;

  return {
    ...merged,
    editProps: { "data-cg-el": id },
  };
}
