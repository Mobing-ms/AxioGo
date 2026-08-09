import React, { useState, useEffect } from 'react';
import { useAuth, ROLES } from '../../context/AuthContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import { RoleBadge } from './RoleBadge';
import { 
  Bell, 
  ChevronDown, 
  Settings, 
  LogOut
} from 'lucide-react';

export const Header = ({ activePage, setActivePage, onOpenNotifications }) => {
  const { currentRole, currentUser, switchRole } = useAuth();
  const { notifications } = useWorkspace();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simplified & Combined Core Navigation Items
  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'catalog', label: 'Data Catalog' },
    { id: 'analytics', label: 'Analytics & Reports' },
    { id: 'axis', label: 'AXIS AI' },
    { id: 'actions', label: 'Actions & Governance' },
    ...(currentRole === ROLES.ADMIN ? [
      { id: 'admin', label: 'Admin' }
    ] : [])
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      isScrolled ? 'bg-axio-bg/90 backdrop-blur-md border-b border-axio-border/80 py-3 shadow-xl' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo - Uses uploaded transparent logo asset, clean text without extra subtitles */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setActivePage('landing')}
            className="flex items-center gap-3 group text-left"
          >
            <div className="relative h-9 w-auto flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="AxioGo Logo" 
                className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </div>
            <span className="font-display font-extrabold text-xl tracking-wide text-white">
              Axio<span className="text-axio-red">Go</span>
            </span>
          </button>

          {/* Desktop Streamlined Navigation */}
          <nav className="hidden lg:flex items-center gap-1 font-sans">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`relative px-3.5 py-1.5 rounded text-xs font-semibold transition-all ${
                    isActive 
                      ? 'text-white bg-axio-card border border-axio-border-bright' 
                      : 'text-axio-text-secondary hover:text-white hover:bg-axio-panel'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-axio-red rounded-full shadow-sm shadow-axio-red" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Utility: Notifications & Role Switcher */}
        <div className="flex items-center gap-3 font-sans">

          {/* Notifications Drawer Toggle */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 bg-axio-card hover:bg-axio-hover border border-axio-border text-axio-text-secondary hover:text-white rounded transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-axio-red animate-ping" />
            )}
          </button>

          {/* Role Switcher & User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2 p-1.5 bg-axio-card border border-axio-border hover:border-axio-border-bright rounded transition-colors"
            >
              <div className="w-7 h-7 rounded bg-axio-panel border border-axio-border flex items-center justify-center font-display text-xs font-bold text-white">
                {currentUser.avatar}
              </div>
              <div className="hidden md:block text-left text-xs font-sans">
                <div className="text-white font-medium truncate max-w-[110px]">{currentUser.name}</div>
                <div className="text-[10px] text-axio-muted font-semibold">{currentRole}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-axio-muted" />
            </button>

            {/* Dropdown Menu for Role Switching & Settings */}
            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 p-2 bg-axio-panel border border-axio-border rounded-lg shadow-2xl z-50 font-sans">
                <div className="px-3 py-2 border-b border-axio-border mb-2">
                  <p className="text-xs text-axio-muted uppercase tracking-wider font-semibold">ENTERPRISE RBAC ROLE</p>
                  <p className="text-xs text-white font-semibold mt-0.5">Switch Role Context:</p>
                </div>

                <div className="space-y-1 mb-2">
                  {Object.values(ROLES).map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        switchRole(role);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-semibold transition-colors ${
                        currentRole === role 
                          ? 'bg-axio-red/10 border border-axio-red/30 text-white' 
                          : 'hover:bg-axio-card text-axio-text-secondary'
                      }`}
                    >
                      <RoleBadge role={role} compact />
                      {currentRole === role && <span className="w-1.5 h-1.5 rounded-full bg-axio-red" />}
                    </button>
                  ))}
                </div>

                <div className="border-t border-axio-border pt-2 space-y-1">
                  <button
                    onClick={() => {
                      setActivePage('settings');
                      setIsRoleDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-xs text-axio-text-secondary hover:text-white hover:bg-axio-card font-medium"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Settings & Preferences</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setActivePage('login');
                      setIsRoleDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-xs text-axio-red hover:bg-axio-red/10 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out / Switch User</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
