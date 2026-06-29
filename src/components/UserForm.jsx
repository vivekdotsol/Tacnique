import { useState, useEffect } from "react";
import { validateForm } from "../utils/validators";
import { DEPARTMENTS } from "../utils/constants";

const EMPTY_FORM = { firstName: "", lastName: "", email: "", department: "" };

export default function UserForm({ open, user, onClose, onSave, loading }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");

  const isEdit = Boolean(user);

  useEffect(() => {
    if (open) {
      setForm(
        user
          ? {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              department: user.department,
            }
          : EMPTY_FORM,
      );
      setErrors({});
      setApiError("");
    }
  }, [open, user]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSaving(true);
    setApiError("");
    try {
      await onSave(form);
      onClose();
    } catch {
      setApiError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-[#13151f] border border-[#1e2130] rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2130]">
          <div>
            <h2 className="text-white font-semibold">
              {isEdit ? "Edit User" : "Add New User"}
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              {isEdit
                ? `Updating record #${user.id}`
                : "Fill in the details below"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-[#1a1d2e] transition-colors"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {apiError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
              {apiError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {[
              ["firstName", "First Name"],
              ["lastName", "Last Name"],
            ].map(([field, label]) => (
              <div key={field}>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  {label}
                </label>
                <input
                  type="text"
                  value={form[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  placeholder={label}
                  className={`w-full bg-[#1a1d2e] border rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition-colors ${
                    errors[field]
                      ? "border-red-500 focus:border-red-500"
                      : "border-[#252840] focus:border-indigo-500"
                  }`}
                />
                {errors[field] && (
                  <p className="text-xs text-red-400 mt-1">{errors[field]}</p>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="name@company.com"
              className={`w-full bg-[#1a1d2e] border rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition-colors ${
                errors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-[#252840] focus:border-indigo-500"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-400 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Department
            </label>
            <select
              value={form.department}
              onChange={(e) => handleChange("department", e.target.value)}
              className={`w-full bg-[#1a1d2e] border rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none transition-colors ${
                errors.department
                  ? "border-red-500 focus:border-red-500"
                  : "border-[#252840] focus:border-indigo-500"
              }`}
            >
              <option value="">Select department…</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {errors.department && (
              <p className="text-xs text-red-400 mt-1">{errors.department}</p>
            )}
          </div>
        </div>

        <div className="px-6 pb-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-[#252840] text-slate-400 hover:text-slate-200 rounded-xl py-2.5 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white rounded-xl py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            {saving && (
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Create User"}
          </button>
        </div>
      </div>
    </div>
  );
}
