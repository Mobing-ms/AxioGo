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

export const Header = ({
  activePage,
  setActivePage,
  onOpenNotifications
}) => {
  const { currentRole, currentUser, switchRole } = useAuth();
  const { notifications } = useWorkspace();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(
    (n) => !n.read
  ).length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, {
      passive: true
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'catalog', label: 'Data Catalog' },
    { id: 'analytics', label: 'Analytics & Reports' },
    { id: 'axis', label: 'AXIS AI' },
    { id: 'actions', label: 'Actions & Governance' },

    ...(currentRole === ROLES.ADMIN
      ? [{ id: 'admin', label: 'Admin' }]
      : [])
  ];

  return (
    <header
      className={`
        fixed
        top-0
        left-0
        right-0
        z-40
        transition-all
        duration-300
        ${isScrolled
          ? `
              bg-[#07090D]/90
              backdrop-blur-2xl
              border-b
              border-white/[0.045]
              py-2.5
              shadow-[0_10px_40px_rgba(0,0,0,0.35)]
            `
          : `
              bg-transparent
              py-4
            `
        }
      `}
    >

      <div
        className="
          w-full
          px-5
          sm:px-7
          lg:px-9
          flex
          items-center
          justify-between
        "
      >

        {/* ========================================================
            AXIOGO TEXT BRAND
        ======================================================== */}

        <button
          onClick={() => setActivePage('landing')}
          className="
            group
            flex
            items-center
            shrink-0
            select-none
            mr-8
          "
          aria-label="AxioGo Home"
        >
          <span
            className="
              font-display
              font-black
              text-[24px]
              sm:text-[26px]
              leading-none
              tracking-[-0.045em]
              whitespace-nowrap
            "
          >
            <span
              className="
                text-white
                transition-opacity
                duration-300
                group-hover:opacity-90
              "
            >
              Axio
            </span>

            <span
              className="
                text-axio-red
                drop-shadow-[0_0_14px_rgba(255,48,70,0.18)]
                transition-all
                duration-300
                group-hover:drop-shadow-[0_0_20px_rgba(255,48,70,0.35)]
              "
            >
              Go
            </span>
          </span>
        </button>


        {/* ========================================================
            DESKTOP NAVIGATION
        ======================================================== */}

        <nav
          className="
            hidden
            lg:flex
            items-center
            gap-0.5
            font-sans
            flex-1
          "
        >
          {navItems.map((item) => {
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`
                  relative
                  px-3.5
                  py-2
                  rounded-md
                  text-xs
                  font-semibold
                  transition-all
                  duration-200

                  ${isActive
                    ? `
                        text-white
                        bg-white/[0.025]
                      `
                    : `
                        text-axio-text-secondary
                        hover:text-white
                        hover:bg-white/[0.025]
                      `
                  }
                `}
              >
                {item.label}

                {isActive && (
                  <span
                    className="
                      absolute
                      bottom-0
                      left-3
                      right-3
                      h-[2px]
                      bg-axio-red
                      rounded-full
                      shadow-[0_0_10px_rgba(255,48,70,0.65)]
                    "
                  />
                )}
              </button>
            );
          })}
        </nav>


        {/* ========================================================
            RIGHT SIDE CONTROLS
        ======================================================== */}

        <div
          className="
            flex
            items-center
            gap-2.5
            font-sans
            shrink-0
            ml-auto
          "
        >

          {/* ======================================================
              NOTIFICATIONS
          ====================================================== */}

          <button
            onClick={onOpenNotifications}
            className="
              group
              relative
              w-10
              h-10
              flex
              items-center
              justify-center
              rounded-xl
              bg-white/[0.025]
              hover:bg-axio-red/[0.07]
              border
              border-white/[0.06]
              hover:border-axio-red/20
              text-axio-text-secondary
              hover:text-white
              transition-all
              duration-300
            "
            title="Notifications"
            aria-label="Notifications"
          >
            <div
              className="
                absolute
                inset-0
                rounded-xl
                bg-axio-red/10
                blur-lg
                opacity-0
                group-hover:opacity-100
                transition-opacity
                duration-300
                pointer-events-none
              "
            />

            <Bell
              className="
                relative
                w-[17px]
                h-[17px]
                transition-transform
                duration-300
                group-hover:scale-110
              "
            />

            {unreadCount > 0 && (
              <>
                <span
                  className="
                    absolute
                    top-2
                    right-2
                    w-2
                    h-2
                    rounded-full
                    bg-axio-red
                    opacity-70
                    animate-ping
                  "
                />

                <span
                  className="
                    absolute
                    top-2
                    right-2
                    w-2
                    h-2
                    rounded-full
                    bg-axio-red
                    shadow-[0_0_8px_rgba(255,48,70,0.8)]
                  "
                />
              </>
            )}
          </button>


          {/* ======================================================
              USER / ROLE MENU
          ====================================================== */}

          <div className="relative">

            <button
              onClick={() =>
                setIsRoleDropdownOpen(!isRoleDropdownOpen)
              }
              className="
                group
                flex
                items-center
                gap-2.5
                h-10
                px-2
                rounded-xl
                bg-white/[0.025]
                hover:bg-white/[0.045]
                border
                border-white/[0.06]
                hover:border-white/[0.10]
                transition-all
                duration-300
              "
            >

              {/* Avatar */}

              <div
                className="
                  relative
                  w-8
                  h-8
                  rounded-lg
                  bg-[#10141A]
                  border
                  border-white/[0.07]
                  flex
                  items-center
                  justify-center
                  font-display
                  text-[11px]
                  font-bold
                  text-white
                  overflow-hidden
                "
              >
                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-br
                    from-axio-red/15
                    via-transparent
                    to-transparent
                  "
                />

                <span className="relative">
                  {currentUser.avatar}
                </span>
              </div>


              {/* User information */}

              <div
                className="
                  hidden
                  md:block
                  text-left
                  text-xs
                  font-sans
                "
              >
                <div
                  className="
                    text-white
                    font-semibold
                    truncate
                    max-w-[105px]
                    leading-tight
                  "
                >
                  {currentUser.name}
                </div>

                <div
                  className="
                    text-[9px]
                    text-axio-muted
                    font-semibold
                    uppercase
                    tracking-wide
                    mt-0.5
                  "
                >
                  {currentRole}
                </div>
              </div>


              <ChevronDown
                className={`
                  w-3.5
                  h-3.5
                  text-axio-muted
                  transition-transform
                  duration-300
                  ${isRoleDropdownOpen
                    ? 'rotate-180 text-white'
                    : ''
                  }
                `}
              />

            </button>


            {/* ====================================================
                ROLE DROPDOWN
            ==================================================== */}

            {isRoleDropdownOpen && (
              <div
                className="
                  absolute
                  right-0
                  mt-2.5
                  w-64
                  p-2
                  bg-[#0B0F14]/95
                  backdrop-blur-2xl
                  border
                  border-white/[0.07]
                  rounded-xl
                  shadow-[0_20px_60px_rgba(0,0,0,0.5)]
                  z-50
                  font-sans
                "
              >

                <div
                  className="
                    px-3
                    py-2.5
                    mb-2
                    border-b
                    border-white/[0.05]
                  "
                >
                  <p
                    className="
                      text-[9px]
                      text-axio-muted
                      uppercase
                      tracking-[0.16em]
                      font-semibold
                    "
                  >
                    Enterprise RBAC Role
                  </p>

                  <p
                    className="
                      text-xs
                      text-white
                      font-semibold
                      mt-1
                    "
                  >
                    Switch Role Context
                  </p>
                </div>


                {/* Roles */}

                <div className="space-y-1 mb-2">

                  {Object.values(ROLES).map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        switchRole(role);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`
                        w-full
                        flex
                        items-center
                        justify-between
                        px-3
                        py-2.5
                        rounded-lg
                        text-xs
                        font-semibold
                        transition-all
                        duration-200

                        ${currentRole === role
                          ? `
                              bg-axio-red/[0.08]
                              text-white
                              shadow-[inset_2px_0_0_#FF3046]
                            `
                          : `
                              text-axio-text-secondary
                              hover:text-white
                              hover:bg-white/[0.035]
                            `
                        }
                      `}
                    >

                      <RoleBadge
                        role={role}
                        compact
                      />

                      {currentRole === role && (
                        <span
                          className="
                            w-1.5
                            h-1.5
                            rounded-full
                            bg-axio-red
                            shadow-[0_0_7px_rgba(255,48,70,0.7)]
                          "
                        />
                      )}

                    </button>
                  ))}

                </div>


                {/* Bottom actions */}

                <div
                  className="
                    border-t
                    border-white/[0.05]
                    pt-2
                    space-y-1
                  "
                >

                  <button
                    onClick={() => {
                      setActivePage('settings');
                      setIsRoleDropdownOpen(false);
                    }}
                    className="
                      w-full
                      flex
                      items-center
                      gap-2.5
                      px-3
                      py-2
                      rounded-lg
                      text-xs
                      text-axio-text-secondary
                      hover:text-white
                      hover:bg-white/[0.035]
                      font-medium
                      transition-all
                    "
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Settings & Preferences</span>
                  </button>


                  <button
                    onClick={() => {
                      setActivePage('login');
                      setIsRoleDropdownOpen(false);
                    }}
                    className="
                      w-full
                      flex
                      items-center
                      gap-2.5
                      px-3
                      py-2
                      rounded-lg
                      text-xs
                      text-axio-red
                      hover:bg-axio-red/[0.07]
                      font-medium
                      transition-all
                    "
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