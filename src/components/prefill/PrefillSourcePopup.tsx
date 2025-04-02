import { SourceOption } from "@/types/types";
import { useState } from "react";

type PrefillSourcePopupProps = {
  field: string;
  x: number;
  y: number;
  direct: SourceOption[];
  transitive: SourceOption[];
  global: SourceOption[];
  onClose: () => void;
  onSelect: (source: SourceOption) => void;
};

export default function PrefillSourcePopup({
  field,
  x,
  y,
  direct,
  transitive,
  global,
  onClose,
  onSelect,
}: PrefillSourcePopupProps) {
  const [search, setSearch] = useState("");

  const filter = (options: SourceOption[]) =>
    options.filter((opt) =>
      opt.value.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div
      className="absolute bg-white rounded shadow-lg border w-80 z-50"
      style={{ top: y, left: x }}
    >
      <div className="p-3 border-b font-semibold">
        Select source for <span className="text-blue-600">{field}</span>
      </div>
      <div className="px-3 py-2 border-b">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      <div className="p-2 max-h-80 overflow-y-auto">
        {filter(direct).length > 0 && (
          <>
            {filter(direct).map((opt) => (
              <button
                key={opt.value}
                onClick={() => onSelect(opt)}
                className="block w-full text-left hover:bg-gray-100 px-2 py-1 rounded"
              >
                {opt.value}
              </button>
            ))}
          </>
        )}
        {filter(transitive).length > 0 && (
          <>
            {filter(transitive).map((opt) => (
              <button
                key={opt.value}
                onClick={() => onSelect(opt)}
                className="block w-full text-left hover:bg-gray-100 px-2 py-1 rounded"
              >
                {opt.value}
              </button>
            ))}
          </>
        )}
        {filter(global).length > 0 && (
          <>
            {filter(global).map((opt) => (
              <button
                key={opt.value}
                onClick={() => onSelect(opt)}
                className="block w-full text-left hover:bg-gray-100 px-2 py-1 rounded"
              >
                {opt.value}
              </button>
            ))}
          </>
        )}
      </div>

      <div className="flex justify-end border-t p-2">
        <button
          onClick={onClose}
          className="text-sm text-gray-500 hover:underline"
        >
          Close
        </button>
      </div>
    </div>
  );
}
