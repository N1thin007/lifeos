'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import AppShell from '@/components/AppShell'
import type { FoodLog, Food } from '@/lib/types'
import {
  Plus, Search, X, Trash2, Flame, ChevronLeft, ChevronRight,
  BookmarkPlus, Loader2,
} from 'lucide-react'

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const

const TARGETS = { calories: 2200, protein: 140, carbs: 250, fat: 70 }

interface SearchResult {
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  serving_size: string
}

export default function CaloriesPage() {
  const supabase = createClient()
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [logs, setLogs] = useState<FoodLog[]>([])
  const [savedFoods, setSavedFoods] = useState<Food[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [activeMeal, setActiveMeal] = useState<typeof MEAL_TYPES[number]>('breakfast')

  const loadData = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [logsRes, foodsRes] = await Promise.all([
      supabase.from('food_logs').select('*').eq('user_id', user.id).eq('logged_date', date).order('created_at'),
      supabase.from('foods').select('*').eq('user_id', user.id).order('name'),
    ])

    setLogs((logsRes.data as FoodLog[]) || [])
    setSavedFoods((foodsRes.data as Food[]) || [])
    setLoading(false)
  }, [date, supabase])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function deleteLog(id: string) {
    await supabase.from('food_logs').delete().eq('id', id)
    setLogs((prev) => prev.filter((l) => l.id !== id))
  }

  function shiftDate(days: number) {
    const d = new Date(date)
    d.setDate(d.getDate() + days)
    setDate(d.toISOString().split('T')[0])
  }

  const totals = logs.reduce(
    (acc, l) => ({
      calories: acc.calories + Number(l.calories) * Number(l.quantity),
      protein: acc.protein + Number(l.protein) * Number(l.quantity),
      carbs: acc.carbs + Number(l.carbs) * Number(l.quantity),
      fat: acc.fat + Number(l.fat) * Number(l.quantity),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  const isToday = date === new Date().toISOString().split('T')[0]

  return (
    <AppShell>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Calories</h1>
      </div>

      {/* Date selector */}
      <div className="mb-6 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/50 p-3">
        <button onClick={() => shiftDate(-1)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white">
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm font-medium text-white">
          {isToday ? 'Today' : new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </span>
        <button onClick={() => shiftDate(1)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Summary */}
      <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
              <Flame size={18} />
            </div>
            <div>
              <p className="text-xl font-semibold text-white">{Math.round(totals.calories)}</p>
              <p className="text-xs text-slate-400">of {TARGETS.calories} kcal</p>
            </div>
          </div>
          <div className="text-right text-xs text-slate-400">
            {Math.max(0, Math.round(TARGETS.calories - totals.calories))} kcal remaining
          </div>
        </div>
        <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full bg-orange-400 transition-all"
            style={{ width: `${Math.min(100, (totals.calories / TARGETS.calories) * 100)}%` }}
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Macro label="Protein" value={totals.protein} target={TARGETS.protein} color="bg-emerald-400" />
          <Macro label="Carbs" value={totals.carbs} target={TARGETS.carbs} color="bg-sky-400" />
          <Macro label="Fat" value={totals.fat} target={TARGETS.fat} color="bg-purple-400" />
        </div>
      </div>

      {/* Meals */}
      {loading ? (
        <div className="flex justify-center py-12 text-slate-500">
          <Loader2 className="animate-spin" size={24} />
        </div>
      ) : (
        <div className="space-y-4">
          {MEAL_TYPES.map((meal) => {
            const mealLogs = logs.filter((l) => l.meal_type === meal)
            const mealCals = mealLogs.reduce((s, l) => s + Number(l.calories) * Number(l.quantity), 0)
            return (
              <div key={meal} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-medium capitalize text-white">{meal}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{Math.round(mealCals)} kcal</span>
                    <button
                      onClick={() => {
                        setActiveMeal(meal)
                        setShowAddModal(true)
                      }}
                      className="rounded-lg bg-slate-800 p-1.5 text-slate-300 transition hover:bg-indigo-500/20 hover:text-indigo-400"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                {mealLogs.length === 0 ? (
                  <p className="text-sm text-slate-500">No items logged</p>
                ) : (
                  <div className="space-y-2">
                    {mealLogs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between rounded-xl bg-slate-800/50 px-3 py-2">
                        <div>
                          <p className="text-sm text-slate-200">{log.food_name}</p>
                          <p className="text-xs text-slate-500">
                            {Math.round(Number(log.calories) * Number(log.quantity))} kcal · qty {log.quantity}
                          </p>
                        </div>
                        <button onClick={() => deleteLog(log.id)} className="rounded-lg p-1.5 text-slate-500 hover:bg-red-500/10 hover:text-red-400">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {showAddModal && (
        <AddFoodModal
          date={date}
          mealType={activeMeal}
          savedFoods={savedFoods}
          onClose={() => setShowAddModal(false)}
          onAdded={(log) => setLogs((prev) => [...prev, log])}
          onFoodSaved={(food) => setSavedFoods((prev) => [...prev, food])}
        />
      )}
    </AppShell>
  )
}

function Macro({ label, value, target, color }: { label: string; value: number; target: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-xs text-slate-400">{label}</span>
        <span className="text-xs text-slate-300">{Math.round(value)}/{target}g</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
        <div className={`h-full ${color} transition-all`} style={{ width: `${Math.min(100, (value / target) * 100)}%` }} />
      </div>
    </div>
  )
}

function AddFoodModal({
  date,
  mealType,
  savedFoods,
  onClose,
  onAdded,
  onFoodSaved,
}: {
  date: string
  mealType: string
  savedFoods: Food[]
  onClose: () => void
  onAdded: (log: FoodLog) => void
  onFoodSaved: (food: Food) => void
}) {
  const supabase = createClient()
  const [tab, setTab] = useState<'search' | 'manual' | 'saved'>('search')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [saving, setSaving] = useState(false)

  // Manual / selected food form state
  const [form, setForm] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    quantity: '1',
  })
  const [saveAsRecipe, setSaveAsRecipe] = useState(false)

  useEffect(() => {
    if (tab !== 'search' || query.trim().length < 2) {
      setResults([])
      return
    }
    const timeout = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(`/api/food-search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data.results || [])
      } catch {
        setResults([])
      }
      setSearching(false)
    }, 400)
    return () => clearTimeout(timeout)
  }, [query, tab])

  function selectFood(food: SearchResult | Food) {
    setForm({
      name: food.name,
      calories: String(food.calories),
      protein: String(food.protein),
      carbs: String(food.carbs),
      fat: String(food.fat),
      quantity: '1',
    })
    setTab('manual')
  }

  async function handleSave() {
    if (!form.name || !form.calories) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const logData = {
      user_id: user.id,
      food_name: form.name,
      calories: Number(form.calories),
      protein: Number(form.protein) || 0,
      carbs: Number(form.carbs) || 0,
      fat: Number(form.fat) || 0,
      quantity: Number(form.quantity) || 1,
      meal_type: mealType,
      logged_date: date,
    }

    const { data: inserted, error } = await supabase.from('food_logs').insert(logData).select().single()

    if (!error && inserted) {
      onAdded(inserted as FoodLog)

      if (saveAsRecipe) {
        const { data: savedFood } = await supabase
          .from('foods')
          .insert({
            user_id: user.id,
            name: form.name,
            calories: Number(form.calories),
            protein: Number(form.protein) || 0,
            carbs: Number(form.carbs) || 0,
            fat: Number(form.fat) || 0,
            is_recipe: true,
          })
          .select()
          .single()
        if (savedFood) onFoodSaved(savedFood as Food)
      }

      onClose()
    }
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center" onClick={onClose}>
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-slate-900 p-5 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white capitalize">Add to {mealType}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-4 flex gap-2 rounded-xl bg-slate-800 p-1">
          {(['search', 'saved', 'manual'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 rounded-lg py-1.5 text-sm font-medium capitalize transition ${
                tab === t ? 'bg-indigo-500 text-white' : 'text-slate-400'
              }`}
            >
              {t === 'saved' ? 'My recipes' : t}
            </button>
          ))}
        </div>

        {tab === 'search' && (
          <div>
            <div className="relative mb-3">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search foods (e.g. chicken breast)"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500"
              />
            </div>
            {searching && <p className="text-center text-sm text-slate-500">Searching...</p>}
            <div className="space-y-2">
              {results.map((r, i) => (
                <button
                  key={i}
                  onClick={() => selectFood(r)}
                  className="flex w-full items-center justify-between rounded-xl bg-slate-800/50 px-3 py-2.5 text-left transition hover:bg-slate-800"
                >
                  <div>
                    <p className="text-sm text-slate-200">{r.name}</p>
                    <p className="text-xs text-slate-500">{r.calories} kcal per {r.serving_size}</p>
                  </div>
                  <Plus size={16} className="text-slate-500" />
                </button>
              ))}
              {!searching && query.length >= 2 && results.length === 0 && (
                <p className="py-4 text-center text-sm text-slate-500">No results. Try manual entry.</p>
              )}
            </div>
          </div>
        )}

        {tab === 'saved' && (
          <div className="space-y-2">
            {savedFoods.length === 0 && (
              <p className="py-4 text-center text-sm text-slate-500">No saved recipes yet. Create one via manual entry.</p>
            )}
            {savedFoods.map((f) => (
              <button
                key={f.id}
                onClick={() => selectFood(f)}
                className="flex w-full items-center justify-between rounded-xl bg-slate-800/50 px-3 py-2.5 text-left transition hover:bg-slate-800"
              >
                <div>
                  <p className="text-sm text-slate-200">{f.name}</p>
                  <p className="text-xs text-slate-500">{f.calories} kcal</p>
                </div>
                <Plus size={16} className="text-slate-500" />
              </button>
            ))}
          </div>
        )}

        {tab === 'manual' && (
          <div className="space-y-3">
            <Field label="Name" value={form.name} onChange={(v) => setForm((p) => ({ ...p, name: v }))} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Calories (kcal)" value={form.calories} onChange={(v) => setForm((p) => ({ ...p, calories: v }))} type="number" />
              <Field label="Quantity" value={form.quantity} onChange={(v) => setForm((p) => ({ ...p, quantity: v }))} type="number" step="0.1" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Protein (g)" value={form.protein} onChange={(v) => setForm((p) => ({ ...p, protein: v }))} type="number" />
              <Field label="Carbs (g)" value={form.carbs} onChange={(v) => setForm((p) => ({ ...p, carbs: v }))} type="number" />
              <Field label="Fat (g)" value={form.fat} onChange={(v) => setForm((p) => ({ ...p, fat: v }))} type="number" />
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" checked={saveAsRecipe} onChange={(e) => setSaveAsRecipe(e.target.checked)} className="rounded border-slate-700 bg-slate-800" />
              <BookmarkPlus size={14} />
              Save as recipe for reuse
            </label>

            <button
              onClick={handleSave}
              disabled={saving || !form.name || !form.calories}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-600 disabled:opacity-50"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              Add to log
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  step,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  step?: string
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-400">{label}</label>
      <input
        type={type}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
      />
    </div>
  )
}
