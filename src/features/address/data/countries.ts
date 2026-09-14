export interface Country {
  name: string;
  code: string;
  flag: string;
}

const COUNTRIES: Country[] = [
  { name: "Egypt", code: "+20", flag: "🇪🇬" },
  { name: "Saudi Arabia", code: "+966", flag: "🇸🇦" },
  { name: "United Arab Emirates", code: "+971", flag: "🇦🇪" },
  { name: "Kuwait", code: "+965", flag: "🇰🇼" },
  { name: "Qatar", code: "+974", flag: "🇶🇦" },
  { name: "Bahrain", code: "+973", flag: "🇧🇭" },
  { name: "Oman", code: "+968", flag: "🇴🇲" },
  { name: "Jordan", code: "+962", flag: "🇯🇴" },
  { name: "Lebanon", code: "+961", flag: "🇱🇧" },
  { name: "Iraq", code: "+964", flag: "🇮🇶" },
  { name: "Morocco", code: "+212", flag: "🇲🇦" },
  { name: "Algeria", code: "+213", flag: "🇩🇿" },
  { name: "Tunisia", code: "+216", flag: "🇹🇳" },
  { name: "Libya", code: "+218", flag: "🇱🇾" },
];

export const DEFAULT_COUNTRY: Country = COUNTRIES[0];

export function getCountryByName(name: string): Country | undefined {
  return COUNTRIES.find(
    (c) => c.name.toLowerCase() === name.trim().toLowerCase()
  );
}

export function getCountryByDialCode(phone: string): Country | undefined {
  const sorted = [...COUNTRIES].sort((a, b) => b.code.length - a.code.length);
  return sorted.find((c) => phone.startsWith(c.code));
}

export function parsePhoneNumber(phone: string): {
  country: Country | undefined;
  localNumber: string;
} {
  const digitsOnly = phone.replace(/[^\d+]/g, "");
  const country = getCountryByDialCode(digitsOnly);
  if (country) {
    const local = digitsOnly.slice(country.code.length);
    return { country, localNumber: local };
  }
  const justDigits = digitsOnly.replace(/^\+?/, "");
  return { country: undefined, localNumber: justDigits };
}

export default COUNTRIES;
