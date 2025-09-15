"use client";

import { useEffect } from 'react';

export default function AdminRedirectPage() {
  useEffect(() => {
    window.location.href = '/admin/';
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to admin panel...</p>
    </div>
  );
}
