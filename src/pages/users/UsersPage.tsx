import { useEffect, useState } from "react";
import { ArrowUpDown } from "lucide-react";

import {
  blockUser,
  unblockUser,
  getUsers,
  getBookings,
} from "@/services/admin.service";
import { dummyUsers } from "@/data/mockData";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function UsersPage() {
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState<any[]>(
    dummyUsers.map((u: any) => ({ ...u, status: u.status || "ACTIVE" })),
  );

  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    loadUsers();
  }, []);

  async function toggleStatus(item: any) {
    const id = pick(item, ["userId", "id", "_id"]);
    if (id === "-") return;

    const isBlocked = item.status === "BLOCKED";

    try {
      setLoading(true);

      if (isBlocked) {
        await unblockUser(id);
      } else {
        await blockUser(id);
      }

      const updatedUsers = users.map((u) =>
        pick(u, ["userId", "id", "_id"]) === id
          ? { ...u, status: isBlocked ? "ACTIVE" : "BLOCKED" }
          : u,
      );
      setUsers(updatedUsers);
    } catch {
      // handle error gracefully
    } finally {
      setLoading(false);
    }
  }

  async function loadUsers() {
    try {
      setLoading(true);
      const res = await getUsers();
      const rows = extractRows(res);

      if (rows.length === 0) {
        loadUsersFromBookings();
        return;
      }

      // setUsers(rows);
      setPage(1);
    } catch {
      loadUsersFromBookings();
    } finally {
      setLoading(false);
    }
  }

  async function loadUsersFromBookings() {
    try {
      setLoading(true);
      const res = await getBookings();
      const rows = extractRows(res);

      const userRows = rows
        .map((entry) => {
          const id = pickId(entry, ["userId", "user"]);
          return id === "-" ? null : { userId: id };
        })
        .filter(Boolean);

      const unique = Array.from(
        new Set(userRows.map((u: any) => u.userId)),
      ).map((userId) => ({ userId }));

      // setUsers(unique);
      setPage(1);
    } catch {
      // skip override
    } finally {
      setLoading(false);
    }
  }

  function handleSort(key: string) {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  }

  // Helper functions
  function pickId(item: any, keys: string[]) {
    for (const key of keys) {
      const value = item[key];
      if (typeof value === "string" && value.trim() !== "") return value;
      if (value && typeof value === "object") {
        const nestedId =
          value.id || value._id || value.userId || value.panditId || value.uid;
        if (nestedId) return nestedId;
      }
    }
    return "-";
  }

  function pick(item: any, keys: string[]) {
    for (const key of keys) {
      const value = item[key];
      if (value !== undefined && value !== null && `${value}`.trim() !== "") {
        return typeof value === "string" ? value : JSON.stringify(value);
      }
    }
    return "-";
  }

  function extractRows(payload: any): any[] {
    const candidates = findObjectArrays(payload);
    if (candidates.length === 0) return [];
    candidates.sort((a, b) => b.length - a.length);
    return candidates[0];
  }

  function findObjectArrays(payload: any, depth = 0): any[][] {
    if (depth > 6 || payload === null || payload === undefined) return [];
    if (Array.isArray(payload)) {
      const objectRows = payload.filter((entry) => typeof entry === "object");
      const nested = payload.flatMap((entry) =>
        findObjectArrays(entry, depth + 1),
      );
      return objectRows.length > 0 ? [objectRows, ...nested] : nested;
    }
    if (typeof payload === "object") {
      return Object.values(payload).flatMap((value) =>
        findObjectArrays(value, depth + 1),
      );
    }
    return [];
  }

  // Filter & Sort
  const filteredUsers = users.filter((u) => {
    if (!search) return true;
    const term = search.toLowerCase();
    const idVal = pick(u, ["userId", "id", "_id"]).toLowerCase();
    const nameVal = pick(u, ["name", "fullName"]).toLowerCase();
    const emailVal = pick(u, ["email"]).toLowerCase();
    return (
      idVal.includes(term) || nameVal.includes(term) || emailVal.includes(term)
    );
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortConfig) return 0;

    let keys: string[] = [];
    if (sortConfig.key === "id") keys = ["userId", "id", "_id"];
    else if (sortConfig.key === "name") keys = ["name", "fullName"];
    else if (sortConfig.key === "email") keys = ["email"];
    else if (sortConfig.key === "phone") keys = ["phone", "mobile"];

    const aVal = pick(a, keys).toLowerCase();
    const bVal = pick(b, keys).toLowerCase();

    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / pageSize));
  const pagedUsers = sortedUsers.slice((page - 1) * pageSize, page * pageSize);

  return (
    <section className="space-y-6 px-4 lg:px-6">
      <div>
        <h2 className="text-xl font-semibold">Block/unblock and view users</h2>
      </div>

      <div className="rounded-lg border p-4">
        <div className="mb-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold">All Users</h3>
            <p className="text-xs text-muted-foreground">
              {filteredUsers.length} records
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Input
              placeholder="Search by ID, Name or Email"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-[300px]"
            />
          </div>
        </div>

        {pagedUsers.length === 0 ? (
          <p className="text-muted-foreground">No users available.</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("id")}
                      className="-ml-4"
                    >
                      User ID <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("name")}
                      className="-ml-4"
                    >
                      Name <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("email")}
                      className="-ml-4"
                    >
                      Email <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("phone")}
                      className="-ml-4"
                    >
                      Phone <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Status / Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pagedUsers.map((item, i) => {
                  const isBlocked = item.status === "BLOCKED";
                  return (
                    <TableRow key={i}>
                      <TableCell>
                        {pick(item, ["userId", "id", "_id"])}
                      </TableCell>
                      <TableCell>{pick(item, ["name", "fullName"])}</TableCell>
                      <TableCell>{pick(item, ["email"])}</TableCell>
                      <TableCell>{pick(item, ["phone", "mobile"])}</TableCell>
                      <TableCell>
                        <Button
                          variant={isBlocked ? "destructive" : "secondary"}
                          size="sm"
                          disabled={loading}
                          onClick={() => toggleStatus(item)}
                        >
                          {isBlocked ? "Unblock" : "Block"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Prev
              </Button>
              <span className="flex items-center text-xs text-muted-foreground">
                Page {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
