"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { History, Trash2, Calendar, BookOpen, X } from "lucide-react"
import type { CalculationResult } from "@/types"
import { getCalculationHistory, clearCalculationHistory, removeCalculation } from "@/utils/storage"

interface HistoryViewProps {
  onSelectCalculation: (result: CalculationResult) => void
}

const HistoryView: React.FC<HistoryViewProps> = ({ onSelectCalculation }) => {
  const [history, setHistory] = useState<(CalculationResult & { timestamp: number })[]>([])

  useEffect(() => {
    setHistory(getCalculationHistory())
  }, [])

  const handleClearHistory = () => {
    if (confirm("Tüm geçmiş hesaplamaları silmek istediğinizden emin misiniz?")) {
      clearCalculationHistory()
      setHistory([])
    }
  }

  const handleRemoveCalculation = (index: number, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the card click
    if (confirm("Bu hesaplamayı silmek istediğinizden emin misiniz?")) {
      removeCalculation(index)
      setHistory(getCalculationHistory())
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getLetterGrade = (gpa: number) => {
    if (gpa >= 3.75) return "AA"
    if (gpa >= 3.25) return "BA"
    if (gpa >= 2.75) return "BB"
    if (gpa >= 2.25) return "CB"
    if (gpa >= 1.75) return "CC"
    if (gpa >= 1.25) return "DC"
    if (gpa >= 0.75) return "DD"
    if (gpa >= 0.25) return "FD"
    return "FF"
  }

  const getGradeColor = (gpa: number) => {
    if (gpa >= 3.5) return "text-green-600 bg-green-100"
    if (gpa >= 2.5) return "text-blue-600 bg-blue-100"
    if (gpa >= 1.0) return "text-yellow-600 bg-yellow-100"
    return "text-red-600 bg-red-100"
  }

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Henüz Hesaplama Yok</h2>
        <p className="text-gray-600">İlk hesaplamanızı yaptığınızda burada görünecek.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <History className="w-6 h-6 mr-2 text-blue-700" />
          Hesaplama Geçmişi
        </h2>
        <button
          onClick={handleClearHistory}
          className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Tümünü Temizle
        </button>
      </div>

      <div className="space-y-4">
        {history.map((calculation, index) => (
          <div
            key={index}
            className="relative border rounded-lg p-4 hover:bg-blue-50 transition-colors cursor-pointer border-l-4 border-l-blue-500 group"
            onClick={() => onSelectCalculation(calculation)}
          >
            {/* Individual delete button */}
            <button
              onClick={(e) => handleRemoveCalculation(index, e)}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
              title="Bu hesaplamayı sil"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between mb-2 pr-8">
              <div className="flex items-center">
                <BookOpen className="w-5 h-5 text-gray-500 mr-2" />
                <span className="font-medium text-gray-800">
                  {calculation.isCumulative ? "Genel Ortalama" : "Dönem Ortalaması"}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(calculation.timestamp)}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(calculation.gpa)}`}>
                  {calculation.gpa.toFixed(2)} ({getLetterGrade(calculation.gpa)})
                </div>
                <span className="text-sm text-gray-600">{calculation.totalCredits} Kredi</span>
              </div>

              <div className="flex items-center space-x-2">
                {calculation.courses && (
                  <span className="text-sm text-gray-500">{calculation.courses.length} Ders</span>
                )}
                <span className="text-xs text-blue-600 font-medium">Düzenlemek için tıklayın</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HistoryView
