import Image from 'next/image';
import Link from 'next/link';

export function WorkspaceBrand({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/dashboard"
      aria-label="PersonaIQ home"
      className="inline-flex min-h-11 items-center gap-2.5 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <Image
        src="/icon.png"
        alt=""
        aria-hidden="true"
        width={34}
        height={34}
        className="h-9 w-9 rounded-xl object-contain"
        priority
      />
      <span className="text-[19px] font-extrabold tracking-tight text-gray-950">
        Persona<span className="text-primary">IQ</span>
      </span>
      {!compact && <span className="sr-only">Workspace</span>}
    </Link>
  );
}
