import { useEffect, useState } from "react"
import { ArrowUpDown } from "lucide-react"

import {
  approvePandit,
  rejectPandit,
  getPandits,
  getBookings,
} from "@/services/admin.service"
import { dummyPandits } from "@/data/mockData"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function PanditsPage() {
  const [loading, setLoading] = useState(false)

  const [pandits, setPandits] = useState<any[]>(
    dummyPandits.map((p) => ({ ...p, status: p.status || "PENDING" }))
  )
  
  const [search, setSearch] = useState("")
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "asc" | "desc"
  } | null>(null)

  const [page, setPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    loadPandits()
  }, [])

  async function handleStatusChange(item: any, newStatus: string) {
    const id = pick(item, ["panditId", "id", "_id"])
    if (id === "-") return

    try {
      setLoading(true)

      if (newStatus === "APPROVED") {
        await approvePandit(id)
      } else if (newStatus === "REJECTED" || newStatus === "BLOCKED") {
        await rejectPandit(id)
      }

      const updated = pandits.map((p) =>
        pick(p, ["panditId", "id", "_id"]) === id
          ? { ...p, status: newStatus }
          : p
      )
      setPandits(updated)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  async function loadPandits() {
    try {
      setLoading(true)
      const res = await getPandits()
      const rows = extractRows(res)

      if (rows.length === 0) {
        loadPanditsFromBookings()
        return
      }

      // setPandits(rows)
      setPage(1)
    } catch {
      loadPanditsFromBookings()
    } finally {
      setLoading(false)
    }
  }

  async function loadPanditsFromBookings() {
    try {
      setLoading(true)
      const res = await getBookings()
      const rows = extractRows(res)

      const panditRows = rows
        .map((entry) => {
          const panditId = pickId(entry, ["panditId", "pandit"])
          return panditId === "-" ? null : { panditId }
        })
        .filter(Boolean)

      const unique = Array.from(
        new Set(panditRows.map((p: any) => p.panditId))
      ).map((panditId) => ({ panditId }))

      // setPandits(unique)
      setPage(1)
    } catch {
      // setPandits([])
    } finally {
      setLoading(false)
    }
  }

  function handleSort(key: string) {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  function pickId(item: any, keys: string[]) {
    for (const key of keys) {
      const value = item[key]
      if (typeof value === "string" && value.trim() !== "") return value
      if (value && typeof value === "object") {
        const nestedId =
          value.id || value._id || value.panditId || value.userId || value.uid
        if (nestedId) return nestedId
      }
    }
    return "-"
  }

  function pick(item: any, keys: string[]) {
    for (const key of keys) {
      const value = item[key]
      if (value !== undefined && value !== null && `${value}`.trim() !== "") {
        return typeof value === "string" ? value : JSON.stringify(value)
      }
    }
    return "-"
  }

  function extractRows(payload: any): any[] {
    const candidates = findObjectArrays(payload)
    if (candidates.length === 0) return []
    candidates.sort((a, b) => b.length - a.length)
    return candidates[0]
  }

  function findObjectArrays(payload: any, depth = 0): any[][] {
    if (depth > 6 || payload === null || payload === undefined) return []
    if (Array.isArray(payload)) {
      const objectRows = payload.filter((entry) => typeof entry === "object")
      const nested = payload.flatMap((entry) =>
        findObjectArrays(entry, depth + 1)
      )
      return objectRows.length > 0 ? [objectRows, ...nested] : nested
    }
    if (typeof payload === "object") {
      return Object.values(payload).flatMap((value) =>
        findObjectArrays(value, depth + 1)
      )
    }
    return []
  }

  const filteredPandits = pandits.filter((p) => {
    if (!search) return true
    const term = search.toLowerCase()
    const idVal = pick(p, ["panditId", "id", "_id"]).toLowerCase()
    const nameVal = pick(p, ["name", "fullName"]).toLowerCase()
    const phoneVal = pick(p, ["phone", "mobile"]).toLowerCase()
    return idVal.includes(term) || nameVal.includes(term) || phoneVal.includes(term)
  })

  const sortedPandits = [...filteredPandits].sort((a, b) => {
    if (!sortConfig) return 0
    let keys: string[] = []
    if (sortConfig.key === "id") keys = ["panditId", "id", "_id"]
    else if (sortConfig.key === "name") keys = ["name", "fullName"]
    else if (sortConfig.key === "phone") keys = ["phone", "mobile"]

    const aVal = pick(a, keys).toLowerCase()
    const bVal = pick(b, keys).toLowerCase()

    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1
    return 0
  })

  const totalPages = Math.max(1, Math.ceil(sortedPandits.length / pageSize))
  const pagedPandits = sortedPandits.slice((page - 1) * pageSize, page * pageSize)

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Pandits</h2>
        <p className="text-sm text-muted-foreground">
          Approve or reject onboarding requests
        </p>
      </div>

      <div className="rounded-lg border p-4">
        <div className="mb-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold">All Pandits</h3>
            <p className="text-xs text-muted-foreground">
              {filteredPandits.length} records
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Input
              placeholder="Search by ID, Name or Phone"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="w-full sm:w-[300px]"
            />
          </div>
        </div>

        {pagedPandits.length === 0 ? (
          <p className="text-muted-foreground">No pandits available.</p>
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
                      Pandit ID <ArrowUpDown className="ml-2 h-4 w-4" />
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
                      onClick={() => handleSort("phone")}
                      className="-ml-4"
                    >
                      Phone <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pagedPandits.map((item, i) => {
                  const currentStatus = item.status || "PENDING"
                  return (
                    <TableRow key={i}>
                      <TableCell>
                        {pick(item, ["panditId", "id", "_id"])}
                      </TableCell>
                      <TableCell>{pick(item, ["name", "fullName"])}</TableCell>
                      <TableCell>{pick(item, ["phone", "mobile"])}</TableCell>
                      <TableCell>
                        <Select
                          disabled={loading}
                          value={currentStatus}
                          onValueChange={(val) => handleStatusChange(item, val)}
                        >
                          <SelectTrigger className="w-[140px] h-8 text-xs">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="APPROVED">Approved</SelectItem>
                            <SelectItem value="REJECTED">Rejected</SelectItem>
                            <SelectItem value="BLOCKED">Blocked</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  )
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
  )
}
