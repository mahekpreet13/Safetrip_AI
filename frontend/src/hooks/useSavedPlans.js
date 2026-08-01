import { useState, useEffect } from 'react'

const STORAGE_KEY = 'safetrip_saved_plans'

export function useSavedPlans() {
  const [savedPlans, setSavedPlans] = useState([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setSavedPlans(JSON.parse(stored))
      }
    } catch {
      setSavedPlans([])
    }
  }, [])

  const persist = (plans) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plans))
    } catch {
      // storage unavailable — plan still works for this session
    }
  }

  const savePlan = (plan) => {
    setSavedPlans((prev) => {
      // avoid duplicate entries for the same city — replace instead of stacking
      const filtered = prev.filter((p) => p.city.toLowerCase() !== plan.city.toLowerCase())
      const updated = [{ ...plan, savedAt: new Date().toISOString() }, ...filtered]
      persist(updated)
      return updated
    })
  }

  const removePlan = (city) => {
    setSavedPlans((prev) => {
      const updated = prev.filter((p) => p.city.toLowerCase() !== city.toLowerCase())
      persist(updated)
      return updated
    })
  }

  const isPlanSaved = (city) => {
    if (!city) return false
    return savedPlans.some((p) => p.city.toLowerCase() === city.toLowerCase())
  }

  return { savedPlans, savePlan, removePlan, isPlanSaved }
}