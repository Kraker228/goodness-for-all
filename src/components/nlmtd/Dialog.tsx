"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { focusRing } from "./styles";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

/**
 * Modale dialoog op basis van het native <dialog>-element: de browser regelt
 * focus vasthouden, Escape en de achtergrond. Stijl volgt ReportModal
 * (beige vlak, groene rand, harde schaduw).
 */
export default function Dialog({ open, onClose, title, children }: Props) {
  const ref = useRef<HTMLDialogElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        // Klik op de achtergrond (buiten het vlak) sluit de dialoog.
        if (event.target === event.currentTarget) onClose();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-[720px] max-h-[calc(100%-2rem)] p-0 bg-sandstone-beige text-evergreen border-2 border-evergreen shadow-[8px_8px_0_0_var(--color-evergreen)] backdrop:bg-evergreen/70"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-sandstone-beige border-b-2 border-evergreen px-gutter md:px-8 py-4">
        <h2 id={titleId} className="hero-title font-bold text-headline-md">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Sluiten"
          className={`shrink-0 w-11 h-11 flex items-center justify-center border-2 border-evergreen hover:bg-evergreen hover:text-sandstone-beige cursor-pointer ${focusRing}`}
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            close
          </span>
        </button>
      </div>
      <div className="px-gutter md:px-8 py-6 font-body-md text-body-md">{children}</div>
    </dialog>
  );
}
