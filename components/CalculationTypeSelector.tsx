"use client"

import type React from "react"
import { Calculator, BookText } from "lucide-react"
import type { CalculationMode } from "@/types"

interface CalculationTypeSelectorProps {
  onSelectMode: (mode: CalculationMode) => void
}

const CalculationTypeSelector: React.FC<CalculationTypeSelectorProps> = ({ onSelectMode }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
      <button
        onClick={() => onSelectMode("semester")}
        className="flex flex-col items-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-blue-500"
      >
        <Calculator className="w-12 h-12 text-blue-600 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Dönem Ortalaması</h3>
        <p className="text-center text-gray-600">Sadece bu dönem aldığınız derslerin ortalamasını hesaplayın</p>
      </button>

      <button
        onClick={() => onSelectMode("cumulative")}
        className="flex flex-col items-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-blue-500"
      >
        <BookText className="w-12 h-12 text-blue-600 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Genel Ortalama</h3>
        <p className="text-center text-gray-600">
          Önceki not ortalamanızı da dahil ederek genel ortalamanızı hesaplayın
        </p>
      </button>
    </div>
  )
}

export default CalculationTypeSelector
