import UserCard from '@/lib/components/cards/UserCard';
import {useSession} from 'next-auth/react';
import {notFound} from 'next/navigation';

export function AccountPage() {
  const {data: session} = useSession();

  return session?.user ? (
    <>
      <UserCard user={session.user} />
    </>
  ) : (
    notFound()
  );
}

export default AccountPage;
