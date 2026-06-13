'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import AppShell from '@/components/AppShell'
import type { Task } from '@/lib/types'
import { ChevronLeft, ChevronRight, Plus, Trash2, X, Loader2, CalendarDays } from 'lucide-react'

function toDateStr(d: Date) {
  return d.toISOString().split('T')[0]
}

export default function PlannerPage() {
  const supabase = createClient()
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  const [selectedDate, setSelectedDate] = useState(() => toDateStr(new Date()))
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const loadTasks = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const start = toDateStr(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1))
    const end = toDateStr(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0))

    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .gte('due_date', start)
      .lte('due_date', end)
      .order('due_date')

    setTasks((data as Task[]) || [])
    setLoading(false)
  }, [currentMonth, supabase])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  async function toggleTask(task: Task) {
    await supabase.from('tasks').update({ completed: !task.completed }).eq('id', task.id)
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t)))
  }

  async function deleteTask(id: string) {
    await supabase.from('tasks').delete().eq('id', id)
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  function shiftMonth(delta: number) {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1))
  }

  // Build calendar grid
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startOffset = firstDay.getDay()
  const daysInMonth = lastDay.getDate()

  const cells: (number | null)[] = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const tasksByDate = tasks.reduce<Record<string, Task[]>>((acc, t) => {
    acc[t.due_date] = acc[t.due_date] || []
    acc[t.due_date].push(t)
    return acc
  }, {})

  const today = toDateStr(new Date())
  const selectedTasks = tasksByDate[selectedDate] || []

  return (
    <AppShell>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Planner</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-600"
        >
          <Plus size={16} />
          Add task
        </button>
      </div>

      {/* Calendar */}
      <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
        <div className="mb-4 flex items-center justify-between">
          <button onClick={() => shiftMonth(-1)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white">
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-medium text-white">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={() => shiftMonth(1)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} className="py-1 text-xs font-medium text-slate-500">{d}</div>
          ))}
          {cells.map((day, i) => {
            if (day === null) return <div key={i} />
            const dateStr = toDateStr(new Date(year, month, day))
            const dayTasks = tasksByDate[dateStr] || []
            const isSelected = dateStr === selectedDate
            const isToday = dateStr === today
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(dateStr)}
                className={`relative flex aspect-square flex-col items-center justify-center rounded-xl text-sm transition ${
                  isSelected
                    ? 'bg-indigo-500 text-white'
                    : isToday
                    ? 'bg-slate-800 text-indigo-400'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {day}
                {dayTasks.length > 0 && (
                  <div className="absolute bottom-1 flex gap-0.5">
                    {dayTasks.slice(0, 3).map((t, idx) => (
                      <div
                        key={idx}
                        className={`h-1 w-1 rounded-full ${
                          isSelected ? 'bg-white' : t.completed ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected day tasks */}
      <div>
        <h2 className="mb-3 text-sm font-medium text-slate-400">
          {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </h2>

        {loading ? (
          <div className="flex justify-center py-8 text-slate-500">
            <Loader2 className="animate-spin" size={20} />
          </div>
        ) : selectedTasks.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
              <CalendarDays size={24} />
            </div>
            <p className="text-sm text-slate-400">Nothing planned for this day</p>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedTasks.map((task) => (
              <div key={task.id} className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3">
                <button
                  onClick={() => toggleTask(task)}
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                    task.completed ? 'border-emerald-400 bg-emerald-400' : 'border-slate-600'
                  }`}
                >
                  {task.completed && <span className="text-xs text-slate-950">✓</span>}
                </button>
                <div className="flex-1">
                  <p className={`text-sm ${task.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{task.title}</p>
                  {task.notes && <p className="mt-0.5 text-xs text-slate-500">{task.notes}</p>}
                </div>
                <button onClick={() => deleteTask(task.id)} className="rounded-lg p-1.5 text-slate-500 hover:bg-red-500/10 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <NewTaskModal
          defaultDate={selectedDate}
          onClose={() => setShowModal(false)}
          onCreated={(task) => setTasks((prev) => [...prev, task])}
        />
      )}
    </AppShell>
  )
}

function NewTaskModal({
  defaultDate,
  onClose,
  onCreated,
}: {
  defaultDate: string
  onClose: () => void
  onCreated: (task: Task) => void
}) {
  const supabase = createClient()
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [dueDate, setDueDate] = useState(defaultDate)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!title.trim()) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('tasks')
      .insert({ user_id: user.id, title, notes: notes || null, due_date: dueDate })
      .select()
      .single()

    if (!error && data) {
      onCreated(data as Task)
      onClose()
    }
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center" onClick={onClose}>
      <div className="w-full max-w-md rounded-t-2xl bg-slate-900 p-5 sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">New task</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">Title</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Meal prep for the week"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add details..."
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving || !title.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-600 disabled:opacity-50"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            Add task
          </button>
        </div>
      </div>
    </div>
  )
}
