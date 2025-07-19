"use client"

import type React from "react"
import { GraduationCap, Calculator, History, Target } from "lucide-react"

interface HeaderProps {
  currentView: "calculator" | "history" | "target"
  onViewChange: (view: "calculator" | "history" | "target") => void
  onReset: () => void
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange, onReset }) => {
  return (
    <header className="bg-blue-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 mr-2" />
            <h1 className="text-xl font-bold">GPACalc</h1>
          </div>

          <nav className="flex space-x-2">
            <button
              onClick={() => {
                onReset()
                onViewChange("calculator")
              }}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === "calculator" ? "bg-blue-700 text-white" : "text-blue-100 hover:bg-blue-700"
              }`}
            >
              <Calculator className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Hesapla</span>
            </button>

            <button
              onClick={() => onViewChange("history")}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === "history" ? "bg-blue-700 text-white" : "text-blue-100 hover:bg-blue-700"
              }`}
            >
              <History className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Geçmiş</span>
            </button>

            <button
              onClick={() => onViewChange("target")}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === "target" ? "bg-blue-700 text-white" : "text-blue-100 hover:bg-blue-700"
              }`}
            >
              <Target className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Hedef</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
