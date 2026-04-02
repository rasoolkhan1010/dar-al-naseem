import React from "react";

// Country code to emoji flag mapping
const countryFlags: Record<string, string> = {
  UAE: "🇦🇪",
  "United Arab Emirates": "🇦🇪",
  USA: "🇺🇸",
  "United States": "🇺🇸",
  UK: "🇬🇧",
  "United Kingdom": "🇬🇧",
  "Saudi Arabia": "🇸🇦",
  SAUDI: "🇸🇦",
  India: "🇮🇳",
  IND: "🇮🇳",
  GCC: "🌍", // Gulf Cooperation Council (no specific flag)
};

interface FlagProps {
  country: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

export function CountryFlag({ country, showLabel = false, size = "md" }: FlagProps) {
  const flag = countryFlags[country] || "🌍";
  const sizeClass = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
    xl: "text-3xl",
  }[size];

  return (
    <span className={`inline-flex items-center gap-1.5 ${sizeClass} emoji-flag`} style={{ lineHeight: "1", fontVariantNumeric: "normal", fontVariantEmoji: "emoji" }}>
      <span className="emoji-flag" style={{ display: "inline-block", fontSize: "1.2em", fontFamily: "EmojiFont, 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', system-ui, -apple-system, 'Segoe UI'" }}>{flag}</span>
      {showLabel && <span style={{ fontSize: "0.9em" }}>{country}</span>}
    </span>
  );
}

interface CountriesListProps {
  countries: string[];
  showLabels?: boolean;
  separator?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function CountriesList({ 
  countries, 
  showLabels = false, 
  separator = " · ", 
  size = "md" 
}: CountriesListProps) {
  return (
    <span className="inline-flex items-center gap-2 flex-wrap emoji-flag" style={{ alignItems: "center", fontVariantEmoji: "emoji" }}>
      {countries.map((country, index) => (
        <React.Fragment key={country}>
          {index > 0 && <span className="text-white/40">{separator}</span>}
          <CountryFlag country={country} showLabel={showLabels} size={size} />
        </React.Fragment>
      ))}
    </span>
  );
}

// Inline component for displaying countries with flags in text
export function CountryText({ text, highlightCountries = true }: { 
  text: string; 
  highlightCountries?: boolean 
}) {
  if (!highlightCountries) return <span>{text}</span>;

  // Replace country names with flags
  let result = text;
  Object.entries(countryFlags).forEach(([country, flag]) => {
    const regex = new RegExp(`\\b${country}\\b`, "gi");
    result = result.replace(regex, (match) => {
      return `${flag}`;
    });
  });

  return <span>{result}</span>;
}

// Pre-identified country locations mentioned in the app
export const appCountries = ["UAE", "USA", "UK", "Saudi Arabia", "India"];

// Get all countries from a text
export function extractCountries(text: string): string[] {
  const found: string[] = [];
  Object.keys(countryFlags).forEach((country) => {
    if (text.toLowerCase().includes(country.toLowerCase())) {
      found.push(country);
    }
  });
  return [...new Set(found)];
}
