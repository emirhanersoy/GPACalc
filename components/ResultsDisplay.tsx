"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { CheckCircle, RefreshCw, Share2, Download } from "lucide-react"
import type { CalculationResult, Course, GradingSystem } from "@/types"
import { calculateGPA, convertGpaTo100Scale, calculateCumulativeGPA } from "@/utils/calculations"
import { getGradesForSystem, CREDITS } from "@/utils/grading-systems"

interface ResultsDisplayProps {
  result: CalculationResult
  onReset: () => void
  onBack: () => void
  gradingSystem: GradingSystem
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onReset, onBack, gradingSystem }) => {
  const [animate, setAnimate] = useState(false)
  const [editableCourses, setEditableCourses] = useState<Course[]>([])
  const [currentGpa, setCurrentGpa] = useState<number>(0)
  const [editedCourseIndices, setEditedCourseIndices] = useState<Set<number>>(new Set())
  const [editedCreditIndices, setEditedCreditIndices] = useState<Set<number>>(new Set())
  const originalCoursesRef = useRef<Course[]>([])

  const grades = getGradesForSystem(gradingSystem)

  useEffect(() => {
    setAnimate(true)
    if (result?.courses) {
      setEditableCourses(result.courses)
      setCurrentGpa(result.gpa)
      originalCoursesRef.current = result.courses
      setEditedCourseIndices(new Set())
      setEditedCreditIndices(new Set())
    }
  }, [result])

  const updateCalculation = (updatedCourses: Course[]) => {
    let recalculatedGpa = 0
    if (result.isCumulative && result.prevGpa !== undefined && result.prevCredits !== undefined) {
      const currentSemesterResult = calculateGPA(updatedCourses, gradingSystem)
      const cumulativeResult = calculateCumulativeGPA({
        prevGpa: result.prevGpa,
        prevCredits: result.prevCredits,
        newGpa: currentSemesterResult.gpa,
        newCredits: currentSemesterResult.totalCredits,
      })
      recalculatedGpa = cumulativeResult.gpa
    } else {
      const currentSemesterResult = calculateGPA(updatedCourses, gradingSystem)
      recalculatedGpa = currentSemesterResult.gpa
    }
    setCurrentGpa(recalculatedGpa)
  }

  const handleGradeChange = (index: number, newGradeValue: string) => {
    const updatedCourses = editableCourses.map((course: Course, i: number) =>
      i === index ? { ...course, grade: newGradeValue } : course,
    )
    setEditableCourses(updatedCourses)
    updateCalculation(updatedCourses)

    const originalGrade = originalCoursesRef.current?.[index]?.grade
    const newEditedCourseIndices = new Set(editedCourseIndices)
    if (newGradeValue !== originalGrade) {
      newEditedCourseIndices.add(index)
    } else {
      newEditedCourseIndices.delete(index)
    }
    setEditedCourseIndices(newEditedCourseIndices)
  }

  const handleCreditChange = (index: number, newCreditValue: string) => {
    const newCredit = Number.parseFloat(newCreditValue)
    const updatedCourses = editableCourses.map((course: Course, i: number) =>
      i === index ? { ...course, credit: newCredit } : course,
    )
    setEditableCourses(updatedCourses)
    updateCalculation(updatedCourses)

    const originalCredit = originalCoursesRef.current?.[index]?.credit
    const newEditedCreditIndices = new Set(editedCreditIndices)
    if (newCredit !== originalCredit) {
      newEditedCreditIndices.add(index)
    } else {
      newEditedCreditIndices.delete(index)
    }
    setEditedCreditIndices(newEditedCreditIndices)
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
    if (gpa >= 3.5) return "text-green-600"
    if (gpa >= 2.5) return "text-blue-600"
    if (gpa >= 1.0) return "text-yellow-600"
    return "text-red-600"
  }

  const getGradeDescription = (gpa: number) => {
    if (gpa >= 3.5) return "Mükemmel"
    if (gpa >= 2.5) return "İyi"
    if (gpa >= 1.0) return "Geçer"
    return "Başarısız"
  }

  const shareResults = async () => {
    const text = `GPA Hesaplama Sonucu: ${currentGpa.toFixed(2)} (${getLetterGrade(currentGpa)})`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "GPA Hesaplama Sonucu",
          text: text,
        })
      } catch (err) {
        console.log("Paylaşım iptal edildi")
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(text)
      alert("Sonuç panoya kopyalandı!")
    }
  }

  const exportResults = () => {
    const data = {
      gpa: currentGpa,
      letterGrade: getLetterGrade(currentGpa),
      totalCredits: editableCourses.reduce((sum, course) => sum + course.credit, 0),
      courses: editableCourses,
      timestamp: new Date().toISOString(),
      gradingSystem,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `gpa-calculation-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const letterGrade = getLetterGrade(currentGpa)
  const gradeColor = getGradeColor(currentGpa)
  const gradeDescription = getGradeDescription(currentGpa)
  const gpa100Scale = convertGpaTo100Scale(currentGpa)

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
          {result.isCumulative ? "Genel" : "Dönem"} Not Ortalaması Sonuçları
        </h2>
      </div>

      <div className="flex flex-col items-center justify-center py-6 mb-8">
        <div
          className={`text-7xl font-bold ${gradeColor} transition-all duration-1000 ${animate ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
        >
          {currentGpa.toFixed(2)}
        </div>
        <div
          className={`text-2xl font-semibold ${gradeColor} mt-2 transition-all duration-1000 delay-300 ${animate ? "opacity-100" : "opacity-0"}`}
        >
          {letterGrade}
        </div>
        <div
          className={`text-gray-600 mt-1 transition-all duration-1000 delay-500 ${animate ? "opacity-100" : "opacity-0"}`}
        >
          {gradeDescription}
        </div>
      </div>

      <div
        className={`mt-8 p-4 bg-blue-50 rounded-lg transition-all duration-1000 delay-700 ${animate ? "opacity-100" : "opacity-0"}`}
      >
        <h3 className="font-semibold text-blue-800 mb-3">Diğer Not Sistemleri</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
          <div>
            <p className="font-medium">100'lük Sistem:</p>
            <p>{gpa100Scale.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-medium">Toplam Kredi:</p>
            <p>{editableCourses.reduce((sum, course) => sum + course.credit, 0)}</p>
          </div>
          {result.isCumulative && editableCourses && (
            <div>
              <p className="font-medium">Dönem Ortalaması:</p>
              <p>{calculateGPA(editableCourses, gradingSystem).gpa.toFixed(2)}</p>
            </div>
          )}
        </div>
      </div>

      {result.isCumulative && (
        <div
          className={`bg-blue-50 rounded-lg p-4 mb-6 transition-all duration-1000 delay-700 ${animate ? "opacity-100" : "opacity-0"}`}
        >
          <h3 className="font-semibold text-blue-800 mb-2">Kümülatif Hesaplama Detayları</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Önceki Ortalama:</p>
              <p className="font-medium">{result.prevGpa?.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Önceki Krediler:</p>
              <p className="font-medium">{result.prevCredits}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Yeni Dersler Ortalaması:</p>
              <p className="font-medium">{calculateGPA(editableCourses, gradingSystem).gpa.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Yeni Dersler Kredisi:</p>
              <p className="font-medium">{editableCourses.reduce((sum, course) => sum + course.credit, 0)}</p>
            </div>
          </div>
        </div>
      )}

      {editableCourses && editableCourses.length > 0 && (
        <div className={`transition-all duration-1000 delay-900 ${animate ? "opacity-100" : "opacity-0"}`}>
          <h3 className="font-semibold text-gray-800 mb-3">Ders Detayları</h3>
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ders Adı
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kredi
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Not
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {editableCourses.map((course: Course, index: number) => (
                  <tr
                    key={course.id}
                    className={`hover:bg-blue-50 transition-colors ${
                      editedCourseIndices.has(index) || editedCreditIndices.has(index)
                        ? "bg-yellow-50 border-l-4 border-l-yellow-400"
                        : ""
                    }`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                      {course.name || `Ders ${index + 1}`}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 text-center">
                      <select
                        value={course.credit}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          handleCreditChange(index, e.target.value)
                        }
                        className="block w-full pl-3 pr-8 py-1 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white"
                      >
                        {CREDITS.map((creditOption) => (
                          <option key={creditOption} value={creditOption}>
                            {creditOption}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                      {gradingSystem === "numerical" ? (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={course.grade}
                          onChange={(e) => handleGradeChange(index, e.target.value)}
                          className="w-20 px-2 py-1 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <select
                          value={course.grade}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            handleGradeChange(index, e.target.value)
                          }
                          className="block w-full pl-3 pr-8 py-1 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white"
                        >
                          {grades.map((gradeOption) => (
                            <option key={gradeOption.value} value={gradeOption.value}>
                              {gradeOption.value}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total row */}
          <div className="bg-gray-50 rounded-lg overflow-hidden mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">Toplam</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800 text-center">
                    {editableCourses.reduce((sum: number, course: Course) => sum + course.credit, 0)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800 text-center">
                    {currentGpa.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-4 mt-8">
        <button
          onClick={onBack}
          className="flex items-center px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium"
        >
          ← Geri
        </button>

        <button
          onClick={onReset}
          className="flex items-center px-6 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors font-medium"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Yeni Hesaplama
        </button>

        <button
          onClick={shareResults}
          className="flex items-center px-6 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors font-medium"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Paylaş
        </button>

        <button
          onClick={exportResults}
          className="flex items-center px-6 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors font-medium"
        >
          <Download className="w-4 h-4 mr-2" />
          Dışa Aktar
        </button>
      </div>
    </div>
  )
}

export default ResultsDisplay
