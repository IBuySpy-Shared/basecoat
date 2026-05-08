import React from "react";
import styles from "./Card.module.css";

export type CardElevation = "none" | "subtle" | "medium" | "large";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: CardElevation;
  interactive?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export interface CardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardHeader: React.FC<CardHeaderProps> = ({ children, ...props }) => (
  <div className={styles.header} {...props}>
    {children}
  </div>
);
CardHeader.displayName = "Card.Header";

const CardBody: React.FC<CardBodyProps> = ({ children, ...props }) => (
  <div className={styles.body} {...props}>
    {children}
  </div>
);
CardBody.displayName = "Card.Body";

const CardFooter: React.FC<CardFooterProps> = ({ children, ...props }) => (
  <div className={styles.footer} {...props}>
    {children}
  </div>
);
CardFooter.displayName = "Card.Footer";

/**
 * Card Component
 *
 * Flexible card container with optional header/footer sections.
 * Supports interactive states and various elevation levels.
 * Accessible and responsive across all breakpoints.
 *
 * @example
 * <Card>
 *   <Card.Header>Card Title</Card.Header>
 *   <Card.Body>Content goes here</Card.Body>
 *   <Card.Footer>Footer info</Card.Footer>
 * </Card>
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      elevation = "subtle",
      interactive = false,
      header,
      footer,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`${styles.card} ${styles[elevation]} ${
          interactive ? styles.interactive : ""
        } ${className || ""}`}
        role="article"
        {...props}
      >
        {header && <div className={styles.header}>{header}</div>}

        {typeof children === "object" &&
        React.isValidElement(children) &&
        children.type === CardBody ? (
          children
        ) : (
          <div className={styles.body}>{children}</div>
        )}

        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    );
  }
) as React.ForwardRefExoticComponent<
  CardProps & React.RefAttributes<HTMLDivElement>
> & {
  Header: typeof CardHeader;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
};

Card.displayName = "Card";

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
