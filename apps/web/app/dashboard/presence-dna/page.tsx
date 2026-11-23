import { redirect } from 'next/navigation';

export default function LegacyPresenceDnaPage() {
  // Presence DNA's historical charts were populated with illustrative
  // scores and activity. One canonical page now owns verified progress.
  redirect('/dashboard/progress');
}
