import Link from 'next/link';

export const metadata = {
  title: 'Privacy Information | PersonaIQ',
  description: 'How PersonaIQ handles account information, uploaded photographs and application sessions.',
};

export default function PrivacyInformationPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FB] px-5 py-12 text-gray-950">
      <article className="mx-auto max-w-3xl space-y-7 rounded-3xl border border-gray-200 bg-white p-6 sm:p-10">
        <header>
          <Link href="/" className="text-sm font-bold text-primary">PersonaIQ</Link>
          <h1 className="mt-6 text-3xl font-bold">Privacy Information</h1>
          <p className="mt-3 text-sm text-gray-600">Product implementation disclosure — draft for legal review, November 2026.</p>
        </header>
        <section className="space-y-2"><h2 className="text-lg font-semibold">Information you provide</h2><p className="text-sm leading-7 text-gray-700">The service processes your account email, name, password credentials, optional profile details, event information, clothing selections and photographs you upload. Passwords are hashed for storage. We cannot promise that all image information is processed only in your browser.</p></section>
        <section className="space-y-2"><h2 className="text-lg font-semibold">Images and temporary access</h2><p className="text-sm leading-7 text-gray-700">Uploaded photos can be retained with your account. The reconstructed storage implementation requires a private bucket and uses short-lived access links. Photos are not automatically erased when you close a browser tab. Historical uploads and existing production storage policies must still be reviewed before the reconstructed system is released.</p></section>
        <section className="space-y-2"><h2 className="text-lg font-semibold">Third-party processing</h2><p className="text-sm leading-7 text-gray-700">If an external virtual try-on or AI provider is enabled, selected images and relevant instructions may be transmitted to that provider to perform the requested operation. Provider-specific retention and training terms must be verified before those features are enabled.</p></section>
        <section className="space-y-2"><h2 className="text-lg font-semibold">Sessions and account deletion</h2><p className="text-sm leading-7 text-gray-700">The new application version uses HttpOnly session cookies and server-issued temporary media links. Account deletion is designed to remove associated uploaded images before deleting account records; if storage cleanup fails, the application must not report complete deletion. Certain operational and provider-side retention periods still require confirmation.</p></section>
        <section className="space-y-2"><h2 className="text-lg font-semibold">Questions and corrections</h2><p className="text-sm leading-7 text-gray-700">For questions or data-related concerns, use the <Link href="/contact" className="font-semibold text-primary underline">contact page</Link>. A final privacy notice and retention schedule must be approved before public release.</p></section>
        <p className="border-t border-gray-100 pt-6 text-xs leading-6 text-gray-500">This draft explains the current reconstruction. It does not certify compliance with any particular data-protection framework.</p>
      </article>
    </main>
  );
}
