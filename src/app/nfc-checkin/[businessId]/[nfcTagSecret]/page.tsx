'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

export default function NfcCheckinPage() {
  const params = useParams();
  const businessId = params.businessId as string;
  const nfcTagSecret = params.nfcTagSecret as string;
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    if (!businessId || !nfcTagSecret || !/android/i.test(navigator.userAgent)) return;

    const fallback = encodeURIComponent(
      'https://play.google.com/store/apps/details?id=com.loyaltyhubapp.android'
    );
    window.location.href = `intent://nfc-checkin/${businessId}/${nfcTagSecret}#Intent;scheme=loyaltyhub;package=com.loyaltyhubapp.android;S.browser_fallback_url=${fallback};end`;

    const timer = setTimeout(() => setShowFallback(true), 2500);
    return () => clearTimeout(timer);
  }, [businessId, nfcTagSecret]);

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#faf7f2',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'var(--font-inter, system-ui, sans-serif)',
      textAlign: 'center',
    }}>
      <Image
        src="/logo.png"
        alt="clientIn"
        width={72}
        height={72}
        style={{ borderRadius: 22, boxShadow: '0 8px 32px rgba(201,123,58,0.25)', marginBottom: 24 }}
      />

      {!showFallback ? (
        <>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#1a1410', marginBottom: 8 }}>
            Opening clientIn…
          </p>
          <p style={{ fontSize: 14, color: 'rgba(26,20,16,0.45)' }}>
            You'll be checked in automatically.
          </p>
        </>
      ) : (
        <>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#1a1410', marginBottom: 8 }}>
            Check in with clientIn
          </p>
          <p style={{ fontSize: 14, color: 'rgba(26,20,16,0.45)', marginBottom: 32, maxWidth: 280, lineHeight: 1.6 }}>
            Open the app to collect your stamp and check in.
          </p>

          <a
            href={`intent://nfc-checkin/${businessId}/${nfcTagSecret}#Intent;scheme=loyaltyhub;package=com.loyaltyhubapp.android;end`}
            style={{
              display: 'inline-block',
              background: '#C97B3A',
              color: '#fff',
              fontWeight: 700,
              fontSize: 16,
              borderRadius: 16,
              padding: '14px 32px',
              textDecoration: 'none',
              marginBottom: 24,
            }}
          >
            Open in clientIn
          </a>

          <p style={{ fontSize: 12, color: 'rgba(26,20,16,0.35)', marginBottom: 12 }}>
            Don't have the app yet?
          </p>

          <a
            href="https://play.google.com/store/apps/details?id=com.loyaltyhubapp.android"
            style={{
              background: '#1a1410',
              color: '#fff',
              fontWeight: 600,
              fontSize: 13,
              borderRadius: 12,
              padding: '10px 20px',
              textDecoration: 'none',
            }}
          >
            Download on Google Play
          </a>
        </>
      )}
    </div>
  );
}
