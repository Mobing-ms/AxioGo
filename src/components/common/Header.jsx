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
  const {
    currentRole,
    currentUser,
    switchRole
  } = useAuth();

  const {
    notifications
  } = useWorkspace();

  const [isScrolled, setIsScrolled] =
    useState(false);

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] =
    useState(false);

  const unreadCount =
    notifications.filter(
      (n) => !n.read
    ).length;


  /* ================================================================
     HEADER SCROLL STATE
  ================================================================= */

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(
        window.scrollY > 20
      );
    };

    window.addEventListener(
      'scroll',
      handleScroll,
      { passive: true }
    );

    return () =>
      window.removeEventListener(
        'scroll',
        handleScroll
      );
  }, []);


  /* ================================================================
     NAVIGATION
  ================================================================= */

  const navItems = [
    {
      id: 'landing',
      label: 'Home'
    },

    {
      id: 'dashboard',
      label: 'Dashboard'
    },

    {
      id: 'catalog',
      label: 'Data Catalog'
    },

    {
      id: 'analytics',
      label: 'Analytics & Reports'
    },

    {
      id: 'axis',
      label: 'AXIS AI'
    },

    {
      id: 'actions',
      label: 'Actions & Governance'
    },

    ...(currentRole === ROLES.ADMIN
      ? [
        {
          id: 'admin',
          label: 'Admin'
        }
      ]
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
              bg-axio-bg/90
              backdrop-blur-xl
              border-b
              border-axio-border/70
              py-2.5
              shadow-xl
            `
          : `
              bg-transparent
              py-4
            `
        }
      `}
    >

      {/* ==========================================================
          HEADER CONTAINER
      ========================================================== */}

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
            BRAND + NAVIGATION
        ======================================================== */}

        <div
          className="
            flex
            items-center
            gap-7
            min-w-0
          "
        >

          {/* ======================================================
              AXIOGO BRAND
          ====================================================== */}

          <button
            onClick={() =>
              setActivePage('landing')
            }
            className="
              group
              flex
              items-center
              gap-3
              shrink-0
              select-none
            "
            aria-label="AxioGo Home"
          >

            {/* ----------------------------------------------------
                AXIOGO LOGO MARK

                Larger + forced white
            ---------------------------------------------------- */}

            <div
              className="
                relative
                h-10
                w-10
                flex
                items-center
                justify-center
                shrink-0
              "
            >
              <img
                src="/logo.png"
                alt="AxioGo"
                className="
                  h-10
                  w-10
                  object-contain
                  brightness-0
                  invert
                  transition-transform
                  duration-300
                  group-hover:scale-105
                "
              />
            </div>


            {/* ----------------------------------------------------
                AXIOGO WORDMARK

                Axio = white
                Go   = red
            ---------------------------------------------------- */}

            <span
              className="
                font-display
                font-extrabold
                text-[21px]
                leading-none
                tracking-[-0.035em]
                whitespace-nowrap
                flex
                items-center
              "
            >
              <span className="text-white">
                Axio
              </span>

              <span className="text-axio-red">
                Go
              </span>
            </span>

          </button>


          {/* ======================================================
              DESKTOP NAVIGATION
          ====================================================== */}

          <nav
            className="
              hidden
              lg:flex
              items-center
              gap-0.5
              font-sans
            "
          >

            {navItems.map((item) => {

              const isActive =
                activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() =>
                    setActivePage(item.id)
                  }
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
                          hover:bg-axio-panel/50
                        `
                    }
                  `}
                >

                  {item.label}

                  {/* Active red indicator */}

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
                        shadow-[0_0_8px_rgba(255,48,70,0.55)]
                      "
                    />
                  )}

                </button>
              );
            })}

          </nav>

        </div>


        {/* ========================================================
            RIGHT SIDE
        ======================================================== */}

        <div
          className="
            flex
            items-center
            gap-3
            font-sans
            shrink-0
          "
        >

          {/* ======================================================
              NOTIFICATIONS
          ====================================================== */}

          <button
            onClick={onOpenNotifications}
            className="
              relative
              p-2
              bg-axio-card/70
              hover:bg-axio-hover
              border
              border-axio-border
              hover:border-axio-border-bright
              text-axio-text-secondary
              hover:text-white
              rounded-md
              transition-all
              duration-200
            "
            title="Notifications"
          >

            <Bell
              className="
                w-4
                h-4
              "
            />

            {unreadCount > 0 && (
              <>
                <span
                  className="
                    absolute
                    top-1
                    right-1
                    w-2
                    h-2
                    rounded-full
                    bg-axio-red
                    animate-ping
                  "
                />

                <span
                  className="
                    absolute
                    top-1
                    right-1
                    w-2
                    h-2
                    rounded-full
                    bg-axio-red
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
                setIsRoleDropdownOpen(
                  !isRoleDropdownOpen
                )
              }
              className="
                flex
                items-center
                gap-2
                p-1.5
                bg-axio-card/70
                border
                border-axio-border
                hover:border-axio-border-bright
                rounded-md
                transition-all
                duration-200
              "
            >

              {/* Avatar */}

              <div
                className="
                  w-7
                  h-7
                  rounded
                  bg-axio-panel
                  border
                  border-axio-border
                  flex
                  items-center
                  justify-center
                  font-display
                  text-xs
                  font-bold
                  text-white
                "
              >
                {currentUser.avatar}
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
                    font-medium
                    truncate
                    max-w-[110px]
                  "
                >
                  {currentUser.name}
                </div>

                <div
                  className="
                    text-[10px]
                    text-axio-muted
                    font-semibold
                  "
                >
                  {currentRole}
                </div>

              </div>


              <ChevronDown
                className="
                  w-3.5
                  h-3.5
                  text-axio-muted
                "
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
                  mt-2
                  w-64
                  p-2
                  bg-axio-panel
                  border
                  border-axio-border
                  rounded-lg
                  shadow-2xl
                  z-50
                  font-sans
                "
              >

                {/* Header */}

                <div
                  className="
                    px-3
                    py-2
                    border-b
                    border-axio-border
                    mb-2
                  "
                >

                  <p
                    className="
                      text-xs
                      text-axio-muted
                      uppercase
                      tracking-wider
                      font-semibold
                    "
                  >
                    ENTERPRISE RBAC ROLE
                  </p>

                  <p
                    className="
                      text-xs
                      text-white
                      font-semibold
                      mt-0.5
                    "
                  >
                    Switch Role Context:
                  </p>

                </div>


                {/* Roles */}

                <div
                  className="
                    space-y-1
                    mb-2
                  "
                >

                  {Object.values(ROLES).map(
                    (role) => (

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
                          py-2
                          rounded
                          text-xs
                          font-semibold
                          transition-colors

                          ${currentRole === role
                            ? `
                                bg-axio-red/10
                                border
                                border-axio-red/15
                                text-white
                              `
                            : `
                                hover:bg-axio-card
                                text-axio-text-secondary
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
                            "
                          />
                        )}

                      </button>

                    )
                  )}

                </div>


                {/* Bottom actions */}

                <div
                  className="
                    border-t
                    border-axio-border
                    pt-2
                    space-y-1
                  "
                >

                  {/* Settings */}

                  <button
                    onClick={() => {
                      setActivePage('settings');
                      setIsRoleDropdownOpen(false);
                    }}
                    className="
                      w-full
                      flex
                      items-center
                      gap-2
                      px-3
                      py-1.5
                      rounded
                      text-xs
                      text-axio-text-secondary
                      hover:text-white
                      hover:bg-axio-card
                      font-medium
                    "
                  >

                    <Settings
                      className="
                        w-3.5
                        h-3.5
                      "
                    />

                    <span>
                      Settings & Preferences
                    </span>

                  </button>


                  {/* Sign out */}

                  <button
                    onClick={() => {
                      setActivePage('login');
                      setIsRoleDropdownOpen(false);
                    }}
                    className="
                      w-full
                      flex
                      items-center
                      gap-2
                      px-3
                      py-1.5
                      rounded
                      text-xs
                      text-axio-red
                      hover:bg-axio-red/10
                      font-medium
                    "
                  >

                    <LogOut
                      className="
                        w-3.5
                        h-3.5
                      "
                    />

                    <span>
                      Sign Out / Switch User
                    </span>

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