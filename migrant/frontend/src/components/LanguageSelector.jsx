import { useState } from 'react';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'ml', label: 'മലയാളം' },
  { code: 'bn', label: 'বাংলা' },
];

export default function LanguageSelector() {
  const [lang, setLang] = useState('en');
  return (
    <select
      value={lang}
      onChange={e => setLang(e.target.value)}
      className="language-selector"
      aria-label="Select language"
    >
      {languages.map(l => (
        <option key={l.code} value={l.code}>{l.label}</option>
      ))}
    </select>
  );
} 