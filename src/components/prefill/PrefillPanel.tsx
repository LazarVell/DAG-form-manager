"use client";

//I left this type here because it is only used for this component and is tightly coupled with the props.
type PrefillMapping = {
  targetField: string;
  sourceForm: string;
  sourceField: string;
};

type PrefillPanelProps = {
  availableFields: string[];
  mappings: PrefillMapping[];
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  onRemoveMapping: (targetField: string) => void;
  onFieldClick?: (field: string, e: React.MouseEvent) => void;
  onClose?: () => void;
};

export default function PrefillPanel({
  availableFields,
  mappings,
  enabled,
  onToggle,
  onRemoveMapping,
  onFieldClick,
  onClose,
}: PrefillPanelProps) {
  return (
    <div className="p-4 rounded-md border bg-white">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold">Prefill</h2>
          <p className="text-sm text-gray-500">Prefill fields for this form</p>
        </div>
        <div className="flex items-start">
          <button
            onClick={() => onToggle(!enabled)}
            className={`w-10 h-6 rounded-full relative transition ${
              enabled ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute w-4 h-4 rounded-full bg-white top-1 left-1 transition-transform ${
                enabled ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
          <button
            onClick={onClose}
            className="ml-3 text-sm text-gray-500 font-bold"
          >
            X
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {availableFields.map((field) => {
          const mapping = mappings.find((m) => m.targetField === field);

          return (
            <div
              key={field}
              onClick={(e) => {
                if (enabled) {
                  onFieldClick?.(field, e);
                }
              }}
              className={`flex items-center justify-between px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-100 ${
                mapping
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-300 bg-gray-100"
              }`}
            >
              <span>{field}</span>

              {mapping && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-700">
                    &nbsp;{mapping.sourceForm}.{mapping.sourceField}
                  </span>
                  <button
                    disabled={!enabled}
                    onClick={(e) => {
                      e.stopPropagation(); //prevents triggering the entries that rest below the option we want to select
                      onRemoveMapping(field);
                    }}
                  >
                    X
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
