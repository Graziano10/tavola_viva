import { redirect } from 'next/navigation';

import { AdminLoginForm } from '@/components/admin-login-form';
import { getAdminSession } from '@/lib/auth';

export const metadata = {
  title: 'Admin login',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect('/admin');

  return (
    <div className="container-shell py-16">
      <AdminLoginForm />
    </div>
  );
}
