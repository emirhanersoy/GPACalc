"use client"

import { useState } from "react"
import { BookOpen } from "lucide-react"
import Header from "@/components/Header"
import CalculationTypeSelector from "@/components/CalculationTypeSelector"
import CourseForm from "@/components/CourseForm"
import CumulativeForm from "@/components/CumulativeForm"
import ResultsDisplay from "@/components/ResultsDisplay"
import HistoryView from "@/components/HistoryView"
import TargetGPACalculator from "@/components/TargetGPACalculator"
import GradingSystemSelector from "@/components/GradingSystemSelector"
import type { CalculationMode, CalculationResult, GradingSystem } from "@/types"
import { saveCalculation } from "@/utils/storage"

export default function App() {
  const [calculationMode, setCalculationMode] = useState<CalculationMode | null>(null)
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [currentView, setCurrentView] = useState<"calculator" | "history" | "target">("calculator")
  const [gradingSystem, setGradingSystem] = useState<GradingSystem>("turkish")
  const [selectedCalculation, setSelectedCalculation] = useState<CalculationResult | null>(null)

  const resetCalculation = () => {
    setCalculationMode(null)
    setResult(null)
    setCurrentView("calculator")
    setSelectedCalculation(null)
  }

  const handleCalculationComplete = (calculationResult: CalculationResult) => {
    setResult(calculationResult)
    // Save to history
    saveCalculation({
      ...calculationResult,
      timestamp: Date.now(),
      gradingSystem,
    })
  }

  const handleSelectFromHistory = (calculation: CalculationResult) => {
    setResult(null)
    setCurrentView("calculator")

    if (calculation.isCumulative) {
      setCalculationMode("cumulative")
    } else {
      setCalculationMode("semester")
    }

    // Set the calculation data to be used in forms
    setSelectedCalculation(calculation)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 font-sans">
      <Header currentView={currentView} onViewChange={setCurrentView} onReset={resetCalculation} />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {currentView === "history" && <HistoryView onSelectCalculation={handleSelectFromHistory} />}

        {currentView === "target" && <TargetGPACalculator gradingSystem={gradingSystem} />}

        {currentView === "calculator" && (
          <>
            {!calculationMode && !result && (
              <div className="flex flex-col items-center justify-center py-8">
                <BookOpen className="w-16 h-16 text-blue-800 mb-4" />
                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
                  Üniversite Not Ortalaması Hesaplama
                </h2>

                <GradingSystemSelector selectedSystem={gradingSystem} onSystemChange={setGradingSystem} />

                <CalculationTypeSelector onSelectMode={setCalculationMode} />
              </div>
            )}

            {calculationMode === "semester" && !result && (
              <CourseForm
                onCalculate={handleCalculationComplete}
                onCancel={resetCalculation}
                onBack={() => setCalculationMode(null)}
                gradingSystem={gradingSystem}
                selectedCalculation={selectedCalculation}
              />
            )}

            {calculationMode === "cumulative" && !result && (
              <CumulativeForm
                onCalculate={handleCalculationComplete}
                onCancel={resetCalculation}
                onBack={() => setCalculationMode(null)}
                gradingSystem={gradingSystem}
                selectedCalculation={selectedCalculation}
              />
            )}

            {result && (
              <ResultsDisplay
                result={result}
                onReset={resetCalculation}
                onBack={() => setResult(null)}
                gradingSystem={gradingSystem}
              />
            )}
          </>
        )}
      </main>

      <footer className="py-6 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} GPACalc - github.com/emirhanersoy
      </footer>
    </div>
  )
}
