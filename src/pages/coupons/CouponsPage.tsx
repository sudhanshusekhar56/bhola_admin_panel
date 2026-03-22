import { useEffect, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { getCoupons, createCoupon } from "@/services/admin.service";
import { dummyCoupons } from "@/data/mockData";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export default function CouponsPage() {
  const [loading, setLoading] = useState(false);

  const [coupons, setCoupons] = useState<any[]>(dummyCoupons);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [form, setForm] = useState({
    code: "",
    discountPercent: 10,
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  async function loadCoupons() {
    try {
      setLoading(true);
      const res = await getCoupons();
      // setCoupons(extractRows(res))
      setPage(1);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateCoupon(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      await createCoupon(form);
      loadCoupons();
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
      return payload.filter((entry) => typeof entry === "object");
    }
    if (payload && typeof payload === "object") {
      const values = Object.values(payload);
      const arr = values.find((v) => Array.isArray(v));
      if (Array.isArray(arr)) {
        return arr.filter((entry) => typeof entry === "object");
      }
    }
    return [];
  }

  // Filter & Sort
  const filteredCoupons = coupons.filter((c) => {
    if (!search) return true;
    const term = search.toLowerCase();
    const codeVal = pick(c, ["code"]).toLowerCase();
    return codeVal.includes(term);
  });

  const sortedCoupons = [...filteredCoupons].sort((a, b) => {
    if (!sortConfig) return 0;
    let keys: string[] = [];
    if (sortConfig.key === "code") keys = ["code"];
    else if (sortConfig.key === "discount") keys = ["discountPercent"];
    else if (sortConfig.key === "status") keys = ["status"];

    let aVal: any = pick(a, keys);
    let bVal: any = pick(b, keys);

    if (sortConfig.key === "discount") {
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

  const totalPages = Math.max(1, Math.ceil(sortedCoupons.length / pageSize));
  const pagedCoupons = sortedCoupons.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  return (
    <section className="space-y-6 px-4 lg:px-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            Create and list coupons
          </h2>
        </div>

        <Button variant="outline" onClick={loadCoupons} disabled={loading}>
          Refresh
        </Button>
      </div>

      {/* Form */}
      <div className="rounded-lg border p-4">
        <form
          onSubmit={handleCreateCoupon}
          className="grid gap-3 sm:grid-cols-3"
        >
          <Input
            placeholder="Coupon code"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Discount %"
            value={form.discountPercent}
            onChange={(e) =>
              setForm({
                ...form,
                discountPercent: Number(e.target.value),
              })
            }
          />
          <Button disabled={loading}>Create Coupon</Button>
        </form>
      </div>

      {/* Table */}
      <div className="rounded-lg border p-4">
        <div className="mb-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold">All Coupons</h3>
            <p className="text-xs text-muted-foreground">
              {filteredCoupons.length} records
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Input
              placeholder="Search by Code"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-[300px]"
            />
          </div>
        </div>

        {pagedCoupons.length === 0 ? (
          <p className="text-muted-foreground">No coupons available.</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("code")}
                      className="-ml-4"
                    >
                      Code <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("discount")}
                      className="-ml-4"
                    >
                      Discount % <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("status")}
                      className="-ml-4"
                    >
                      Status <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pagedCoupons.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{pick(item, ["code"])}</TableCell>
                    <TableCell>{pick(item, ["discountPercent"])}</TableCell>
                    <TableCell>{pick(item, ["status"])}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-end gap-2">
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
