"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { PlusCircle, MinusCircle, BookOpen } from "lucide-react"
import CourseInput from "./CourseInput"
import type { Course, CalculationResult, GradingSystem } from "@/types"
import { calculateGPA } from "@/utils/calculations"

interface CourseFormProps {
  onCalculate: (result: CalculationResult) => void
  onCancel: () => void
  onBack: () => void
  gradingSystem: GradingSystem
  selectedCalculation?: CalculationResult | null
}

const CourseForm: React.FC<CourseFormProps> = ({
  onCalculate,
  onCancel,
  onBack,
  gradingSystem,
  selectedCalculation,
}) => {
  const [courseCount, setCourseCount] = useState<number>(5)
  const [courses, setCourses] = useState<Course[]>(
    Array.from({ length: 5 }, (_, index) => ({
      id: `course-${index}`,
      name: "",
      credit: 6,
      grade:
        gradingSystem === "turkish"
          ? "AA"
          : gradingSystem === "extended"
            ? "AA"
            : gradingSystem === "american"
              ? "A"
              : "A1",
    })),
  )

  useEffect(() => {
    if (selectedCalculation && selectedCalculation.courses) {
      setCourses(selectedCalculation.courses)
      setCourseCount(selectedCalculation.courses.length)
    }
  }, [selectedCalculation])

  const handleCourseChange = (index: number, updatedCourse: Course) => {
    const newCourses = [...courses]
    newCourses[index] = updatedCourse
    setCourses(newCourses)
  }

  const handleCourseCountChange = (count: number) => {
    if (count < 1) count = 1
    if (count > 90) count = 90

    setCourseCount(count)

    if (count > courses.length) {
      const additionalCourses = Array.from({ length: count - courses.length }, (_, index) => ({
        id: `course-${courses.length + index}`,
        name: "",
        credit: 6,
        grade:
          gradingSystem === "turkish"
            ? "AA"
            : gradingSystem === "extended"
              ? "AA"
              : gradingSystem === "american"
                ? "A"
                : "A1",
      }))
      setCourses([...courses, ...additionalCourses])
    } else {
      setCourses(courses.slice(0, count))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = calculateGPA(courses, gradingSystem)
    onCalculate({
      ...result,
      courses,
      isCumulative: false,
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <BookOpen className="w-6 h-6 mr-2 text-blue-700" />
          Dönem Ortalaması Hesaplama
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">Ders Sayısı</label>
          <div className="flex items-center">
            <button
              type="button"
              className="p-2 rounded-l-md bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
              onClick={() => handleCourseCountChange(courseCount - 1)}
            >
              <MinusCircle className="w-5 h-5" />
            </button>
            <input
              type="number"
              min="1"
              max="90"
              value={courseCount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleCourseCountChange(Number.parseInt(e.target.value) || 1)
              }
              className="p-2 w-16 text-center border-y outline-none text-gray-700"
            />
            <button
              type="button"
              className="p-2 rounded-r-md bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
              onClick={() => handleCourseCountChange(courseCount + 1)}
            >
              <PlusCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-12 gap-2 font-medium text-sm text-gray-600 px-2">
            <div className="col-span-5 md:col-span-6">Ders Adı (Opsiyonel)</div>
            <div className="col-span-3">Kredi</div>
            <div className="col-span-4 md:col-span-3">Not</div>
          </div>

          {courses.map((course: Course, index: number) => (
            <CourseInput
              key={course.id}
              course={course}
              onChange={(updatedCourse: Course) => handleCourseChange(index, updatedCourse)}
              gradingSystem={gradingSystem}
            />
          ))}
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
              Hesapla
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CourseForm
