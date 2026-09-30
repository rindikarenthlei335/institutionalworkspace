import React from 'react';

export interface SchoolJsonLdProps {
  name: string;
  description?: string;
  url: string;
  telephone?: string;
  address?: string;
}

export function SchoolJsonLd({
  name,
  description = 'Higher Secondary School',
  url,
  telephone = '+91 98765 43210',
  address = 'Aizawl, Mizoram'
}: SchoolJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'School',
    name,
    description,
    url,
    telephone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address,
      addressCountry: 'IN'
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
