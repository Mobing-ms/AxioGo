import React from 'react';
import { ROLES } from '../../context/AuthContext';
import { ShieldCheck, UserCheck, User } from 'lucide-react';

export const RoleBadge = ({ role, compact = false }) => {
  let badgeStyle = "bg-axio-card border-axio-border text-axio-muted";
  let icon = <User className="w-3 h-3 text-axio-muted" />;

  if (role === ROLES.ADMIN) {
    badgeStyle = "bg-axio-red/10 border-axio-red/30 text-axio-red";
    icon = <ShieldCheck className="w-3.5 h-3.5 text-axio-red" />;
  } else if (role === ROLES.AUTHORIZED) {
    badgeStyle = "bg-axio-cyan/10 border-axio-cyan/30 text-axio-cyan";
    icon = <UserCheck className="w-3.5 h-3.5 text-axio-cyan" />;
  } else if (role === ROLES.STANDARD) {
    badgeStyle = "bg-blue-500/10 border-blue-500/30 text-blue-400";
    icon = <User className="w-3.5 h-3.5 text-blue-400" />;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-sans font-semibold border tracking-wide ${badgeStyle}`}>
      {icon}
      <span>{compact ? role.split(' ')[0] : role}</span>
    </span>
  );
};
