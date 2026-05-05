import React from 'react';
import styles from './Navigation.module.css';

export interface NavLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
  isActive?: boolean;
}

export interface NavigationProps
  extends React.HTMLAttributes<HTMLElement> {
  links: NavLink[];
  onLinkClick?: (link: NavLink) => void;
  variant?: 'header' | 'sidebar';
  isMobileMenuOpen?: boolean;
  onMobileMenuToggle?: () => void;
}

/**
 * Navigation Component
 *
 * Accessible navigation component supporting both header and sidebar layouts.
 * Implements keyboard navigation, ARIA attributes, and responsive design.
 * Automatically handles mobile menu toggle.
 *
 * @example
 * <Navigation variant="header" links={[
 *   { label: 'Dashboard', href: '/dashboard', isActive: true },
 *   { label: 'Settings', href: '/settings' }
 * ]} />
 */
export const Navigation = React.forwardRef<HTMLElement, NavigationProps>(
  (
    {
      links,
      onLinkClick,
      variant = 'header',
      isMobileMenuOpen = false,
      onMobileMenuToggle,
      className,
      ...props
    },
    ref
  ) => {
    const [activeIndex, setActiveIndex] = React.useState(
      links.findIndex((link) => link.isActive)
    );

    const handleKeyDown = (
      e: React.KeyboardEvent,
      index: number
    ) => {
      let nextIndex = index;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        nextIndex = (index + 1) % links.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        nextIndex = (index - 1 + links.length) % links.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        nextIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        nextIndex = links.length - 1;
      } else {
        return;
      }

      setActiveIndex(nextIndex);
      const buttons = document.querySelectorAll(
        `[data-nav-index="${nextIndex}"]`
      ) as NodeListOf<HTMLElement>;
      buttons[0]?.focus();
    };

    return (
      <nav
        ref={ref}
        className={`${styles.nav} ${styles[variant]} ${
          isMobileMenuOpen ? styles.mobileOpen : ''
        } ${className || ''}`}
        aria-label={variant === 'header' ? 'Main navigation' : 'Sidebar'}
        {...props}
      >
        {variant === 'header' && (
          <button
            className={styles.mobileToggle}
            onClick={onMobileMenuToggle}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        )}

        <ul className={styles.list} role="menubar">
          {links.map((link, index) => (
            <li key={link.href} role="none">
              <a
                href={link.href}
                className={`${styles.link} ${
                  link.isActive || index === activeIndex ? styles.active : ''
                }`}
                aria-current={link.isActive ? 'page' : undefined}
                onClick={() => {
                  setActiveIndex(index);
                  onLinkClick?.(link);
                }}
                onKeyDown={(e) => handleKeyDown(e, index)}
                data-nav-index={index}
                role="menuitem"
              >
                {link.icon && <span className={styles.icon}>{link.icon}</span>}
                <span className={styles.label}>{link.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
);

Navigation.displayName = 'Navigation';

export default Navigation;
