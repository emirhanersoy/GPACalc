"use client"

import type React from "react"
import type { GradingSystem } from "@/types"

interface GradingSystemSelectorProps {
  selectedSystem: GradingSystem
  onSystemChange: (system: GradingSystem) => void
}

const GradingSystemSelector: React.FC<GradingSystemSelectorProps> = ({ selectedSystem, onSystemChange }) => {
  const systems = [
    {
      id: "turkish" as GradingSystem,
      label: "AA, BA, BB, CB...",
    },
    {
      id: "extended" as GradingSystem,
      label: "AA, AB, BA, BB...",
    },
    {
      id: "american" as GradingSystem,
      label: "A, A-, B+, B...",
    },
    {
      id: "numeric" as GradingSystem,
      label: "A1, A2, A3, B1...",
    },
  ]

  return (
    <div className="mb-8 w-full max-w-5xl">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Not Sistemi Seçin</h3>
        <p className="text-gray-600">Üniversitenizin kullandığı not sistemini seçerek devam edin</p>
      </div>

      <div className="mb-6 w-full max-w-md mx-auto">
        <label className="block text-sm font-medium text-gray-700 mb-2">Not Sistemi</label>
        <select
          value={selectedSystem}
          onChange={(e) => onSystemChange(e.target.value as GradingSystem)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-700"
        >
          {systems.map((system) => (
            <option key={system.id} value={system.id}>
              {system.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default GradingSystemSelector
