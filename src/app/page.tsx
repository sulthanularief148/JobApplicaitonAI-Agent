// Root page — just redirects to dashboard.
// The middleware will catch unauthenticated users and send them to login.

import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/dashboard');
}
