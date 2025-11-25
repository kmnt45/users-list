import { roles } from '@/constants';
import type { Role } from '@/models';

export const isChiefValid = (chiefRole: Role, subordinateRole: Role) => {
  return roles.indexOf(chiefRole) > roles.indexOf(subordinateRole);
};
