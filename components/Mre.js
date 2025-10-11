// app/components/MarketForm.jsx
"use client";
import { useState } from "react";

export default function MarketForm() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: desc,
          resolution_date: date,
          market_type: "binary",
        }),
      });
      const json = await res.json();
      if (json.evaluation) setResult(json.evaluation);
      else setResult({ error: json.error || "unknown" , raw: json.raw });
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Propose a Metamarket Market</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required value={title} onChange={e=>setTitle(e.target.value)} placeholder="Market title" className="w-full p-2 border rounded"/>
        <textarea required value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Short description" className="w-full p-2 border rounded" rows={4} />
        <input value={date} onChange={e=>setDate(e.target.value)} placeholder="Resolution date (YYYY-MM-DD)" className="w-full p-2 border rounded" />
        <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? "Analyzing..." : "Analyze with Gemini"}</button>
      </form>

      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          {result.error ? (
            <pre>{JSON.stringify(result, null, 2)}</pre>
          ) : (
            <>
              <h3 className="text-xl font-semibold">Evaluation</h3>
              <p><strong>Recommendation:</strong> {result.recommendation} ({(result.confidence*100).toFixed(0)}%)</p>
              <p><strong>Estimated return:</strong> {result.estimated_return_pct != null ? result.estimated_return_pct + "%" : "N/A"}</p>
              <p><strong>Rationale:</strong> {result.rationale}</p>
              {result.main_drivers && (
                <div>
                  <strong>Main drivers:</strong>
                  <ul className="list-disc ml-6">
                    {result.main_drivers.map((d,i)=> <li key={i}>{d}</li>)}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      )}

    </div>
  );
}
