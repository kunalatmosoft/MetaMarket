// app/page.jsx
import MarketForm from "@/components/Mre";
import MarketDashboard from "@/components/Mde";

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight text-gray-800">
          Metamarket AI Advisor
        </h1>
        <p className="text-gray-600 mb-10">
          Enter a potential market idea and let{" "}
          <span className="font-semibold text-blue-600">Gemini AI</span> analyze 
          whether it’s worth creating — complete with ROI analytics, confidence 
          bands, and market simulations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
            <MarketForm />
          </div>
          <div>
            <MarketDashboard />
          </div>
        </div>
      </div>
    </main>
  );
}
