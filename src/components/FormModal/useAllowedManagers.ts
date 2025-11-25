import { useMemo } from 'react';

import { roles } from '@/constants';
import type { Role, User } from '@/models';

export const useAllowedChiefs = (users: User[], currentRole: Role, editingUser?: User) => {
  const buildSubordinateMap = (users: User[]) => {
    const map: Record<string, string[]> = {};

    users.forEach((user) => {
      if (user.chiefId) {
        if (!map[user.chiefId]) map[user.chiefId] = [];

        map[user.chiefId].push(user.id);
      }
    });
    return map;
  };

  const isRoleLowerOrEqual = (a: Role, b: Role) => roles.indexOf(a) <= roles.indexOf(b);

  return useMemo(() => {
    if (!users.length) return [];

    const subordinateMap = buildSubordinateMap(users);

    const isNotSubordinate = (candidateId: string, currentId: string): boolean => {
      const directSubs = subordinateMap[currentId] || [];

      if (directSubs.includes(candidateId)) return false;
      return directSubs.every((sub) => isNotSubordinate(candidateId, sub));
    };

    return users.filter((user) => {
      if (editingUser?.id === user.id) return false;

      if (isRoleLowerOrEqual(user.role, currentRole)) return false;

      if (editingUser) {
        return isNotSubordinate(user.id, editingUser.id);
      }

      return true;
    });
  }, [users, currentRole, editingUser]);
};
