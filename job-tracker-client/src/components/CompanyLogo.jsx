import { useState } from 'react';

function CompanyLogo({ company, size = 32 }) {
  const [failed, setFailed] = useState(false);
  const domain = company.toLowerCase().replace(/\s+/g, '') + '.com';
  const logoUrl = `https://logo.clearbit.com/${domain}`;

  if (failed) {
    // Fallback: colored circle with first letter
    return (
      <div
        className="rounded-full flex items-center justify-center font-medium text-xs flex-shrink-0"
        style={{
          width: size,
          height: size,
          background: 'rgba(123,97,255,0.2)',
          color: '#B6A8FF',
        }}
      >
        {company.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={`${company} logo`}
      onError={() => setFailed(true)}
      className="rounded-full flex-shrink-0 bg-white/5"
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  );
}

export default CompanyLogo;