import { useState } from "react";

export default function App() {
  const [form, setForm] = useState({});
  const [result, setResult] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    const res = await fetch("http://localhost:3001/api/crop-recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        N: Number(form.N),
        P: Number(form.P),
        K: Number(form.K),
        temperature: Number(form.temperature),
        humidity: Number(form.humidity),
        ph: Number(form.ph),
        rainfall: Number(form.rainfall),
      }),
    });

    const data = await res.json();
    setResult(data.recommended_crop);
  };

  // ✅ Equipment mapping (ALL crops from dataset)
  const equipmentMap = {
    rice: ["Tractor", "Paddy Transplanter", "Harvester", "Sprayer", "Irrigation Pump"],
    maize: ["Tractor", "Seed Drill", "Sprayer", "Harvester"],
    chickpea: ["Tractor", "Seed Drill", "Sprayer", "Harvester"],
    kidneybeans: ["Tractor", "Seed Drill", "Sprayer"],
    pigeonpeas: ["Tractor", "Seed Drill", "Sprayer"],
    mothbeans: ["Tractor", "Seed Drill", "Sprayer"],
    mungbean: ["Tractor", "Seed Drill", "Sprayer"],
    blackgram: ["Tractor", "Seed Drill", "Sprayer"],
    lentil: ["Tractor", "Seed Drill", "Sprayer"],
    cotton: ["Tractor", "Sprayer", "Drip Irrigation System", "Cotton Picker"],
    jute: ["Tractor", "Seed Drill", "Sprayer"],
    coffee: ["Sprayer", "Irrigation System", "Pruning Equipment"],
    banana: ["Tractor", "Drip Irrigation System", "Sprayer"],
    mango: ["Sprayer", "Pruning Equipment", "Irrigation System"],
    grapes: ["Sprayer", "Drip Irrigation System", "Pruning Equipment"],
    watermelon: ["Tractor", "Seed Drill", "Drip Irrigation System"],
    muskmelon: ["Tractor", "Seed Drill", "Drip Irrigation System"],
    apple: ["Sprayer", "Pruning Equipment", "Irrigation System"],
    orange: ["Sprayer", "Irrigation System", "Pruning Equipment"],
    papaya: ["Tractor", "Drip Irrigation System", "Sprayer"],
    coconut: ["Irrigation System", "Sprayer", "Harvesting Tools"],
    pomegranate: ["Sprayer", "Drip Irrigation System", "Pruning Equipment"],
    default: ["Tractor", "Seed Drill", "Sprayer", "Irrigation Equipment"],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-3xl">

        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-green-700 mb-2">
          🌱 Crop Recommendation System
        </h1>
        <p className="text-center text-gray-600 mb-8">
          AI-powered crop suggestions using soil & weather data
        </p>

        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            ["N", "Nitrogen (N)"],
            ["P", "Phosphorus (P)"],
            ["K", "Potassium (K)"],
            ["temperature", "Temperature (°C)"],
            ["humidity", "Humidity (%)"],
            ["ph", "Soil pH"],
            ["rainfall", "Rainfall (mm)"],
          ].map(([name, label]) => (
            <div key={name}>
              <label className="text-sm font-medium text-gray-700">
                {label}
              </label>
              <input
                name={name}
                type="number"
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          ))}
        </div>

        {/* Button */}
        <button
          onClick={submit}
          className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow"
        >
          🌾 Recommend Crop
        </button>

        {/* Crop Result + Equipment */}
        {result && (
          <>
            {/* Crop Result */}
            <div className="mt-6 bg-green-100 border border-green-300 rounded-xl p-4 text-center">
              <p className="text-gray-600 text-sm">Recommended Crop</p>
              <p className="text-2xl font-bold text-green-800">{result}</p>
            </div>

            {/* Equipment Recommendation Cards */}
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
                🚜 Recommended Equipment
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {(equipmentMap[result.toLowerCase()] || equipmentMap.default).map(
                  (item, index) => (
                    <div
                      key={index}
                      className="bg-white border border-green-200 rounded-2xl shadow-md p-5 hover:shadow-xl transition"
                    >
                      <div className="text-4xl text-center mb-3">🚜</div>

                      <h3 className="text-lg font-semibold text-center text-gray-800">
                        {item}
                      </h3>

                      <p className="text-sm text-gray-500 text-center mt-2">
                        Available for rent near you
                      </p>

                      <button className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium">
                        View Rentals
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
