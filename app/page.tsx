"use client"

import { useEffect, useState } from "react"
import { Show, SignInButton, UserButton, useUser } from "@clerk/nextjs"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
LayoutDashboard,
CheckSquare,
Calendar,
BookOpen,
BarChart3,
Settings,
User,
GraduationCap,
Bell,
Search,
TrendingUp,
TrendingDown,
Clock,
Target,
Flame,
} from "lucide-react"
import {
Area,
AreaChart,
ResponsiveContainer,
Tooltip,
XAxis,
YAxis,
CartesianGrid,
} from "recharts"

// Navigation data
const navigation = [
{ name: "Overview", icon: LayoutDashboard, href: "#", current: true },
{ name: "Tasks", icon: CheckSquare, href: "#", current: false },
{ name: "Calendar", icon: Calendar, href: "#", current: false },
{ name: "Courses", icon: BookOpen, href: "#", current: false },
{ name: "Analytics", icon: BarChart3, href: "#", current: false },
]

const secondaryNavigation = [
{ name: "Settings", icon: Settings, href: "#" },
{ name: "Profile", icon: User, href: "#" },
]

type Task = {
  id: string
  title: string
  user_id: string
  completed?: boolean
}

// Study hours data
const studyData = [
{ day: "Mon", hours: 4.5, goal: 5 },
{ day: "Tue", hours: 6.2, goal: 5 },
{ day: "Wed", hours: 3.8, goal: 5 },
{ day: "Thu", hours: 5.5, goal: 5 },
{ day: "Fri", hours: 4.0, goal: 5 },
{ day: "Sat", hours: 7.2, goal: 5 },
{ day: "Sun", hours: 2.5, goal: 5 },
]

const totalHours = studyData.reduce((sum, d) => sum + d.hours, 0)
const avgHours = (totalHours / studyData.length).toFixed(1)

// Stats data
const stats = [
{
title: "Study Streak",
value: "12",
unit: "days",
change: "+3",
trend: "up" as const,
icon: Flame,
color: "text-chart-5",
},
{
title: "Weekly Goal",
value: "78",
unit: "%",
change: "+12%",
trend: "up" as const,
icon: Target,
color: "text-chart-2",
},
{
title: "Focus Time",
value: "4.2",
unit: "hrs/day",
change: "-0.5",
trend: "down" as const,
icon: Clock,
color: "text-chart-1",
},
{
title: "Courses Active",
value: "5",
unit: "courses",
change: "0",
trend: "neutral" as const,
icon: BookOpen,
color: "text-chart-3",
},
]

// Sidebar Component
function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border">
<div className="flex h-16 items-center gap-3 px-6 border-b border-sidebar-border">
<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
<GraduationCap className="h-5 w-5 text-primary-foreground" />
</div>
<span className="text-lg font-semibold text-sidebar-foreground">StudyFlow</span>
</div>

<nav className="flex-1 px-3 py-4">
<ul className="space-y-1">
{navigation.map((item) => (
<li key={item.name}>
<a
href={item.href}
className={cn(
"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
item.current
? "bg-sidebar-accent text-sidebar-primary"
: "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
)}
>
<item.icon className="h-5 w-5" />
{item.name}
</a>
</li>
))}
</ul>
</nav>

<div className="border-t border-sidebar-border px-3 py-4">
<ul className="space-y-1">
{secondaryNavigation.map((item) => (
<li key={item.name}>
<a
href={item.href}
className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
>
<item.icon className="h-5 w-5" />
{item.name}
</a>
</li>
))}
</ul>
</div>

<div className="border-t border-sidebar-border p-4">
<div className="flex items-center gap-3">
<div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
<span className="text-sm font-medium">JS</span>
</div>
<div className="flex-1 min-w-0">
<p className="text-sm font-medium text-sidebar-foreground truncate">Jamie Smith</p>
<p className="text-xs text-muted-foreground truncate">Computer Science</p>
</div>
</div>
    </div>
    </aside>
  )
}

// Header Component
function Header() {
const currentDate = new Date().toLocaleDateString("en-US", {
weekday: "long",
year: "numeric",
month: "long",
day: "numeric",
})

return (
<header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
<div>
<h1 className="text-xl font-semibold text-foreground">Good morning, Jamie</h1>
<p className="text-sm text-muted-foreground">{currentDate}</p>
</div>
<div className="flex items-center gap-4">
<div className="relative hidden md:block">
<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
<Input
type="search"
placeholder="Search tasks, courses..."
className="w-64 bg-secondary/50 pl-9 border-border"
/>
</div>
<Button variant="ghost" size="icon" className="relative">
<Bell className="h-5 w-5 text-muted-foreground" />
<span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
3
</span>
<span className="sr-only">Notifications</span>
</Button>
</div>
</header>
)
}

// Stats Cards Component
function StatsCards() {
return (
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
{stats.map((stat) => (
<Card key={stat.title} className="relative overflow-hidden">
<CardContent className="p-4">
<div className="flex items-center justify-between">
<p className="text-sm text-muted-foreground">{stat.title}</p>
<stat.icon className={cn("h-5 w-5", stat.color)} />
</div>
<div className="mt-2 flex items-baseline gap-2">
<span className="text-2xl font-bold text-foreground">{stat.value}</span>
<span className="text-sm text-muted-foreground">{stat.unit}</span>
</div>
<div className="mt-2 flex items-center gap-1 text-xs">
{stat.trend === "up" && (
<>
<TrendingUp className="h-3.5 w-3.5 text-chart-2" />
<span className="text-chart-2">{stat.change}</span>
</>
)}
{stat.trend === "down" && (
<>
<TrendingDown className="h-3.5 w-3.5 text-destructive" />
<span className="text-destructive">{stat.change}</span>
</>
)}
{stat.trend === "neutral" && (
<span className="text-muted-foreground">No change</span>
)}
<span className="text-muted-foreground ml-1">from last week</span>
</div>
</CardContent>
</Card>
))}
</div>
)
}

// Study Hours Chart Component
function StudyHoursChart() {
return (
<Card className="flex flex-col">
<CardHeader className="flex flex-row items-center justify-between pb-2">
<div>
<CardTitle className="text-base font-semibold">Study Hours</CardTitle>
<p className="text-xs text-muted-foreground mt-1">This week</p>
</div>
<div className="flex items-center gap-4 text-sm">
<div className="flex items-center gap-2">
<div className="h-2.5 w-2.5 rounded-full bg-chart-1" />
<span className="text-muted-foreground">Hours</span>
</div>
<div className="flex items-center gap-2">
<div className="h-2.5 w-2.5 rounded-full bg-chart-2" />
<span className="text-muted-foreground">Goal</span>
</div>
</div>
</CardHeader>
<CardContent className="flex-1 pt-4">
<div className="flex items-baseline gap-2 mb-4">
<span className="text-3xl font-bold text-foreground">{totalHours.toFixed(1)}</span>
<span className="text-sm text-muted-foreground">hours total</span>
<span className="ml-auto text-sm text-muted-foreground">
Avg: <span className="text-foreground font-medium">{avgHours}h</span>/day
</span>
</div>
<div className="h-[200px] w-full">
<ResponsiveContainer width="100%" height="100%">
<AreaChart data={studyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
<defs>
<linearGradient id="studyGradient" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stopColor="oklch(0.7 0.15 200)" stopOpacity={0.4} />
<stop offset="100%" stopColor="oklch(0.7 0.15 200)" stopOpacity={0} />
</linearGradient>
</defs>
<CartesianGrid
strokeDasharray="3 3"
stroke="oklch(0.22 0 0)"
vertical={false}
/>
<XAxis
dataKey="day"
axisLine={false}
tickLine={false}
tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }}
/>
<YAxis
axisLine={false}
tickLine={false}
tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }}
domain={[0, 8]}
ticks={[0, 2, 4, 6, 8]}
/>
<Tooltip
contentStyle={{
backgroundColor: "oklch(0.12 0 0)",
border: "1px solid oklch(0.22 0 0)",
borderRadius: "8px",
color: "oklch(0.95 0 0)",
}}
labelStyle={{ color: "oklch(0.6 0 0)" }}
formatter={(value: number) => [`${value}h`, "Hours"]}
/>
<Area
type="monotone"
dataKey="goal"
stroke="oklch(0.65 0.18 160)"
strokeWidth={2}
strokeDasharray="5 5"
fill="none"
/>
<Area
type="monotone"
dataKey="hours"
stroke="oklch(0.7 0.15 200)"
strokeWidth={2}
fill="url(#studyGradient)"
/>
</AreaChart>
</ResponsiveContainer>
</div>
</CardContent>
</Card>
)
}

// Tasks Card Component
function TasksCard({
  tasks,
  newTask,
  setNewTask,
  onAddTask,
}: {
  tasks: Task[]
  newTask: string
  setNewTask: (value: string) => void
  onAddTask: () => void
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Upcoming Tasks</CardTitle>
        <Badge variant="secondary" className="text-xs">
          {tasks.filter((t) => !t.completed).length} pending
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <div className="mb-4 flex gap-2">
          <Input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            onKeyDown={(e) => e.key === "Enter" && onAddTask()}
          />
          <Button onClick={onAddTask}>Add</Button>
        </div>
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={cn(
                "flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-3 transition-all hover:bg-secondary/50",
                task.completed && "opacity-60"
              )}
            >
              <Checkbox
                id={`task-${task.id}`}
                checked={task.completed ?? false}
                className="mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <label
                  htmlFor={`task-${task.id}`}
                  className={cn(
                    "text-sm font-medium cursor-pointer",
                    task.completed && "line-through text-muted-foreground"
                  )}
                >
                  {task.title}
                </label>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

// Main Dashboard Page
export default function Dashboard() {
  const { user } = useUser()
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")

  useEffect(() => {
    if (!user?.id) return

    async function fetchTasks() {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)

      if (!error && data) {
        setTasks(data)
      }
    }

    fetchTasks()
  }, [user?.id])

  async function addTask() {
    if (!user?.id || !newTask.trim()) return

    const { data, error } = await supabase
      .from("tasks")
      .insert({ title: newTask.trim(), user_id: user.id })
      .select()
      .single()

    if (!error && data) {
      setTasks((prev) => [...prev, data])
      setNewTask("")
    }
  }

  return (
<div className="flex h-screen bg-background">
<div className="absolute top-4 right-4 z-50">
<Show when="signed-out">
<SignInButton mode="modal">
<button className="bg-blue-600 text-white px-4 py-2 rounded-md font-bold shadow-lg">Sign In</button>
</SignInButton>
</Show>
<Show when="signed-in">
<UserButton afterSignOutUrl="/" />
</Show>
</div>
<Sidebar />

<div className="flex flex-1 flex-col overflow-hidden">
<Header />

<main className="flex-1 overflow-auto p-6">
<div className="mx-auto max-w-7xl space-y-6">
<StatsCards />

<div className="grid gap-6 lg:grid-cols-2">
<StudyHoursChart />
<TasksCard
  tasks={tasks}
  newTask={newTask}
  setNewTask={setNewTask}
  onAddTask={addTask}
/>
</div>
</div>
</main>
</div>
</div>
)
}

