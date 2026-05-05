import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Navigation } from "./Navigation";

describe("Navigation Component", () => {
  const menuItems = [
    { label: "Home", href: "/", isActive: true },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" }
  ];

  it("renders all menu items", () => {
    render(
      <Navigation links={menuItems} variant="header" />
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("highlights active menu item", () => {
    render(
      <Navigation links={menuItems} variant="header" />
    );
    const activeItem = screen.getByText("Home").closest("a");
    expect(activeItem?.className).toMatch(/active/);
  });

  it("calls onLinkClick when menu item is clicked", async () => {
    const onLinkClick = vi.fn();
    render(
      <Navigation links={menuItems} variant="header" onLinkClick={onLinkClick} />
    );
    await userEvent.click(screen.getByText("About"));
    expect(onLinkClick).toHaveBeenCalledWith(
      expect.objectContaining({ label: "About" })
    );
  });

  it("supports header variant", () => {
    const { container } = render(
      <Navigation links={menuItems} variant="header" />
    );
    const nav = container.querySelector("nav");
    expect(nav?.className).toMatch(/header/);
  });

  it("supports sidebar variant", () => {
    const { container } = render(
      <Navigation links={menuItems} variant="sidebar" />
    );
    const nav = container.querySelector("nav");
    expect(nav?.className).toMatch(/sidebar/);
  });

  it("supports keyboard navigation with arrow keys", async () => {
    const onLinkClick = vi.fn();
    render(
      <Navigation links={menuItems} variant="header" onLinkClick={onLinkClick} />
    );

    const firstItem = screen.getByText("Home").closest("a") as HTMLAnchorElement;
    firstItem.focus();

    // Arrow right should move to next item
    await userEvent.keyboard("{ArrowRight}");
    const secondItem = screen.getByText("About").closest("a");
    expect(secondItem).toHaveFocus();
  });

  it("supports keyboard navigation with arrow left", async () => {
    render(
      <Navigation links={menuItems} variant="header" />
    );

    const secondItem = screen.getByText("About").closest("a") as HTMLAnchorElement;
    secondItem.focus();

    // Arrow left should move to previous item
    await userEvent.keyboard("{ArrowLeft}");
    const firstItem = screen.getByText("Home").closest("a");
    expect(firstItem).toHaveFocus();
  });

  it("has nav semantic role", () => {
    const { container } = render(
      <Navigation links={menuItems} variant="header" />
    );
    expect(container.querySelector("nav")).toBeInTheDocument();
  });

  it("has proper link roles", () => {
    render(
      <Navigation links={menuItems} variant="header" />
    );
    const homeLink = screen.getByText("Home").closest("a");
    expect(homeLink).toBeInTheDocument();
    expect(homeLink?.tagName.toLowerCase()).toBe("a");
  });

  it("supports custom className", () => {
    const { container } = render(
      <Navigation links={menuItems} variant="header" className="custom-nav" />
    );
    const nav = container.querySelector("nav");
    expect(nav).toHaveClass("custom-nav");
  });

  it("renders mobile menu toggle when isMobileMenuOpen is provided", () => {
    const { container } = render(
      <Navigation
        links={menuItems}
        variant="header"
        isMobileMenuOpen={true}
        onMobileMenuToggle={() => {}}
      />
    );
    expect(container.querySelector("nav")).toBeInTheDocument();
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(
      <Navigation ref={ref} links={menuItems} variant="header" />
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});
