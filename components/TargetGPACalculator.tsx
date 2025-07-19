"use client"

import type React from "react"
import { useState } from "react"
import { Target, Calculator } from "lucide-react"
import type { GradingSystem } from "@/types"

interface TargetGPACalculatorProps {
  gradingSystem: GradingSystem
  onBack?: () => void
}

const TargetGPACalculator: React.FC<TargetGPACalculatorProps> = ({ gradingSystem, onBack }) => {
  const [currentGPA, setCurrentGPA] = useState<number>(0)
  const [currentCredits, setCurrentCredits] = useState<number>(0)
  const [targetGPA, setTargetGPA] = useState<number>(0)
  const [newCredits, setNewCredits] = useState<number>(0)
  const [result, setResult] = useState<{ requiredGPA: number; isAchievable: boolean } | null>(null)

  const calculateRequiredGPA = () => {
    if (currentCredits <= 0 || newCredits <= 0 || targetGPA <= 0) {
      alert("Lütfen tüm alanları doğru şekilde doldurun.")
      return
    }

    const totalCredits = currentCredits + newCredits
    const requiredTotalPoints = targetGPA * totalCredits
    const currentTotalPoints = currentGPA * currentCredits
    const requiredNewPoints = requiredTotalPoints - currentTotalPoints
    const requiredGPA = requiredNewPoints / newCredits

    setResult({
      requiredGPA,
      isAchievable: requiredGPA <= 4.0 && requiredGPA >= 0,
    })
  }

  const getRequiredGradeDescription = (requiredGPA: number) => {
    if (requiredGPA >= 3.75) return "AA (Mükemmel)"
    if (requiredGPA >= 3.25) return "BA (Çok İyi)"
    if (requiredGPA >= 2.75) return "BB (İyi)"
    if (requiredGPA >= 2.25) return "CB (Orta)"
    if (requiredGPA >= 1.75) return "CC (Geçer)"
    if (requiredGPA >= 1.25) return "DC (Şartlı Geçer)"
    if (requiredGPA >= 0.75) return "DD (Zayıf)"
    return "Çok Düşük"
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      {onBack && (
        <button
          onClick={onBack}
          className="mb-4 flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
        >
          ← Geri
        </button>
      )}
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Target className="w-6 h-6 mr-2 text-blue-700" />
          Hedef GPA Hesaplayıcı
        </h2>
      </div>

      <div className="space-y-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Mevcut GPA'nız</label>
            <input
              type="number"
              min="0"
              max="4"
              step="0.01"
              value={currentGPA || ""}
              onChange={(e) => setCurrentGPA(Number.parseFloat(e.target.value) || 0)}
              placeholder="Örn: 2.75"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Mevcut Toplam Krediniz</label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={currentCredits || ""}
              onChange={(e) => setCurrentCredits(Number.parseFloat(e.target.value) || 0)}
              placeholder="Örn: 60"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Hedef GPA</label>
            <input
              type="number"
              min="0"
              max="4"
              step="0.01"
              value={targetGPA || ""}
              onChange={(e) => setTargetGPA(Number.parseFloat(e.target.value) || 0)}
              placeholder="Örn: 3.00"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Alacağınız Yeni Kredi</label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={newCredits || ""}
              onChange={(e) => setNewCredits(Number.parseFloat(e.target.value) || 0)}
              placeholder="Örn: 30"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <button
          onClick={calculateRequiredGPA}
          className="w-full flex items-center justify-center px-6 py-3 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors font-medium"
        >
          <Calculator className="w-5 h-5 mr-2" />
          Gerekli GPA'yı Hesapla
        </button>
      </div>

      {result && (
        <div
          className={`p-6 rounded-lg ${result.isAchievable ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${result.isAchievable ? "text-green-800" : "text-red-800"}`}>
            Hesaplama Sonucu
          </h3>

          {result.isAchievable ? (
            <div className="space-y-3">
              <p className="text-green-700">
                <strong>Hedef GPA'nıza ulaşmak için:</strong>
              </p>
              <div className="bg-white p-4 rounded-md">
                <p className="text-2xl font-bold text-green-600 mb-2">{result.requiredGPA.toFixed(2)} GPA</p>
                <p className="text-green-700">
                  Yeni dönemde ortalama <strong>{getRequiredGradeDescription(result.requiredGPA)}</strong> seviyesinde
                  notlar almanız gerekiyor.
                </p>
              </div>
              <p className="text-sm text-green-600">✅ Bu hedef ulaşılabilir görünüyor!</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-red-700">
                <strong>Maalesef bu hedef şu anki koşullarda ulaşılamaz.</strong>
              </p>
              <div className="bg-white p-4 rounded-md">
                <p className="text-red-600">
                  Hedef GPA'ya ulaşmak için <strong>{result.requiredGPA.toFixed(2)} GPA</strong> gerekiyor, ancak
                  maksimum GPA 4.00'dır.
                </p>
              </div>
              <div className="text-sm text-red-600">
                <p>
                  💡 <strong>Öneriler:</strong>
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Daha fazla kredi alarak hedef GPA'yı düşürün</li>
                  <li>Hedef GPA'yı daha gerçekçi bir seviyeye ayarlayın</li>
                  <li>Daha uzun vadeli bir plan yapın</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">💡 İpuçları</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Gerçekçi hedefler belirleyin</li>
          <li>• Zor dersleri kolay derslerle dengelemeyi düşünün</li>
          <li>• Uzun vadeli planlar yapın</li>
          <li>• Akademik danışmanınızla görüşün</li>
        </ul>
      </div>
    </div>
  )
}

export default TargetGPACalculator
