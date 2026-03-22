import { useEffect, useState } from "react";
import { ArrowUpDown } from "lucide-react";

import {
  createPuja,
  updatePuja,
  getPujasCatalog,
} from "@/services/admin.service";
import { dummyPujas } from "@/data/mockData";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function PujasPage() {
  const [loading, setLoading] = useState(false);

  const [pujas, setPujas] = useState<any[]>(dummyPujas);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [form, setForm] = useState({
    mandirId: "",
    name: "",
    description: "",
    amount: 0,
    isVirtualAvailable: false,
  });

  const [pujaId, setPujaId] = useState("");

  useEffect(() => {
    loadPujas();
  }, []);

  async function create() {
    try {
      setLoading(true);
      await createPuja(form);
      loadPujas();
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function update() {
    if (!pujaId) return;
    try {
      setLoading(true);
      await updatePuja(pujaId, form);
      loadPujas();
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function loadPujas() {
    try {
      setLoading(true);
      const res = await getPujasCatalog();
      // setPujas(extractRows(res));
      setPage(1);
    } catch {
      // setPujas([]);
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
  const filteredPujas = pujas.filter((p) => {
    if (!search) return true;
    const term = search.toLowerCase();
    const nameVal = pick(p, ["name"]).toLowerCase();
    return nameVal.includes(term);
  });

  const sortedPujas = [...filteredPujas].sort((a, b) => {
    if (!sortConfig) return 0;
    
    let keys: string[] = [];
    if (sortConfig.key === "name") keys = ["name"];
    else if (sortConfig.key === "amount") keys = ["amount"];

    let aVal: any = pick(a, keys);
    let bVal: any = pick(b, keys);

    if (sortConfig.key === "amount") {
      aVal = Number(aVal) || 0;
      bVal = Number(bVal) || 0;
    } else {
      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();
    }

    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sortedPujas.length / pageSize));
  const pagedPujas = sortedPujas.slice((page - 1) * pageSize, page * pageSize);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Pujas</h2>
        <p className="text-sm text-muted-foreground">
          Add/update pujas and pricing
        </p>
      </div>

      <div className="rounded-lg border p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            placeholder="mandirId"
            value={form.mandirId}
            onChange={(e) => setForm({ ...form, mandirId: e.target.value })}
          />
          <Input
            placeholder="Puja name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
          <Input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: Number(e.target.value) })
            }
          />
          <div className="flex items-center gap-2 sm:col-span-2">
            <Checkbox
              checked={form.isVirtualAvailable}
              onCheckedChange={(value) =>
                setForm({ ...form, isVirtualAvailable: Boolean(value) })
              }
            />
            <span className="text-sm">Virtual available</span>
          </div>
          <Button className="sm:col-span-2" onClick={create} disabled={loading}>
            Create Puja
          </Button>
        </div>
      </div>

      <div className="grid gap-3 rounded-lg border p-4 sm:grid-cols-3">
        <Input
          placeholder="pujaId"
          value={pujaId}
          onChange={(e) => setPujaId(e.target.value)}
        />
        <Button
          variant="outline"
          onClick={update}
          disabled={!pujaId || loading}
        >
          Update
        </Button>
      </div>

      <div className="rounded-lg border p-4">
        <div className="mb-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold">All Pujas</h3>
            <p className="text-xs text-muted-foreground">
              {filteredPujas.length} records
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Input
              placeholder="Search by Name"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-[300px]"
            />
          </div>
        </div>

        {pagedPujas.length === 0 ? (
          <p className="text-muted-foreground">No pujas found.</p>
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
                  <TableHead>Mandir</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("amount")}
                      className="-ml-4"
                    >
                      Amount <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Virtual</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pagedPujas.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>{pick(item, ["name"])}</TableCell>
                    <TableCell>{pick(item, ["mandirId", "mandir"])}</TableCell>
                    <TableCell>{pick(item, ["amount"])}</TableCell>
                    <TableCell>{pick(item, ["isVirtualAvailable"])}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

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
