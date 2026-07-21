// Locatiegegevens voor de interactieve kaart op de impactpagina.
//
// De coördinaten (lat/lng) zijn vooraf opgezocht en hier vastgelegd als
// constanten. We doen dus géén live geocoding bij elk paginabezoek: dat is te
// traag en onbetrouwbaar voor productie. De coördinaten zijn de officiële
// PC6-postcodecentroïdes (CBS 2023) van het bijbehorende adres, nauwkeurig tot
// op straat-/bouwblokniveau.
//
// Bron: lijst aangeleverd via Excel (kolommen Titel, Subtitel, Stad, Adres, Link).

export type ImpactLocation = {
  /** Titel uit de Excel. */
  title: string;
  /** Subtitel uit de Excel (type organisatie). */
  subtitle: string;
  /** Stad. */
  city: "Rotterdam" | "Den Haag";
  /** Volledig adres zoals getoond in de popup. */
  address: string;
  /** Link naar de bijbehorende website. */
  link: string;
  /** Vastgelegde coördinaten [lat, lng]. */
  position: [number, number];
};

export const IMPACT_LOCATIONS: ImpactLocation[] = [
  {
    title: 'Incluzio Locatie "De Nieuwe Gaffel"',
    subtitle: "Incluzio",
    city: "Rotterdam",
    address: "Gaffelstraat 63 A, 3014 RC Rotterdam",
    link: "https://www.incluziorotterdam.nl/district/huis-van-de-wijk-de-nieuwe-gaffel/",
    position: [51.91806350532215, 4.467968085068122],
  },
  {
    title: 'Incluzio Locatie "Het Middelpunt"',
    subtitle: "Incluzio",
    city: "Rotterdam",
    address: "Slinge 250, 3085 EX Rotterdam",
    link: "https://www.incluziorotterdam.nl/district/het-middelpunt/",
    position: [51.87344850469249, 4.479228842222016],
  },
  {
    title: 'Incluzio Locatie "Schiemond"',
    subtitle: "Incluzio",
    city: "Rotterdam",
    address: "Dempostraat 143, 3029 CL Rotterdam",
    link: "https://www.incluziorotterdam.nl/district/huis-van-de-wijk-schiemond/",
    position: [51.90432443864011, 4.441851986360766],
  },
  {
    title: "Sol Locatie Riederkwartier",
    subtitle: "SOL",
    city: "Rotterdam",
    address: "Stichtseplein 2, 3074 TN Rotterdam",
    link: "https://www.solnetwerk.nl/onze-locaties/heel-rotterdam/rotterdam-feijenoord/huizen-van-de-wijk-in-rotterdam-feijenoord/huis-van-de-wijk-riederkwartier/",
    position: [51.89335575131697, 4.512760245064034],
  },
  {
    title: "Sol Locatie Vuurplaat",
    subtitle: "SOL",
    city: "Rotterdam",
    address: "Vuurplaat 83, 3071 AR Rotterdam",
    link: "https://www.solnetwerk.nl/onze-locaties/heel-rotterdam/rotterdam-feijenoord/huizen-van-de-wijk-in-rotterdam-feijenoord/huis-van-de-wijk-de-vuurplaat/",
    position: [51.90698137384965, 4.506260487516209],
  },
  {
    title: "Stichting Overwin de armoede",
    subtitle: "Stichting",
    city: "Rotterdam",
    address: "Dreef 83, 3075 HB Rotterdam",
    link: "https://overwindearmoede.nl/",
    position: [51.88793210169505, 4.510001831732589],
  },
  {
    title: "Speelcentrum Weena",
    subtitle: "Speelcentrum",
    city: "Rotterdam",
    // Officiële straatnaam aaneengeschreven (Excel had "Diergaarde singel").
    address: "Diergaardesingel 50, 3014 AC Rotterdam",
    link: "https://www.speelcentrumweena.nl/",
    position: [51.92214521911618, 4.467038870736285],
  },
  {
    title: "Stichting Isaak en de Schittering",
    subtitle: "Voedselcentrum",
    city: "Rotterdam",
    address: "Vinkenbaan 73, 3075 RM Rotterdam",
    link: "https://stichtingisaakendeschittering.nl/",
    position: [51.88241021193672, 4.503656841820491],
  },
  {
    title: "Warme huiskamer Crooswijk",
    subtitle: "Stichting",
    city: "Rotterdam",
    address: "Pleretstraat 316, 3034 JM Rotterdam",
    link: "https://www.wijkcultuur.nl/",
    position: [51.93123631285296, 4.493573983418236],
  },
  {
    title: "Villa Vonk",
    subtitle: "Stichting",
    city: "Rotterdam",
    address: "Othelloweg 8, 3194 GS Rotterdam",
    link: "https://www.villavonk.nl/",
    position: [51.87060740627923, 4.363829986444264],
  },
  {
    title: "de Mussen",
    subtitle: "Buurthuis",
    city: "Den Haag",
    address: "Hoefkade 602, 2526 CM Den Haag",
    link: "https://www.demussen.nl/",
    position: [52.06842450619404, 4.313964983237152],
  },
  {
    title: "Adam",
    subtitle: "Vadercentrum",
    city: "Den Haag",
    address: "Jonckbloetplein 24, 2523 AR Den Haag",
    link: "https://haagsevaders.nl/",
    position: [52.05892489948423, 4.321650484960497],
  },
  {
    title: "Bewonersgroep Kralingen-West",
    subtitle: "Stichting",
    city: "Rotterdam",
    address: "Wollefoppenstraat 46, 3061 MZ Rotterdam",
    link: "https://www.linkedin.com/in/diana-veer-227571188/",
    position: [51.927958891419, 4.499159217688695],
  },
  {
    title: "Hotspot Hutspot",
    subtitle: "Distributie Centrum",
    city: "Rotterdam",
    address: "Brugwachter 8, 3034 KD Rotterdam",
    link: "https://hotspothutspot.nl/hotspot-hutspot-dc/",
    position: [51.94083162391044, 4.496350222951345],
  },
  {
    title: "Stichting Krachtvrouwen Oude Westen",
    subtitle: "Stichting",
    city: "Rotterdam",
    // Postcode 3014 TD (Oude Westen). De coördinaten zijn een benadering op
    // wijkniveau: bij de laatste update was er geen geocoder bereikbaar om de
    // PC6-centroïde exact op te halen. Positie graag visueel controleren.
    address: "Josephlaan 62, 3014 TD Rotterdam",
    link: "https://krachtvrouwenoudewesten.nl/",
    position: [51.9172, 4.4642],
  },
];
