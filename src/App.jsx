import { useState, useMemo } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import FilterPopup from "./components/FilterPopup";
import UserTable from "./components/UserTable";
import Pagination from "./components/Pagination";
import UserForm from "./components/UserForm";
import ConfirmDelete from "./components/ConfirmDelete";
import { useUsers } from "./hooks/useUsers";

const EMPTY_FILTERS = { department: "" };

export default function App() {
  const { users, loading, error, addUser, editUser, removeUser } = useUsers();

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sortField, setSortField] = useState("firstName");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleSort = (field) => {
    if (sortField === field)
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const processedUsers = useMemo(() => {
    let result = [...users];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.firstName.toLowerCase().includes(q) ||
          u.lastName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q),
      );
    }
    if (filters.department)
      result = result.filter((u) => u.department === filters.department);
    result.sort((a, b) => {
      const va = (a[sortField] || "").toString().toLowerCase();
      const vb = (b[sortField] || "").toString().toLowerCase();
      return sortOrder === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });
    return result;
  }, [users, searchQuery, filters, sortField, sortOrder]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedUsers.slice(start, start + pageSize);
  }, [processedUsers, currentPage, pageSize]);

  const handleAddUser = () => {
    setEditingUser(null);
    setFormOpen(true);
  };
  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormOpen(true);
  };
  const handleDeleteUser = (user) => setDeleteTarget(user);

  const handleSave = async (formData) => {
    if (editingUser) await editUser(editingUser.id, formData);
    else await addUser(formData);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#0f1117]">
      <Header onAddUser={handleAddUser} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Users", value: users.length },
            { label: "Filtered", value: processedUsers.length },
            {
              label: "Departments",
              value: [...new Set(users.map((u) => u.department))].length,
            },
            {
              label: "Page",
              value:
                currentPage +
                " / " +
                Math.max(1, Math.ceil(processedUsers.length / pageSize)),
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-[#13151f] border border-[#1e2130] rounded-xl px-4 py-3"
            >
              <p className="text-xs text-slate-500 font-medium">{label}</p>
              <p className="text-2xl font-semibold text-white mt-1 font-mono">
                {value}
              </p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <SearchBar
            value={searchQuery}
            onChange={(q) => {
              setSearchQuery(q);
              setCurrentPage(1);
            }}
          />
          <FilterPopup
            filters={filters}
            onApply={(f) => {
              setFilters(f);
              setCurrentPage(1);
            }}
            onReset={() => {
              setFilters(EMPTY_FILTERS);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="bg-[#13151f] border border-[#1e2130] rounded-2xl overflow-hidden">
          {error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-slate-300 font-medium">Unable to load users</p>
              <p className="text-slate-500 text-sm mt-1 max-w-sm">{error}</p>
            </div>
          ) : loading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-[#1a1d2e] rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : (
            <>
              <UserTable
                users={paginatedUsers}
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
              />
              <Pagination
                currentPage={currentPage}
                pageSize={pageSize}
                totalCount={processedUsers.length}
                onPageChange={setCurrentPage}
                onPageSizeChange={(s) => {
                  setPageSize(s);
                  setCurrentPage(1);
                }}
              />
            </>
          )}
        </div>
      </main>
      <UserForm
        open={formOpen}
        user={editingUser}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
      />
      <ConfirmDelete
        open={Boolean(deleteTarget)}
        user={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={removeUser}
      />
    </div>
  );
}
