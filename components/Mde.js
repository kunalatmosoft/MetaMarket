// app/page.jsx
"use client";

import { useState } from "react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const domainData = {
  Healthcare: {
    insights:
      "AI-driven healthcare analytics improve diagnostics accuracy, patient monitoring, and drug discovery. By 2030, AI is expected to reduce hospital costs by 25%.",
    metrics: [
      { year: 2015, roi: 2, adoption: 5, probability: 30 },
      { year: 2016, roi: 5, adoption: 8, probability: 35 },
      { year: 2017, roi: 8, adoption: 12, probability: 40 },
      { year: 2018, roi: 12, adoption: 18, probability: 46 },
      { year: 2019, roi: 18, adoption: 25, probability: 52 },
      { year: 2020, roi: 25, adoption: 30, probability: 58 },
      { year: 2021, roi: 32, adoption: 40, probability: 64 },
      { year: 2022, roi: 40, adoption: 52, probability: 70 },
      { year: 2023, roi: 50, adoption: 63, probability: 76 },
      { year: 2024, roi: 65, adoption: 74, probability: 82 },
      { year: 2025, roi: 85, adoption: 81, probability: 85 },
      { year: 2026, roi: 120, adoption: 88, probability: 88 },
      { year: 2027, roi: 160, adoption: 93, probability: 90 },
      { year: 2028, roi: 230, adoption: 96, probability: 93 },
      { year: 2029, roi: 310, adoption: 98, probability: 95 },
      { year: 2030, roi: 420, adoption: 99, probability: 97 },
    ],
  },

  Finance: {
    insights:
      "AI and ML algorithms automate over 80% of trading decisions. Predictive analytics improve portfolio performance and reduce fraud detection time by 60%.",
    metrics: [
      { year: 2015, roi: 5, adoption: 10, probability: 40 },
      { year: 2016, roi: 8, adoption: 15, probability: 44 },
      { year: 2017, roi: 12, adoption: 22, probability: 50 },
      { year: 2018, roi: 25, adoption: 30, probability: 56 },
      { year: 2019, roi: 40, adoption: 38, probability: 61 },
      { year: 2020, roi: 60, adoption: 45, probability: 67 },
      { year: 2021, roi: 85, adoption: 54, probability: 72 },
      { year: 2022, roi: 120, adoption: 63, probability: 77 },
      { year: 2023, roi: 160, adoption: 70, probability: 82 },
      { year: 2024, roi: 210, adoption: 77, probability: 86 },
      { year: 2025, roi: 280, adoption: 82, probability: 89 },
      { year: 2026, roi: 360, adoption: 88, probability: 92 },
      { year: 2027, roi: 450, adoption: 93, probability: 94 },
      { year: 2028, roi: 540, adoption: 96, probability: 96 },
      { year: 2029, roi: 640, adoption: 98, probability: 97 },
      { year: 2030, roi: 760, adoption: 99, probability: 98 },
    ],
  },

  Trading: {
    insights:
      "Algorithmic trading with AI leads to 35% higher annualized returns. Autonomous trading bots adapt to market volatility in milliseconds.",
    metrics: [
      { year: 2018, roi: 10, adoption: 8, probability: 45 },
      { year: 2019, roi: 25, adoption: 15, probability: 50 },
      { year: 2020, roi: 45, adoption: 25, probability: 56 },
      { year: 2021, roi: 70, adoption: 35, probability: 63 },
      { year: 2022, roi: 110, adoption: 48, probability: 70 },
      { year: 2023, roi: 160, adoption: 60, probability: 76 },
      { year: 2024, roi: 220, adoption: 70, probability: 80 },
      { year: 2025, roi: 300, adoption: 78, probability: 84 },
      { year: 2026, roi: 400, adoption: 86, probability: 88 },
      { year: 2027, roi: 520, adoption: 92, probability: 91 },
      { year: 2028, roi: 660, adoption: 96, probability: 94 },
      { year: 2029, roi: 820, adoption: 98, probability: 96 },
      { year: 2030, roi: 950, adoption: 99, probability: 98 },
    ],
  },

  Education: {
    insights:
      "AI personalizes learning paths, predicts student performance, and enhances accessibility. By 2030, 1.2B students will use adaptive AI-driven systems.",
    metrics: [
      { year: 2015, roi: 2, adoption: 3, probability: 20 },
      { year: 2016, roi: 3, adoption: 4, probability: 24 },
      { year: 2017, roi: 5, adoption: 6, probability: 30 },
      { year: 2018, roi: 8, adoption: 9, probability: 35 },
      { year: 2019, roi: 12, adoption: 13, probability: 40 },
      { year: 2020, roi: 18, adoption: 20, probability: 47 },
      { year: 2021, roi: 25, adoption: 28, probability: 53 },
      { year: 2022, roi: 35, adoption: 36, probability: 60 },
      { year: 2023, roi: 50, adoption: 45, probability: 68 },
      { year: 2024, roi: 70, adoption: 55, probability: 74 },
      { year: 2025, roi: 95, adoption: 65, probability: 79 },
      { year: 2026, roi: 130, adoption: 75, probability: 83 },
      { year: 2027, roi: 180, adoption: 83, probability: 87 },
      { year: 2028, roi: 250, adoption: 90, probability: 91 },
      { year: 2029, roi: 330, adoption: 94, probability: 94 },
      { year: 2030, roi: 420, adoption: 97, probability: 96 },
    ],
  },

  Manufacturing: {
    insights:
      "AI and robotics reduce operational costs by 30%, predict equipment failures, and increase productivity through automation.",
    metrics: [
      { year: 2015, roi: 5, adoption: 10, probability: 40 },
      { year: 2016, roi: 8, adoption: 15, probability: 44 },
      { year: 2017, roi: 15, adoption: 20, probability: 50 },
      { year: 2018, roi: 25, adoption: 28, probability: 55 },
      { year: 2019, roi: 40, adoption: 36, probability: 60 },
      { year: 2020, roi: 55, adoption: 45, probability: 66 },
      { year: 2021, roi: 80, adoption: 53, probability: 72 },
      { year: 2022, roi: 110, adoption: 62, probability: 78 },
      { year: 2023, roi: 150, adoption: 70, probability: 82 },
      { year: 2024, roi: 200, adoption: 77, probability: 86 },
      { year: 2025, roi: 260, adoption: 83, probability: 89 },
      { year: 2026, roi: 340, adoption: 89, probability: 91 },
      { year: 2027, roi: 420, adoption: 94, probability: 93 },
      { year: 2028, roi: 500, adoption: 97, probability: 95 },
      { year: 2029, roi: 590, adoption: 99, probability: 97 },
      { year: 2030, roi: 700, adoption: 100, probability: 98 },
    ],
  },
};


export default function Dashboard() {
  const [selectedDomain, setSelectedDomain] = useState("Healthcare");

  return (
    <main className="min-h-screen p-6 bg-gradient-to-br from-white to-blue-50 text-gray-900">
      {/* Small heading */}
      <h1 className="text-xl font-bold mb-4 text-center tracking-tight">
        AI Market Analytics Dashboard
      </h1>

      {/* Smaller Buttons */}
      <div className="flex justify-center mb-6 gap-2 flex-wrap">
        {Object.keys(domainData).map((domain) => (
          <button
            key={domain}
            onClick={() => setSelectedDomain(domain)}
            className={`px-3 py-1 rounded-lg shadow-sm text-sm transition font-medium
              ${selectedDomain === domain
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
          >
            {domain}
          </button>
        ))}
      </div>

      {/* Insights */}
      <div className="max-w-2xl mx-auto mb-6 text-center">
        <p className="text-gray-600 text-sm leading-relaxed italic">
          {domainData[selectedDomain].insights}
        </p>
      </div>

      {/* Large Graphs stacked vertically */}
      <div className="flex flex-col gap-6">
        
        {/* ROI Line Chart */}
        <div className="p-4 bg-white rounded-xl shadow-md border w-full">
          <h3 className="text-sm font-semibold mb-2">ROI Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={domainData[selectedDomain].metrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="roi" stroke="#2563eb" strokeWidth={2.5} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Adoption Area Chart */}
        <div className="p-4 bg-white rounded-xl shadow-md border w-full">
          <h3 className="text-sm font-semibold mb-2">Adoption Curve</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={domainData[selectedDomain].metrics}>
              <defs>
                <linearGradient id="colorAdoption" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="adoption" stroke="#10b981" fillOpacity={1} fill="url(#colorAdoption)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Probability Bar Chart */}
        <div className="p-4 bg-white rounded-xl shadow-md border w-full">
          <h3 className="text-sm font-semibold mb-2">Success Probability (%)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={domainData[selectedDomain].metrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="probability" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </main>
  );
}
