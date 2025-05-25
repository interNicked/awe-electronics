import Prisma from '@/prisma/generated';
import {useState, useEffect} from 'react';

export function useUsers() {
  const [users, setUsers] = useState<Prisma.User[]>([]);

  useEffect(() => {
    async function getUsers() {
      const res = await fetch('/api/users');
      if (res.ok) {
        const items = await res.json();
        setUsers(items);
      }
    }

    getUsers();
  }, []);

  return {
    users,
  };
}

export default useUsers;
