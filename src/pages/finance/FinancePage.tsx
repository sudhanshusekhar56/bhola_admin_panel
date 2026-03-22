import { useEffect, useState } from "react";
import {
  getFinanceSummary,
  createSettlement,
  createRefund,
} from "@/services/admin.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function FinancePage() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("Loading finance summary...");

  const [chartData, setChartData] = useState([
    { name: "Commission", value: 0 },
    { name: "Settlement", value: 0 },
    { name: "TDS", value: 0 },
    { name: "GST", value: 0 },
  ]);

  const [settlementForm, setSettlementForm] = useState({
    panditId: "",
    amount: 0,
  });

  const [refundForm, setRefundForm] = useState({
    bookingId: "",
  });

  useEffect(() => {
    loadFinanceSummary();
  }, []);

  async function loadFinanceSummary() {
    try {
      setLoading(true);

      const res = await getFinanceSummary();

      setResponse(JSON.stringify(res, null, 2));

      const obj = typeof res === "object" ? res : {};

      setChartData([
        { name: "Commission", value: Number(obj?.commission ?? 0) },
        { name: "Settlement", value: Number(obj?.settlement ?? 0) },
        { name: "TDS", value: Number(obj?.tds ?? 0) },
        { name: "GST", value: Number(obj?.gst ?? 0) },
      ]);
    } catch {
      setResponse("Unable to fetch finance summary.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateSettlement(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await createSettlement(settlementForm);

      setResponse(JSON.stringify(res, null, 2));
    } catch {
      setResponse("Create settlement failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateRefund(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await createRefund(refundForm.bookingId);

      setResponse(JSON.stringify(res, null, 2));
    } catch {
      setResponse("Create refund failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-6 px-4 lg:px-6">
      {/* Header */}

      <div>
        <h2 className="text-xl font-semibold">
          Settlement, refunds and finance summary APIs
        </h2>
      </div>

      {/* Chart + Forms */}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chart */}

        <div className="h-[320px] rounded-lg border p-4">
          <h3 className="mb-4 text-sm font-semibold">Settlement Split</h3>

          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Forms */}

        <div className="space-y-6 rounded-lg border p-4">
          {/* Settlement */}

          <form onSubmit={handleCreateSettlement} className="space-y-3">
            <h3 className="text-sm font-semibold">Create Settlement</h3>

            <Input
              placeholder="panditId"
              value={settlementForm.panditId}
              onChange={(e) =>
                setSettlementForm({
                  ...settlementForm,
                  panditId: e.target.value,
                })
              }
            />

            <Input
              type="number"
              placeholder="amount"
              value={settlementForm.amount}
              onChange={(e) =>
                setSettlementForm({
                  ...settlementForm,
                  amount: Number(e.target.value),
                })
              }
            />

            <Button className="w-full" disabled={loading}>
              Create Settlement
            </Button>
          </form>

          {/* Refund */}

          <form onSubmit={handleCreateRefund} className="space-y-3">
            <h3 className="text-sm font-semibold">Create Refund</h3>

            <Input
              placeholder="bookingId"
              value={refundForm.bookingId}
              onChange={(e) =>
                setRefundForm({
                  bookingId: e.target.value,
                })
              }
            />

            <Button
              type="submit"
              variant="outline"
              className="w-full"
              disabled={loading}
            >
              Initiate Refund
            </Button>
          </form>
        </div>
      </div>

      <div className="overflow-auto rounded-lg border p-4">
        <pre className="text-xs">{response}</pre>
      </div>
    </section>
  );
}
