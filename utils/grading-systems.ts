import type { GradingSystem } from "@/types"

export interface GradeOption {
  value: string
  label: string
  point: number
}

export const CREDITS = [
  0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5,
  14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5, 24, 24.5, 25,
  25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5, 30,
]

export const TURKISH_GRADES: GradeOption[] = [
  { value: "AA", label: "AA", point: 4.0 },
  { value: "BA", label: "BA", point: 3.5 },
  { value: "BB", label: "BB", point: 3.0 },
  { value: "CB", label: "CB", point: 2.5 },
  { value: "CC", label: "CC", point: 2.0 },
  { value: "DC", label: "DC", point: 1.5 },
  { value: "DD", label: "DD", point: 1.0 },
  { value: "FD", label: "FD", point: 0.5 },
  { value: "FF", label: "FF", point: 0.0 },
]

export const EXTENDED_GRADES: GradeOption[] = [
  { value: "AA", label: "AA", point: 4.0 },
  { value: "AB", label: "AB", point: 3.75 },
  { value: "BA", label: "BA", point: 3.5 },
  { value: "BB", label: "BB", point: 3.0 },
  { value: "BC", label: "BC", point: 2.75 },
  { value: "CB", label: "CB", point: 2.5 },
  { value: "CC", label: "CC", point: 2.0 },
  { value: "CD", label: "CD", point: 1.75 },
  { value: "DC", label: "DC", point: 1.5 },
  { value: "DD", label: "DD", point: 1.0 },
  { value: "FF", label: "FF", point: 0.0 },
]

export const AMERICAN_GRADES: GradeOption[] = [
  { value: "A", label: "A", point: 4.0 },
  { value: "A-", label: "A-", point: 3.7 },
  { value: "B+", label: "B+", point: 3.3 },
  { value: "B", label: "B", point: 3.0 },
  { value: "B-", label: "B-", point: 2.7 },
  { value: "C+", label: "C+", point: 2.3 },
  { value: "C", label: "C", point: 2.0 },
  { value: "C-", label: "C-", point: 1.7 },
  { value: "D+", label: "D+", point: 1.3 },
  { value: "D", label: "D", point: 1.0 },
  { value: "D-", label: "D-", point: 0.7 },
  { value: "F", label: "F", point: 0.0 },
]

export const NUMERIC_GRADES: GradeOption[] = [
  { value: "A1", label: "A1", point: 4.0 },
  { value: "A2", label: "A2", point: 3.7 },
  { value: "A3", label: "A3", point: 3.3 },
  { value: "B1", label: "B1", point: 3.0 },
  { value: "B2", label: "B2", point: 2.7 },
  { value: "B3", label: "B3", point: 2.3 },
  { value: "C1", label: "C1", point: 2.0 },
  { value: "C2", label: "C2", point: 1.7 },
  { value: "C3", label: "C3", point: 1.3 },
  { value: "D", label: "D", point: 1.0 },
  { value: "F", label: "F", point: 0.0 },
]

export const getGradesForSystem = (system: GradingSystem): GradeOption[] => {
  switch (system) {
    case "turkish":
      return TURKISH_GRADES
    case "extended":
      return EXTENDED_GRADES
    case "american":
      return AMERICAN_GRADES
    case "numeric":
      return NUMERIC_GRADES
    default:
      return TURKISH_GRADES
  }
}

export const getGradePoint = (grade: string, system: GradingSystem): number => {
  const grades = getGradesForSystem(system)
  const gradeOption = grades.find((g) => g.value === grade)
  return gradeOption?.point || 0
}
