import { createClient } from '@/lib/supabase/server'
import AppShell from '@/components/AppShell'
import { Flame, Dumbbell, CheckSquare, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import type { FoodLog, WorkoutSession, Task } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const today = new Date().toISOString().split('T')[0]

  const [foodLogsRes, workoutRes, tasksRes] = await Promise.all([
    supabase.from('food_logs').select('*').eq('user_id', user!.id).eq('logged_date', today),
    supabase.from('workout_sessions').select('*').eq('user_id', user!.id).eq('session_date', today),
    supabase.from('tasks').select('*').eq('user_id', user!.id).eq('due_date', today).order('completed'),
  ])

  const foodLogs = (foodLogsRes.data as FoodLog[]) || []
  const workouts = (workoutRes.data as WorkoutSession[]) || []
  const tasks = (tasksRes.data as Task[]) || []

  const totalCalories = foodLogs.reduce((sum, f) => sum + Number(f.calories) * Number(f.quantity), 0)
  const totalProtein = foodLogs.reduce((sum, f) => sum + Number(f.protein) * Number(f.quantity), 0)
  const pendingTasks = tasks.filter((t) => !t.completed)

  const greeting = (() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  })()

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white">{greeting} 👋</h1>
        <p className="mt-1 text-sm text-slate-400">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          icon={<Flame size={20} />}
          label="Calories today"
          value={Math.round(totalCalories).toString()}
          color="text-orange-400 bg-orange-500/10"
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="Protein (g)"
          value={Math.round(totalProtein).toString()}
          color="text-emerald-400 bg-emerald-500/10"
        />
        <StatCard
          icon={<Dumbbell size={20} />}
          label="Workouts today"
          value={workouts.length.toString()}
          color="text-indigo-400 bg-indigo-500/10"
        />
        <StatCard
          icon={<CheckSquare size={20} />}
          label="Tasks pending"
          value={pendingTasks.length.toString()}
          color="text-amber-400 bg-amber-500/10"
        />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/calories"
          className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-5 transition hover:border-orange-500/30 hover:bg-slate-900"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
            <Flame size={20} />
          </div>
          <h3 className="font-medium text-white">Log food</h3>
          <p className="mt-1 text-sm text-slate-400">Track meals, search foods, or save recipes</p>
        </Link>

        <Link
          href="/workouts"
          className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-5 transition hover:border-indigo-500/30 hover:bg-slate-900"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
            <Dumbbell size={20} />
          </div>
          <h3 className="font-medium text-white">Log workout</h3>
          <p className="mt-1 text-sm text-slate-400">Track sets, reps and weight</p>
        </Link>

        <Link
          href="/planner"
          className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-5 transition hover:border-amber-500/30 hover:bg-slate-900 sm:col-span-2"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <CheckSquare size={20} />
          </div>
          <h3 className="font-medium text-white">Planner</h3>
          <p className="mt-1 text-sm text-slate-400">
            {pendingTasks.length > 0
              ? `You have ${pendingTasks.length} task${pendingTasks.length > 1 ? 's' : ''} for today`
              : 'No tasks for today — add notes or to-dos'}
          </p>
        </Link>
      </div>

      {pendingTasks.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-medium text-slate-400">Today&apos;s tasks</h2>
          <div className="space-y-2">
            {pendingTasks.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3"
              >
                <div className="h-2 w-2 rounded-full bg-amber-400" />
                <span className="text-sm text-slate-200">{task.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </AppShell>
  )
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string
  color: string
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
      <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${color}`}>
        {icon}
      </div>
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="mt-0.5 text-xs text-slate-400">{label}</p>
    </div>
  )
}
