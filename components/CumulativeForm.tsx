"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { BookText } from "lucide-react"
import CourseForm from "./CourseForm"
import type { CalculationResult, GradingSystem } from "@/types"
import { calculateCumulativeGPA } from "@/utils/calculations"

interface CumulativeFormProps {
  onCalculate: (result: CalculationResult) => void
  onCancel: () => void
  onBack: () => void
  gradingSystem: GradingSystem
  selectedCalculation?: CalculationResult | null
}

const CumulativeForm: React.FC<CumulativeFormProps> = ({
  onCalculate,
  onCancel,
  onBack,
  gradingSystem,
  selectedCalculation,
}) => {
  const [showCourseForm, setShowCourseForm] = useState(false)
  const [prevGpa, setPrevGpa] = useState<number>(0)
  const [prevCredits, setPrevCredits] = useState<number>(0)

  const handlePrevGpaChange = (value: string) => {
    const gpa = Number.parseFloat(value)
    if (!isNaN(gpa) && gpa >= 0 && gpa <= 4) {
      setPrevGpa(gpa)
    }
  }

  const handlePrevCreditsChange = (value: string) => {
    const credits = Number.parseFloat(value)
    if (!isNaN(credits) && credits >= 0) {
      setPrevCredits(credits)
    }
  }

  const handleCourseFormSubmit = (semesterResult: CalculationResult) => {
    const result = calculateCumulativeGPA({
      prevGpa,
      prevCredits,
      newGpa: semesterResult.gpa,
      newCredits: semesterResult.totalCredits,
    })

    onCalculate({
      ...result,
      courses: semesterResult.courses,
      prevGpa,
      prevCredits,
      isCumulative: true,
    })
  }

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault()

    if (prevGpa < 0 || prevGpa > 4) {
      alert("Geçerli bir ortalama giriniz (0-4 arası)")
      return
    }

    if (prevCredits <= 0) {
      alert("Geçerli bir kredi sayısı giriniz")
      return
    }

    setShowCourseForm(true)
  }

  useEffect(() => {
    if (selectedCalculation && selectedCalculation.isCumulative) {
      setPrevGpa(selectedCalculation.prevGpa || 0)
      setPrevCredits(selectedCalculation.prevCredits || 0)
      if (selectedCalculation.courses) {
        setShowCourseForm(true)
      }
    }
  }, [selectedCalculation])

  if (showCourseForm) {
    return (
      <CourseForm
        onCalculate={handleCourseFormSubmit}
        onCancel={() => setShowCourseForm(false)}
        onBack={() => setShowCourseForm(false)}
        gradingSystem={gradingSystem}
        selectedCalculation={selectedCalculation}
      />
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 animate-fadeIn max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <BookText className="w-6 h-6 mr-2 text-blue-700" />
          Genel Ortalama Hesaplama
        </h2>
      </div>

      <form onSubmit={handleProceed}>
        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Mevcut Genel Not Ortalamanız (GPA)</label>
            <input
              type="number"
              min="0"
              max="4"
              step="0.01"
              value={prevGpa || ""}
              onChange={(e) => handlePrevGpaChange(e.target.value)}
              placeholder="Örn: 3.25"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
            <p className="text-sm text-gray-500 mt-1">0.00 - 4.00 arasında bir değer giriniz</p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Toplam Tamamladığınız Kredi</label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={prevCredits || ""}
              onChange={(e) => handlePrevCreditsChange(e.target.value)}
              placeholder="Örn: 60"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
            <p className="text-sm text-gray-500 mt-1">Şimdiye kadar tamamladığınız toplam kredi miktarını giriniz</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ← Geri
          </button>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors"
            >
              Devam Et
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CumulativeForm
