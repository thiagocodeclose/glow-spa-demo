"use client";
import { useEffect, useRef, useState } from "react";
import type { KorivaElementPayload } from "@/components/KorivaLivePreview";

/** Props to spread on the DOM element for Canva-style canvas editing */
export interface KorivaEditProps {
  "data-cg-el": string;
}

/**
 * Metadata describing an element — used to auto-generate the admin panel
 * without any hardcoded TEMPLATE_ELEMENTS arrays.
 */
export interface KorivaElementMeta {
  /** Human-readable section name: 'Hero', 'Classes', 'Pricing', etc. */
  section: string;
  /** Human-readable label: 'Headline', 'CTA Button', 'Description' */
  label: string;
  /** Element type for the admin panel icon + controls */
  type: "text" | "eyebrow" | "button" | "image" | "link" | "widget";
}

/** Global registry — populated by each useKorivaElement call, read by KorivaLivePreview */

/**
 * Returns the current value of a canvas element, updating in real-time
 * when the Koriva admin sends KORIVA_ELEMENT_UPDATE / KORIVA_ELEMENT_BATCH.
 *
 * Also:
 *  - auto-registers the element in window.__KORIVA_REGISTRY__ so KorivaLivePreview
 *    can send a KORIVA_MANIFEST to the admin without any hardcoded element arrays.
 *  - returns `editProps` to spread on the DOM node for Canva-style editing overlay.
 *
 * Usage:
 *   const el = useKorivaElement('hero_headline', { content: 'Default' }, { section: 'Hero', label: 'Headline', type: 'text' });
 *   <h1 {...el.editProps}>{el.content}</h1>
 */
export function useKorivaElement(
  id: string,
  defaults: Partial<KorivaElementPayload>,
  meta?: KorivaElementMeta,
): KorivaElementPayload & { visible: boolean; editProps: KorivaEditProps } {
  const [overrides, setOverrides] = useState<Partial<KorivaElementPayload>>({});
  const registeredRef = useRef(false);

  // Auto-register in global registry (idempotent — safe to re-run)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.__KORIVA_REGISTRY__) {
      window.__KORIVA_REGISTRY__ = new Map();
    }
    window.__KORIVA_REGISTRY__.set(id, { defaults, meta });
    registeredRef.current = true;

    return () => {
      // Only unregister on actual unmount (component removed from DOM)
      window.__KORIVA_REGISTRY__?.delete(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent<KorivaElementPayload>).detail;
      if (detail.id !== id) return;
      setOverrides((prev: Partial<KorivaElementPayload>) => ({
        ...prev,
        ...detail,
      }));
    }
    window.addEventListener("koriva:element", handler);
    return () => window.removeEventListener("koriva:element", handler);
  }, [id]);

  const merged = { id, ...defaults, ...overrides } as KorivaElementPayload & {
    visible: boolean;
  };
  if (merged.visible === undefined) merged.visible = true;

  return {
    ...merged,
    editProps: { "data-cg-el": id },
  };
}
