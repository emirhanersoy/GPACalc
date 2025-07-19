import type { CalculationResult } from "@/types"

const STORAGE_KEY = "gpa-calculator-history"

export const saveCalculation = (calculation: CalculationResult & { timestamp: number }) => {
  try {
    const history = getCalculationHistory()
    const newHistory = [calculation, ...history].slice(0, 50) // Keep only last 50 calculations
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory))
  } catch (error) {
    console.error("Error saving calculation:", error)
  }
}

export const getCalculationHistory = (): (CalculationResult & { timestamp: number })[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error loading calculation history:", error)
    return []
  }
}

export const clearCalculationHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error("Error clearing calculation history:", error)
  }
}

export const removeCalculation = (index: number) => {
  try {
    const history = getCalculationHistory()
    const newHistory = history.filter((_, i) => i !== index)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory))
  } catch (error) {
    console.error("Error removing calculation:", error)
  }
}

export const exportCalculations = () => {
  const history = getCalculationHistory()
  const dataStr = JSON.stringify(history, null, 2)
  const dataBlob = new Blob([dataStr], { type: "application/json" })

  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement("a")
  link.href = url
  link.download = `gpa-calculations-${new Date().toISOString().split("T")[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const importCalculations = (file: File): Promise<(CalculationResult & { timestamp: number })[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        resolve(data)
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = () => reject(new Error("File reading failed"))
    reader.readAsText(file)
  })
}
