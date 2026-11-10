import { CONTACT_EMAIL } from "@/lib/nlmtd/config";
import { textLink } from "./styles";

/** Getoond in plaats van de samensteller na de aanmelddeadline. */
export function SignupClosed() {
  return (
    <div
      role="status"
      className="mt-8 max-w-2xl border-l-8 border-harvest-orange bg-pure-mist border-2 border-evergreen p-gutter md:p-8"
    >
      <h3 className="hero-title font-bold text-headline-md text-evergreen">Aanmelden is gesloten</h3>
      <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
        Aanmelden kon tot en met 15 december. Wil je toch nog meedoen of heb je een vraag? Mail naar{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className={textLink}>
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </div>
  );
}
