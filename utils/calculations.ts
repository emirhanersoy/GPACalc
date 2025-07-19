import type { Course, GradingSystem } from "@/types"
import { getGradePoint } from "./grading-systems"

export const calculateGPA = (courses: Course[], gradingSystem: GradingSystem) => {
  const totalPoints = courses.reduce((sum, course) => {
    const gradePoint = getGradePoint(course.grade, gradingSystem)
    return sum + gradePoint * course.credit
  }, 0)

  const totalCredits = courses.reduce((sum, course) => sum + course.credit, 0)

  return {
    gpa: totalCredits > 0 ? totalPoints / totalCredits : 0,
    totalCredits,
  }
}

export const calculateCumulativeGPA = ({
  prevGpa,
  prevCredits,
  newGpa,
  newCredits,
}: {
  prevGpa: number
  prevCredits: number
  newGpa: number
  newCredits: number
}) => {
  const totalCredits = prevCredits + newCredits
  const totalPoints = prevGpa * prevCredits + newGpa * newCredits

  const cumulativeGpa = totalCredits > 0 ? totalPoints / totalCredits : 0

  return {
    gpa: cumulativeGpa,
    totalCredits,
  }
}

export const convertGpaTo100Scale = (gpa: number) => {
  return gpa * 25
}
