import React from 'react';
import { ROLES } from '../../context/AuthContext';
import {
  ShieldCheck,
  UserCheck,
  User
} from 'lucide-react';

export const RoleBadge = ({ role, compact = false }) => {
  let badgeStyle =
    'bg-white/[0.03] text-axio-muted';

  let icon = (
    <User className="w-3 h-3 shrink-0" />
  );

  if (role === ROLES.ADMIN) {
    badgeStyle =
      'bg-axio-red/[0.08] text-axio-red shadow-[0_0_18px_rgba(255,48,70,0.06)]';

    icon = (
      <ShieldCheck className="w-3 h-3 shrink-0" />
    );
  } else if (role === ROLES.AUTHORIZED) {
    badgeStyle =
      'bg-axio-red/[0.05] text-red-300';

    icon = (
      <UserCheck className="w-3 h-3 shrink-0" />
    );
  } else if (role === ROLES.STANDARD) {
    badgeStyle =
      'bg-white/[0.035] text-axio-text-secondary';

    icon = (
      <User className="w-3 h-3 shrink-0" />
    );
  }

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        px-2.5
        py-1
        rounded-full
        text-[10px]
        font-sans
        font-bold
        uppercase
        tracking-wider
        whitespace-nowrap
        transition-all
        duration-300
        ${badgeStyle}
      `}
    >
      {icon}

      <span>
        {compact
          ? role?.split(' ')[0]
          : role}
      </span>
    </span>
  );
};