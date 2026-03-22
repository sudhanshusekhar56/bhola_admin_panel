import { useEffect, useMemo, useState } from "react"
import { ArrowUpDown } from "lucide-react"
import { getBookings, assignPandit } from "@/services/admin.service"
import { dummyBookings } from "@/data/mockData"

import Loader from "@/components/common/Loader"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Booking = Record<string, any>

export default function BookingsPage() {
  const [loading, setLoading] = useState(false)

  const [bookings, setBookings] = useState<Booking[]>(dummyBookings)
  const [search, setSearch] = useState("")
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "asc" | "desc"
  } | null>(null)

  const [bookingId, setBookingId] = useState("")
  const [panditId, setPanditId] = useState("")

  const [page, setPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    refresh()
  }, [])

  async function refresh() {
    try {
      setLoading(true)
      const res = await getBookings()
      // setBookings(extractRows(res))
      setPage(1)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault()
    if (!bookingId || !panditId) return

    try {
      setLoading(true)
      await assignPandit(bookingId, panditId)
      setBookingId("")
      setPanditId("")
      refresh()
    } catch {
      // ignore
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

  function pick(item: Booking, keys: string[]) {
    for (const key of keys) {
      const value = item[key]
      if (value !== undefined && value !== null && `${value}`.trim() !== "") {
        return typeof value === "string" ? value : JSON.stringify(value)
      }
    }
    return "-"
  }

  function extractRows(payload: any): Booking[] {
    const candidates = findObjectArrays(payload)
    if (candidates.length === 0) return []
    candidates.sort((a, b) => b.length - a.length)
    return candidates[0]
  }

  function findObjectArrays(payload: any, depth = 0): Booking[][] {
    if (depth > 6 || payload === null || payload === undefined) return []
    if (Array.isArray(payload)) {
      const objectRows = payload.filter(
        (entry) => typeof entry === "object" && entry !== null
      )
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

  // Filter & Sort
  const filteredBookings = bookings.filter((b) => {
    if (!search) return true
    const term = search.toLowerCase()
    const bookingVal = pick(b, ["bookingId", "id", "_id"]).toLowerCase()
    const userVal = pick(b, ["userId", "user"]).toLowerCase()
    const panditVal = pick(b, ["panditId", "pandit"]).toLowerCase()
    return bookingVal.includes(term) || userVal.includes(term) || panditVal.includes(term)
  })

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (!sortConfig) return 0
    let keys: string[] = []
    if (sortConfig.key === "booking") keys = ["bookingId", "id", "_id"]
    else if (sortConfig.key === "user") keys = ["userId", "user"]
    else if (sortConfig.key === "pandit") keys = ["panditId", "pandit"]
    else if (sortConfig.key === "status") keys = ["status"]
    else if (sortConfig.key === "date") keys = ["date", "bookingDate", "createdAt"]

    const aVal = pick(a, keys).toLowerCase()
    const bVal = pick(b, keys).toLowerCase()

    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1
    return 0
  })

  const totalPages = Math.max(1, Math.ceil(sortedBookings.length / pageSize))
  const pagedBookings = sortedBookings.slice((page - 1) * pageSize, page * pageSize)

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            Bookings
          </h2>
          <p className="text-sm text-muted-foreground">
            /api/v1/admin/bookings
          </p>
        </div>

        <Button variant="secondary" onClick={refresh} disabled={loading}>
          Refresh
        </Button>
      </div>

      {loading && (
        <Card>
          <CardContent className="p-6">
            <Loader />
          </CardContent>
        </Card>
      )}

      {/* Assign Pandit */}
      <Card>
        <CardHeader>
          <CardTitle>Assign Pandit</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAssign} className="grid gap-3 sm:grid-cols-3">
            <Input
              placeholder="bookingId"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
            />
            <Input
              placeholder="panditId"
              value={panditId}
              onChange={(e) => setPanditId(e.target.value)}
            />
            <Button type="submit" disabled={!bookingId || !panditId || loading}>
              Assign
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <CardTitle className="text-sm">All Bookings</CardTitle>
            <p className="text-xs text-muted-foreground">
              {filteredBookings.length} records
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Input
              placeholder="Search by Booking, User or Pandit ID"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="w-full sm:w-[350px]"
            />
          </div>
        </CardHeader>

        <CardContent>
          {pagedBookings.length === 0 ? (
            <p className="text-muted-foreground">No bookings found.</p>
          ) : (
            <>
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Button variant="ghost" onClick={() => handleSort("booking")} className="-ml-4">
                          Booking <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" onClick={() => handleSort("user")} className="-ml-4">
                          User <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" onClick={() => handleSort("pandit")} className="-ml-4">
                          Pandit <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" onClick={() => handleSort("status")} className="-ml-4">
                          Status <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" onClick={() => handleSort("date")} className="-ml-4">
                          Date <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {pagedBookings.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {pick(item, ["bookingId", "id", "_id"])}
                        </TableCell>
                        <TableCell>
                          {pick(item, ["userId", "user"])}
                        </TableCell>
                        <TableCell>
                          {pick(item, ["panditId", "pandit"])}
                        </TableCell>
                        <TableCell>{pick(item, ["status"])}</TableCell>
                        <TableCell>
                          {pick(item, ["date", "bookingDate", "createdAt"])}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

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
        </CardContent>
      </Card>
    </section>
  )
}
