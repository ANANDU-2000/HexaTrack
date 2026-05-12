'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function OrganizationsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Transparently route to Admin Shell activating the organizations panel
    router.replace('/admin?section=organizations');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0B1015] grid place-items-center">
      <div className="flex items-center gap-3 text-[#8B9BB4]">
        <Loader2 className="animate-spin h-5 w-5 text-[#4F8CFF]" />
        <span className="text-sm font-medium font-mono tracking-wider uppercase">Rerouting To Registry...</span>
      </div>
    </div>
  );
}
