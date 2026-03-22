import { useEffect, useState } from "react";
import { ArrowUpDown } from "lucide-react";

import {
  createMandir,
  updateMandir,
  removeMandir,
  getMandirsCatalog,
} from "@/services/admin.service";
import { dummyMandirs } from "@/data/mockData";

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

export default function MandirsPage() {
  const [loading, setLoading] = useState(false);

  const [mandirs, setMandirs] = useState<any[]>(dummyMandirs);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [form, setForm] = useState({
    name: "",
    city: "",
    state: "",
    description: "",
    howToReach: "",
  });

  const [editForm, setEditForm] = useState({
    mandirId: "",
  });

  useEffect(() => {
    loadMandirs();
  }, []);

  async function loadMandirs() {
    try {
      setLoading(true);
      const res = await getMandirsCatalog();
      // setMandirs(extractRows(res))
      setPage(1);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      await createMandir(form);
      loadMandirs();
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate() {
    try {
      setLoading(true);
      await updateMandir(editForm.mandirId, form);
      loadMandirs();
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    try {
      setLoading(true);
      await removeMandir(editForm.mandirId);
      loadMandirs();
    } catch {
      // ignore
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

  function pick(item: any, keys: string[]) {
    for (const key of keys) {
      const value = item[key];
      if (value !== undefined && value !== null && `${value}`.trim() !== "") {
        return typeof value === "string" ? value : JSON.stringify(value);
      }
    }
    return "-";
  }

  function extractRows(payload: any) {
    if (Array.isArray(payload)) {
      return payload.filter((e) => typeof e === "object");
    }
    if (payload && typeof payload === "object") {
      const values = Object.values(payload);
      const arr = values.find((v) => Array.isArray(v));
      if (Array.isArray(arr)) {
        return arr.filter((e) => typeof e === "object");
      }
    }
    return [];
  }

  // Filter & Sort
  const filteredMandirs = mandirs.filter((m) => {
    if (!search) return true;
    const term = search.toLowerCase();

    // Check name, city, state, or ID
    const nameVal = pick(m, ["name"]).toLowerCase();
    const cityVal = pick(m, ["city"]).toLowerCase();
    const stateVal = pick(m, ["state"]).toLowerCase();
    const idVal = pick(m, ["id", "_id", "mandirId"]).toLowerCase();

    return (
      nameVal.includes(term) ||
      cityVal.includes(term) ||
      stateVal.includes(term) ||
      idVal.includes(term)
    );
  });

  const sortedMandirs = [...filteredMandirs].sort((a, b) => {
    if (!sortConfig) return 0;
    let keys: string[] = [];
    if (sortConfig.key === "name") keys = ["name"];
    else if (sortConfig.key === "city") keys = ["city"];
    else if (sortConfig.key === "state") keys = ["state"];

    const aVal = pick(a, keys).toLowerCase();
    const bVal = pick(b, keys).toLowerCase();

    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sortedMandirs.length / pageSize));
  const pagedMandirs = sortedMandirs.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  return (
    <section className="space-y-6 px-4 lg:px-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">
          Create and update mandir inventory
        </h2>
      </div>

      {/* Create Form */}
      <div className="rounded-lg border p-4">
        <form onSubmit={handleCreate} className="grid gap-3 sm:grid-cols-2">
          <Input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
          <Input
            placeholder="State"
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
          />
          <Input
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />
          <Input
            placeholder="How to reach"
            className="sm:col-span-2"
            value={form.howToReach}
            onChange={(e) =>
              setForm({
                ...form,
                howToReach: e.target.value,
              })
            }
          />
          <Button className="sm:col-span-2" disabled={loading}>
            Create Mandir
          </Button>
        </form>
      </div>

      {/* Update/Delete */}
      <div className="rounded-lg border p-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <Input
            placeholder="mandirId"
            value={editForm.mandirId}
            onChange={(e) =>
              setEditForm({
                mandirId: e.target.value,
              })
            }
          />
          <Button variant="outline" onClick={handleUpdate} disabled={loading}>
            Update
          </Button>
          <Button onClick={handleDelete} disabled={loading}>
            Delete
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border p-4">
        <div className="mb-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold">All Mandirs</h3>
            <p className="text-xs text-muted-foreground">
              {filteredMandirs.length} records
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Input
              placeholder="Search by ID, Name, City or State"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-[320px]"
            />
          </div>
        </div>

        {pagedMandirs.length === 0 ? (
          <p className="text-muted-foreground">No mandirs found.</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
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
                      onClick={() => handleSort("city")}
                      className="-ml-4"
                    >
                      City <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("state")}
                      className="-ml-4"
                    >
                      State <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pagedMandirs.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{pick(item, ["name"])}</TableCell>
                    <TableCell>{pick(item, ["city"])}</TableCell>
                    <TableCell>{pick(item, ["state"])}</TableCell>
                    <TableCell>{pick(item, ["description"])}</TableCell>
                  </TableRow>
                ))}
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
