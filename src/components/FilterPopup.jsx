import { useState, useRef, useEffect } from "react";
import { DEPARTMENTS } from "../utils/constants";

export default function FilterPopup({ filters, onApply, onReset }) {
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState(filters);
  const ref = useRef(null);

  useEffect(() => {
    setLocal(filters);
  }, [filters]);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeCount = Object.values(filters).filter(Boolean).length;

  const handleApply = () => {
    onApply(local);
    setOpen(false);
  };

  const handleReset = () => {
    const empty = { department: "" };
    setLocal(empty);
    onReset();
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 border rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          activeCount > 0
            ? "bg-indigo-600 border-indigo-500 text-white"
            : "bg-[#1a1d2e] border-[#252840] text-slate-300 hover:border-indigo-500"
        }`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
          />
        </svg>
        Filter
        {activeCount > 0 && (
          <span className="bg-white text-indigo-600 text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-[#13151f] border border-[#1e2130] rounded-xl shadow-2xl z-50 p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Filter by
          </p>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Department
              </label>
              <select
                value={local.department}
                onChange={(e) =>
                  setLocal({ ...local, department: e.target.value })
                }
                className="w-full bg-[#1a1d2e] border border-[#252840] text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="">All departments</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleReset}
              className="flex-1 border border-[#252840] text-slate-400 hover:text-slate-200 rounded-lg py-2 text-sm transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2 text-sm font-medium transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
