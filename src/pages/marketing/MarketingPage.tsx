import { useState } from "react"

import { createNewsletter, exportAnalytics } from "@/services/admin.service"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function MarketingPage() {
  const [loading, setLoading] = useState(false)

  const [response, setResponse] = useState(
    "Use actions to interact with marketing APIs."
  )

  const [message, setMessage] = useState("")

  async function handleSendNewsletter(e: React.FormEvent) {
    e.preventDefault()

    if (!message) return

    try {
      setLoading(true)

      const res = await createNewsletter({ message })

      setResponse(JSON.stringify(res, null, 2))
    } catch {
      setResponse("Create newsletter failed.")
    } finally {
      setLoading(false)
    }
  }

  async function handleExport(format: "csv" | "excel") {
    try {
      setLoading(true)

      const blob = await exportAnalytics(format)

      const url = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = `analytics.${format === "csv" ? "csv" : "xlsx"}`

      document.body.appendChild(link)
      link.click()

      link.remove()
      window.URL.revokeObjectURL(url)

      setResponse(`Downloaded analytics ${format.toUpperCase()} file.`)
    } catch {
      setResponse(`Export ${format.toUpperCase()} failed.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="space-y-6">
      {/* Header */}

      <div>
        <h2 className="text-xl font-semibold">Marketing</h2>

        <p className="text-sm text-muted-foreground">
          Newsletter and analytics export
        </p>
      </div>

      {/* Newsletter */}

      <div className="rounded-lg border p-4">
        <form onSubmit={handleSendNewsletter} className="space-y-3">
          <Textarea
            rows={4}
            placeholder="Campaign message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <Button disabled={!message || loading}>Create Newsletter</Button>
        </form>
      </div>

      {/* Export */}

      <div className="flex flex-wrap gap-2 rounded-lg border p-4">
        <Button
          variant="outline"
          onClick={() => handleExport("csv")}
          disabled={loading}
        >
          Export CSV
        </Button>

        <Button
          variant="outline"
          onClick={() => handleExport("excel")}
          disabled={loading}
        >
          Export Excel
        </Button>
      </div>

      {/* Response */}

      <div className="overflow-auto rounded-lg border p-4">
        <pre className="text-xs">{response}</pre>
      </div>
    </section>
  )
}
