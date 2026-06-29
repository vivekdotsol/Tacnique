const DEPT_COLORS = {
  Engineering: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
  Product: "bg-purple-500/10 text-purple-400 ring-purple-500/20",
  Design: "bg-pink-500/10 text-pink-400 ring-pink-500/20",
  Marketing: "bg-orange-500/10 text-orange-400 ring-orange-500/20",
  Sales: "bg-green-500/10 text-green-400 ring-green-500/20",
  HR: "bg-yellow-500/10 text-yellow-400 ring-yellow-500/20",
  Finance: "bg-teal-500/10 text-teal-400 ring-teal-500/20",
  Operations: "bg-red-500/10 text-red-400 ring-red-500/20",
  IT: "bg-indigo-500/10 text-indigo-400 ring-indigo-500/20",
  Legal: "bg-slate-500/10 text-slate-400 ring-slate-500/20",
};

function SortIcon({ field, sortField, sortOrder }) {
  if (sortField !== field)
    return (
      <svg
        className="w-3 h-3 text-slate-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
        />
      </svg>
    );
  return sortOrder === "asc" ? (
    <svg
      className="w-3 h-3 text-indigo-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 15l7-7 7 7"
      />
    </svg>
  ) : (
    <svg
      className="w-3 h-3 text-indigo-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}

export default function UserTable({
  users,
  sortField,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
}) {
  const headers = [
    { key: "id", label: "ID", sortable: false },
    { key: "firstName", label: "First Name", sortable: true },
    { key: "lastName", label: "Last Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "department", label: "Department", sortable: true },
    { key: "actions", label: "Actions", sortable: false },
  ];

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#1a1d2e] flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-slate-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <p className="text-slate-400 font-medium">No users found</p>
        <p className="text-slate-600 text-sm mt-1">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="border-b border-[#1e2130]">
            {headers.map((h) => (
              <th key={h.key} className="text-left px-4 py-3">
                {h.sortable ? (
                  <button
                    onClick={() => onSort(h.key)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-200 transition-colors group"
                  >
                    {h.label}
                    <SortIcon
                      field={h.key}
                      sortField={sortField}
                      sortOrder={sortOrder}
                    />
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {h.label}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => (
            <tr
              key={user.id}
              className={`border-b border-[#1a1d2e] hover:bg-[#1a1d2e]/50 transition-colors ${i % 2 === 0 ? "" : "bg-[#13151f]/30"}`}
            >
              <td className="px-4 py-3">
                <span className="font-mono text-xs text-slate-500">
                  #{String(user.id).padStart(3, "0")}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-slate-200 font-medium">
                {user.firstName}
              </td>
              <td className="px-4 py-3 text-sm text-slate-300">
                {user.lastName}
              </td>
              <td className="px-4 py-3 text-sm text-slate-400 font-mono">
                {user.email}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ${DEPT_COLORS[user.department] || DEPT_COLORS.IT}`}
                >
                  {user.department}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                    title="Edit user"
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(user)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete user"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
