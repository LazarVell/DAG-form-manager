import { render, fireEvent, screen } from "@testing-library/react";
import PrefillPanel from "@/components/prefill/PrefillPanel";
import '@testing-library/jest-dom';

describe("PrefillPanel", () => {
  it("displays mapped fields correctly", () => {
    render(
      <PrefillPanel
        availableFields={["email"]}
        mappings={[
          { targetField: "email", sourceForm: "Form A", sourceField: "email" },
        ]}
        enabled={true}
        onToggle={() => {}}
        onFieldClick={() => {}}
        onRemoveMapping={() => {}}
      />
    );
    expect(screen.getByText(/Form A.email/)).toBeInTheDocument();
  });

  it("calls onFieldClick when clicked", () => {
    const onClick = jest.fn();
    render(
      <PrefillPanel
        availableFields={["email"]}
        mappings={[]}
        enabled={true}
        onToggle={() => {}}
        onFieldClick={onClick}
        onRemoveMapping={() => {}}
      />
    );
    fireEvent.click(screen.getByText("email"));
    expect(onClick).toHaveBeenCalled();
  });

  it("does not call onFieldClick if disabled", () => {
    const onClick = jest.fn();
    render(
      <PrefillPanel
        availableFields={["email"]}
        mappings={[]}
        enabled={false}
        onToggle={() => {}}
        onFieldClick={onClick}
        onRemoveMapping={() => {}}
      />
    );
    fireEvent.click(screen.getByText("email"));
    expect(onClick).not.toHaveBeenCalled();
  });
});
