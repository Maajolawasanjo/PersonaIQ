import Link from 'next/link';

export const metadata = {
  title: 'Terms of Use | PersonaIQ',
  description: 'Current service scope and acceptable use of PersonaIQ.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FB] px-5 py-12 text-gray-950">
      <article className="mx-auto max-w-3xl space-y-7 rounded-3xl border border-gray-200 bg-white p-6 sm:p-10">
        <header>
          <Link href="/" className="text-sm font-bold text-primary">PersonaIQ</Link>
          <h1 className="mt-6 text-3xl font-bold">Terms of Use</h1>
          <p className="mt-3 text-sm text-gray-600">Draft service information for legal review — November 2026.</p>
        </header>
        <section className="space-y-2"><h2 className="text-lg font-semibold">What PersonaIQ provides</h2><p className="text-sm leading-7 text-gray-700">PersonaIQ is an outfit-planning and personal presentation application. Features may include event planning, wardrobe organization and virtual try-on, depending on provider availability. Some features are still in development and may be unavailable.</p></section>
        <section className="space-y-2"><h2 className="text-lg font-semibold">No diagnostic claims</h2><p className="text-sm leading-7 text-gray-700">The service is not a medical, psychological or professional competency assessment. Outfit previews and automated suggestions are not evidence of a person's worth, authority, health or capability.</p></section>
        <section className="space-y-2"><h2 className="text-lg font-semibold">Your account and uploaded material</h2><p className="text-sm leading-7 text-gray-700">Only upload material you have permission to use. Protect your login credentials. Do not upload other people's sensitive images without authorization. Review our <Link href="/privacy" className="font-semibold text-primary underline">Privacy Information</Link> before submitting photographs.</p></section>
        <section className="space-y-2"><h2 className="text-lg font-semibold">Service limitations</h2><p className="text-sm leading-7 text-gray-700">The application may be unavailable during maintenance or while external processing providers are offline. A virtual try-on result must not be represented as completed until the provider returns a generated image. No subscription or payment obligation is created by these draft terms alone.</p></section>
        <section className="space-y-2"><h2 className="text-lg font-semibold">Support</h2><p className="text-sm leading-7 text-gray-700">Please use the <Link href="/contact" className="font-semibold text-primary underline">contact page</Link> for questions. Final enforceable terms, dispute provisions and applicable-law review are required before general availability.</p></section>
        <p className="border-t border-gray-100 pt-6 text-xs leading-6 text-gray-500">This draft is part of the reconstruction branch and must be reviewed before public publication.</p>
      </article>
    </main>
  );
}
