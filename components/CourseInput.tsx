"use client"

import type React from "react"
import type { Course, GradingSystem } from "@/types"
import { getGradesForSystem, CREDITS } from "@/utils/grading-systems"

interface CourseInputProps {
  course: Course
  onChange: (course: Course) => void
  gradingSystem: GradingSystem
}

const CourseInput: React.FC<CourseInputProps> = ({ course, onChange, gradingSystem }) => {
  const grades = getGradesForSystem(gradingSystem)

  const handleChange = (field: keyof Course, value: any) => {
    onChange({
      ...course,
      [field]: value,
    })
  }

  return (
    <div className="grid grid-cols-12 gap-2 items-center bg-gray-50 p-3 rounded-lg transition-all hover:bg-blue-50">
      <div className="col-span-5 md:col-span-6">
        <input
          type="text"
          value={course.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Ders adı (opsiyonel)"
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>

      <div className="col-span-3">
        <select
          value={course.credit}
          onChange={(e) => handleChange("credit", Number.parseFloat(e.target.value))}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
        >
          {CREDITS.map((credit) => (
            <option key={credit} value={credit}>
              {credit}
            </option>
          ))}
        </select>
      </div>

      <div className="col-span-4 md:col-span-3">
        <select
          value={course.grade}
          onChange={(e) => handleChange("grade", e.target.value)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
        >
          {grades.map((grade) => (
            <option key={grade.value} value={grade.value}>
              {grade.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default CourseInput
