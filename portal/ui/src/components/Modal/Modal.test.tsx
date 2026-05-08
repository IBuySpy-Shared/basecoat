import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "./Modal";

describe("Modal Component", () => {
  it("renders with title and content", () => {
    render(
      <Modal isOpen={true} title="Test Modal" onClose={() => {}}>
        Modal content
      </Modal>
    );
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    const { container } = render(
      <Modal isOpen={false} title="Test Modal" onClose={() => {}}>
        Modal content
      </Modal>
    );
    expect(container.querySelector("[role=\"dialog\"]")).not.toBeInTheDocument();
  });

  it("has dialog semantic role", () => {
    render(
      <Modal isOpen={true} title="Test Modal" onClose={() => {}}>
        Content
      </Modal>
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("supports different size variants", () => {
    const { rerender } = render(
      <Modal isOpen={true} title="Modal" onClose={() => {}} size="sm">
        Content
      </Modal>
    );
    let dialog = screen.getByRole("dialog");
    expect(dialog.className).toMatch(/sm/);

    rerender(
      <Modal isOpen={true} title="Modal" onClose={() => {}} size="md">
        Content
      </Modal>
    );
    dialog = screen.getByRole("dialog");
    expect(dialog.className).toMatch(/md/);

    rerender(
      <Modal isOpen={true} title="Modal" onClose={() => {}} size="lg">
        Content
      </Modal>
    );
    dialog = screen.getByRole("dialog");
    expect(dialog.className).toMatch(/lg/);
  });

  it("calls onClose when close button is clicked", async () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} title="Modal" onClose={onClose}>
        Content
      </Modal>
    );
    const closeButton = screen.getByLabelText(/close|×/i);
    await userEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when escape key is pressed", async () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} title="Modal" onClose={onClose}>
        Content
      </Modal>
    );
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });

  it("has aria-modal attribute", () => {
    render(
      <Modal isOpen={true} title="Modal" onClose={() => {}}>
        Content
      </Modal>
    );
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
  });

  it("renders footer when provided", () => {
    render(
      <Modal
        isOpen={true}
        title="Modal"
        onClose={() => {}}
        footer={<div>Footer content</div>}
      >
        Content
      </Modal>
    );
    expect(screen.getByText("Footer content")).toBeInTheDocument();
  });

  it("renders sub-component Modal.Footer", () => {
    render(
      <Modal isOpen={true} title="Modal" onClose={() => {}}>
        Content
        <Modal.Footer>Footer action</Modal.Footer>
      </Modal>
    );
    expect(screen.getByText("Footer action")).toBeInTheDocument();
  });

  it("supports custom className", () => {
    const { container } = render(
      <Modal isOpen={true} title="Modal" onClose={() => {}} className="custom">
        Content
      </Modal>
    );
    const modal = container.querySelector("[role=\"dialog\"]");
    expect(modal?.className).toMatch(/custom/);
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(
      <Modal ref={ref} isOpen={true} title="Modal" onClose={() => {}}>
        Referenced Modal
      </Modal>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
