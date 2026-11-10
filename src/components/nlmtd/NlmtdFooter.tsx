import Image from "next/image";
import { CONTACT_EMAIL } from "@/lib/nlmtd/config";
import { NLMTD_ALT } from "./NlmtdHeader";
import TermsButton from "./TermsButton";
import { focusRingOnDark } from "./styles";

export default function NlmtdFooter() {
  return (
    <footer className="bg-evergreen border-t-2 border-evergreen w-full text-sandstone-beige">
      <div className="max-w-[1200px] mx-auto px-container-margin py-section-gap-sm flex flex-col md:flex-row md:items-center justify-between gap-gutter">
        <div className="font-body-md text-body-md">
          <p className="font-bold">Stichting Goodness for All</p>
          <p className="opacity-90">Van der Duijn van Maasdamweg 480, Rotterdam · KvK 73004521</p>
          <p className="mt-1">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className={`underline underline-offset-4 hover:text-harvest-orange ${focusRingOnDark}`}
            >
              {CONTACT_EMAIL}
            </a>
            <span aria-hidden="true"> · </span>
            <TermsButton onDark>Algemene voorwaarden</TermsButton>
          </p>
        </div>
        <Image
          src="/nlmtd/Logo_wit___tekst.png"
          alt={NLMTD_ALT}
          width={2000}
          height={2000}
          sizes="96px"
          className="h-20 w-auto self-start md:self-auto"
        />
      </div>
    </footer>
  );
}
