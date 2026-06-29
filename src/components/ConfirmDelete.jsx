import { useState } from "react";

export default function ConfirmDelete({ open, user, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setDeleting(true);
    setError("");
    try {
      await onConfirm(user.id);
      onClose();
    } catch {
      setError("Failed to delete user. Please try again.");
      setDeleting(false);
    }
  };

  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-[#13151f] border border-[#1e2130] rounded-2xl w-full max-w-sm shadow-2xl p-6">
        <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
          <svg
            className="w-6 h-6 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-white font-semibold text-lg">Delete User</h2>
        <p className="text-slate-400 text-sm mt-2">
          Are you sure you want to delete{" "}
          <span className="text-white font-medium">
            {user.firstName} {user.lastName}
          </span>
          ? This action cannot be undone.
        </p>
        {error && (
          <p className="text-xs text-red-400 mt-3 bg-red-500/10 rounded-lg p-3">
            {error}
          </p>
        )}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 border border-[#252840] text-slate-400 hover:text-slate-200 rounded-xl py-2.5 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleting}
            className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white rounded-xl py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            {deleting && (
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
            {deleting ? "Deleting…" : "Delete User"}
          </button>
        </div>
      </div>
    </div>
  );
}
