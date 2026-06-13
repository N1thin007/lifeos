'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import AppShell from '@/components/AppShell'
import type { WorkoutSession, WorkoutExercise } from '@/lib/types'
import { Plus, X, Trash2, Dumbbell, ChevronDown, ChevronUp, Loader2, Search } from 'lucide-react'
import { EXERCISES } from '@/lib/data/exercises'

export default function WorkoutsPage() {
  const supabase = createClient()
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const loadData = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('workout_sessions')
      .select('*, workout_exercises(*)')
      .eq('user_id', user.id)
      .order('session_date', { ascending: false })
      .limit(30)

    setSessions((data as WorkoutSession[]) || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    loadData()
  }, [loadData])

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function deleteSession(id: string) {
    await supabase.from('workout_sessions').delete().eq('id', id)
    setSessions((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <AppShell>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Workouts</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-600"
        >
          <Plus size={16} />
          New session
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12 text-slate-500">
          <Loader2 className="animate-spin" size={24} />
        </div>
      ) : sessions.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
            <Dumbbell size={24} />
          </div>
          <p className="text-sm text-slate-400">No workouts logged yet. Start your first session!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
            const isExpanded = expanded.has(session.id)
            const exercises = session.workout_exercises || []
            return (
              <div key={session.id} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                <button onClick={() => toggleExpand(session.id)} className="flex w-full items-center justify-between text-left">
                  <div>
                    <p className="font-medium text-white">{session.name}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(session.session_date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      {' · '}{exercises.length} exercise{exercises.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteSession(session.id) }}
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                    {isExpanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="mt-3 space-y-2 border-t border-slate-800 pt-3">
                    {session.notes && <p className="text-sm text-slate-400 italic">{session.notes}</p>}
                    {exercises.length === 0 ? (
                      <p className="text-sm text-slate-500">No exercises logged</p>
                    ) : (
                      exercises
                        .sort((a, b) => a.order_index - b.order_index)
                        .map((ex) => (
                          <div key={ex.id} className="flex items-center justify-between rounded-xl bg-slate-800/50 px-3 py-2">
                            <span className="text-sm text-slate-200">{ex.exercise_name}</span>
                            <span className="text-xs text-slate-400">
                              {ex.sets} × {ex.reps} {ex.weight ? `@ ${ex.weight}${ex.weight_unit}` : ''}
                            </span>
                          </div>
                        ))
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {showModal && (
        <NewSessionModal
          onClose={() => setShowModal(false)}
          onCreated={(session) => setSessions((prev) => [session, ...prev])}
        />
      )}
    </AppShell>
  )
}

interface ExerciseDraft {
  exercise_name: string
  sets: string
  reps: string
  weight: string
  weight_unit: string
}

function NewSessionModal({
  onClose,
  onCreated,
}: {
  onClose: () => void
  onCreated: (session: WorkoutSession) => void
}) {
  const supabase = createClient()
  const [name, setName] = useState('Workout')
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')
  const [exercises, setExercises] = useState<ExerciseDraft[]>([
    { exercise_name: '', sets: '3', reps: '10', weight: '', weight_unit: 'kg' },
  ])
  const [saving, setSaving] = useState(false)
  const [pickerIndex, setPickerIndex] = useState<number | null>(null)

  function updateExercise(i: number, field: keyof ExerciseDraft, value: string) {
    setExercises((prev) => prev.map((ex, idx) => (idx === i ? { ...ex, [field]: value } : ex)))
  }

  function addExercise() {
    setExercises((prev) => [...prev, { exercise_name: '', sets: '3', reps: '10', weight: '', weight_unit: 'kg' }])
  }

  function removeExercise(i: number) {
    setExercises((prev) => prev.filter((_, idx) => idx !== i))
  }

  async function handleSave() {
    const validExercises = exercises.filter((ex) => ex.exercise_name.trim())
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: session, error } = await supabase
      .from('workout_sessions')
      .insert({ user_id: user.id, session_date: date, name, notes: notes || null })
      .select()
      .single()

    if (error || !session) {
      setSaving(false)
      return
    }

    if (validExercises.length > 0) {
      const rows = validExercises.map((ex, i) => ({
        session_id: session.id,
        user_id: user.id,
        exercise_name: ex.exercise_name,
        sets: Number(ex.sets) || null,
        reps: Number(ex.reps) || null,
        weight: ex.weight ? Number(ex.weight) : null,
        weight_unit: ex.weight_unit,
        order_index: i,
      }))
      const { data: insertedExercises } = await supabase.from('workout_exercises').insert(rows).select()
      onCreated({ ...session, workout_exercises: insertedExercises || [] } as WorkoutSession)
    } else {
      onCreated({ ...session, workout_exercises: [] } as WorkoutSession)
    }

    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center" onClick={onClose}>
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-slate-900 p-5 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">New workout session</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">Session name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Push Day"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-slate-400">Exercises</label>
            <div className="space-y-2">
              {exercises.map((ex, i) => (
                <div key={i} className="rounded-xl bg-slate-800/50 p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPickerIndex(i)}
                      className={`flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-left text-sm outline-none transition focus:border-indigo-500 ${
                        ex.exercise_name ? 'text-white' : 'text-slate-500'
                      }`}
                    >
                      {ex.exercise_name || 'Select an exercise'}
                    </button>
                    {exercises.length > 1 && (
                      <button onClick={() => removeExercise(i)} className="rounded-lg p-1.5 text-slate-500 hover:bg-red-500/10 hover:text-red-400">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <MiniField label="Sets" value={ex.sets} onChange={(v) => updateExercise(i, 'sets', v)} />
                    <MiniField label="Reps" value={ex.reps} onChange={(v) => updateExercise(i, 'reps', v)} />
                    <MiniField label="Weight" value={ex.weight} onChange={(v) => updateExercise(i, 'weight', v)} />
                    <div>
                      <label className="mb-1 block text-[10px] text-slate-500">Unit</label>
                      <select
                        value={ex.weight_unit}
                        onChange={(e) => updateExercise(i, 'weight_unit', e.target.value)}
                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                      >
                        <option value="kg">kg</option>
                        <option value="lb">lb</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={addExercise}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700 py-2 text-sm text-slate-400 transition hover:border-indigo-500 hover:text-indigo-400"
            >
              <Plus size={14} />
              Add exercise
            </button>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="How did it feel?"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-600 disabled:opacity-50"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            Save session
          </button>
        </div>
      </div>

      {pickerIndex !== null && (
        <ExercisePickerModal
          onClose={() => setPickerIndex(null)}
          onSelect={(name) => {
            updateExercise(pickerIndex, 'exercise_name', name)
            setPickerIndex(null)
          }}
        />
      )}
    </div>
  )
}

function ExercisePickerModal({
  onClose,
  onSelect,
}: {
  onClose: () => void
  onSelect: (name: string) => void
}) {
  const [query, setQuery] = useState('')

  const filteredCategories = EXERCISES.map((cat) => ({
    category: cat.category,
    exercises: cat.exercises.filter((e) => e.toLowerCase().includes(query.toLowerCase())),
  })).filter((cat) => cat.exercises.length > 0)

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 sm:items-center" onClick={onClose}>
      <div
        className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-slate-900 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <h2 className="text-lg font-semibold text-white">Select exercise</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800">
            <X size={18} />
          </button>
        </div>

        <div className="border-b border-slate-800 p-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search exercises..."
              className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {query.trim() && (
            <button
              onClick={() => onSelect(query.trim())}
              className="mb-3 flex w-full items-center justify-between rounded-xl border border-dashed border-slate-700 px-3 py-2.5 text-left text-sm text-indigo-400 transition hover:border-indigo-500"
            >
              Use &quot;{query.trim()}&quot; as custom exercise
              <Plus size={16} />
            </button>
          )}

          {filteredCategories.length === 0 && !query.trim() ? (
            <p className="py-8 text-center text-sm text-slate-500">No exercises found.</p>
          ) : (
            <div className="space-y-4">
              {filteredCategories.map((cat) => (
                <div key={cat.category}>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{cat.category}</h3>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {cat.exercises.map((ex) => (
                      <button
                        key={ex}
                        onClick={() => onSelect(ex)}
                        className="rounded-xl bg-slate-800/50 px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-indigo-500/15 hover:text-indigo-300"
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MiniField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1 block text-[10px] text-slate-500">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
      />
    </div>
  )
}
