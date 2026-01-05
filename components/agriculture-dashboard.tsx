"use client"
import {
  Droplets,
  Sprout,
  ThermometerSun,
  CloudRain,
  Wind,
  AlertTriangle,
  CheckCircle2,
  Info,
  TrendingUp,
  Activity,
  LayoutDashboard,
  BarChart3,
  Settings,
  HelpCircle,
  MapPin,
  Wheat,
  CalendarDays,
  Coins,
  FlaskConical,
} from "lucide-react"
import {
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useMemo } from "react"
import { ThemeToggle } from "@/components/theme-toggle"

// Simulated Data
const INDIAN_STATES = [
  "Punjab",
  "Haryana",
  "Uttar Pradesh",
  "Madhya Pradesh",
  "Rajasthan",
  "Maharashtra",
  "Gujarat",
  "Andhra Pradesh",
  "Karnataka",
  "Tamil Nadu",
]

const CROPS = ["Wheat", "Rice", "Maize", "Sugarcane", "Cotton", "Soybean", "Mustard", "Jowar"]

const generateMoistureData = (state: string, crop: string) => [
  { time: "00:00", moisture: 45 + Math.random() * 5, threshold: 40 },
  { time: "04:00", moisture: 42 + Math.random() * 5, threshold: 40 },
  { time: "08:00", moisture: 38 + Math.random() * 5, threshold: 40 },
  { time: "12:00", moisture: 55 + Math.random() * 5, threshold: 40 },
  { time: "16:00", moisture: 52 + Math.random() * 5, threshold: 40 },
  { time: "20:00", moisture: 48 + Math.random() * 5, threshold: 40 },
  { time: "23:59", moisture: 46 + Math.random() * 5, threshold: 40 },
]

const waterConsumptionData = [
  { day: "Mon", usage: 450, optimized: 320 },
  { day: "Tue", usage: 520, optimized: 340 },
  { day: "Wed", usage: 480, optimized: 310 },
  { day: "Thu", usage: 610, optimized: 380 },
  { day: "Fri", usage: 550, optimized: 350 },
  { day: "Sat", usage: 420, optimized: 300 },
  { day: "Sun", usage: 380, optimized: 280 },
]

const MANDI_PRICES = [
  { crop: "Wheat", price: "₹2,125/qtl", trend: "+1.2%", status: "up" },
  { crop: "Rice", price: "₹1,940/qtl", trend: "-0.5%", status: "down" },
  { crop: "Mustard", price: "₹5,450/qtl", trend: "+2.4%", status: "up" },
  { crop: "Cotton", price: "₹6,100/qtl", trend: "0.0%", status: "stable" },
]

export function AgricultureDashboard() {
  const [selectedState, setSelectedState] = useState("Punjab")
  const [selectedCrop, setSelectedCrop] = useState("Wheat")

  const moistureData = useMemo(() => generateMoistureData(selectedState, selectedCrop), [selectedState, selectedCrop])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - Inspired by Vercel/Supabase dashboards */}
      <aside className="hidden w-64 border-r border-border bg-card md:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 font-bold text-primary">
            <Droplets className="h-6 w-6" />
            <span className="text-sm tracking-tight leading-none">
              PRECISION AGRI
              <br />
              <span className="text-xs text-muted-foreground font-normal">WATER MGMT</span>
            </span>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-3 bg-accent/50 text-primary">
            <LayoutDashboard className="h-4 w-4" /> Overview
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
            <Activity className="h-4 w-4" /> Live Data
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
            <BarChart3 className="h-4 w-4" /> Analytics
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
            <Settings className="h-4 w-4" /> Sensors
          </Button>
        </nav>
        <div className="p-4 border-t border-border mt-auto">
          <div className="flex gap-2">
            <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
              SDG 2
            </Badge>
            <Badge variant="outline" className="text-[10px] bg-secondary/10 text-secondary border-secondary/20">
              SDG 6
            </Badge>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 border-b border-border flex items-center justify-between px-8 sticky top-0 bg-background/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-semibold tracking-tight">System Dashboard</h1>

            {/* State and Crop Selectors in Header */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger className="w-[140px] h-8 text-xs border-muted bg-muted/30">
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIAN_STATES.map((state) => (
                      <SelectItem key={state} value={state} className="text-xs">
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Wheat className="h-4 w-4 text-primary" />
                <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                  <SelectTrigger className="w-[140px] h-8 text-xs border-muted bg-muted/30">
                    <SelectValue placeholder="Crop" />
                  </SelectTrigger>
                  <SelectContent>
                    {CROPS.map((crop) => (
                      <SelectItem key={crop} value={crop} className="text-xs">
                        {crop}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-primary/20 text-primary border-none">
              System Active
            </Badge>
            <ThemeToggle />
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </header>

        {/* Mandi Price Ticker below header */}
        <div className="bg-primary/5 border-b border-border py-2 overflow-hidden whitespace-nowrap">
          <div className="flex animate-marquee gap-8 items-center px-8">
            <span className="text-[10px] font-bold uppercase text-primary flex items-center gap-1">
              <Coins className="h-3 w-3" /> Live Mandi Prices:
            </span>
            {MANDI_PRICES.map((item) => (
              <div key={item.crop} className="flex items-center gap-2 text-xs">
                <span className="font-semibold">{item.crop}:</span>
                <span className="text-muted-foreground">{item.price}</span>
                <span
                  className={
                    item.status === "up"
                      ? "text-green-500"
                      : item.status === "down"
                        ? "text-red-500"
                        : "text-muted-foreground"
                  }
                >
                  {item.trend}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Section 1: Key Stats */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Soil Moisture"
              value="42%"
              trend="+2.5%"
              icon={<Sprout className="h-4 w-4 text-primary" />}
              description={`Current field in ${selectedState}`}
            />
            <StatsCard
              title="Water Usage"
              value="342L"
              trend="-12%"
              icon={<Droplets className="h-4 w-4 text-secondary" />}
              description="Today's consumption"
            />
            <StatsCard
              title="Irrigation Need"
              value="NO"
              icon={<TrendingUp className="h-4 w-4 text-yellow-500" />}
              description="ML Prediction"
            />
            <StatsCard
              title="Water Saved"
              value="28%"
              trend="+5%"
              icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}
              description="Monthly optimization"
            />
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Section 2: Live Charts */}
            <Card className="lg:col-span-2 bg-card border-border shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-medium">Soil Moisture: {selectedCrop}</CardTitle>
                  <CardDescription>Real-time telemetry for {selectedState} fields</CardDescription>
                </div>
                <Tabs defaultValue="24h">
                  <TabsList className="bg-muted/50 border border-border">
                    <TabsTrigger value="24h" className="text-xs">
                      24h
                    </TabsTrigger>
                    <TabsTrigger value="7d" className="text-xs">
                      7d
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={moistureData}>
                      <defs>
                        <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                      <XAxis
                        dataKey="time"
                        stroke="var(--muted-foreground)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                        }}
                        itemStyle={{ color: "var(--primary)" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="moisture"
                        stroke="var(--primary)"
                        fillOpacity={1}
                        fill="url(#colorMoisture)"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="threshold"
                        stroke="var(--destructive)"
                        strokeDasharray="5 5"
                        dot={false}
                        strokeWidth={1}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Weather & Crop Info */}
            <div className="space-y-4">
              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Weather Forecast</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-yellow-500/10">
                      <ThermometerSun className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold">Temp</p>
                      <p className="font-semibold">28°C</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <CloudRain className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold">Rain</p>
                      <p className="font-semibold">15%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-400/10">
                      <Wind className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold">Humidity</p>
                      <p className="font-semibold">65%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Soil Health Analytics Card */}
              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-primary" />
                    Soil Health (NPK)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] uppercase font-bold">
                      <span>Nitrogen (N)</span>
                      <span className="text-primary">Optimal</span>
                    </div>
                    <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[70%]" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] uppercase font-bold">
                      <span>Phosphorus (P)</span>
                      <span className="text-yellow-500">Moderate</span>
                    </div>
                    <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                      <div className="bg-yellow-500 h-full w-[45%]" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] uppercase font-bold">
                      <span>Potassium (K)</span>
                      <span className="text-primary">Optimal</span>
                    </div>
                    <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[85%]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Irrigation Scheduler */}
              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-secondary" />
                    Upcoming Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { date: "Tomorrow", time: "05:00 AM", task: "Main Field Sync" },
                    { date: "Wed, 07 Jan", time: "06:30 PM", task: "Drip Cycle" },
                  ].map((event, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/50"
                    >
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground">{event.date}</p>
                        <p className="text-xs font-semibold">{event.task}</p>
                      </div>
                      <span className="text-[10px] font-mono bg-secondary/10 text-secondary px-1.5 py-0.5 rounded">
                        {event.time}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Section 3: Recommendation System */}
            <Card className="bg-card border-border border-l-4 border-l-primary shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Smart Irrigation Recommendation
                </CardTitle>
                <CardDescription>Machine Learning Model Output</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center py-6 bg-muted/30 rounded-xl border border-border/50">
                  <span className="text-4xl font-black tracking-tighter text-muted-foreground uppercase">
                    {selectedCrop === "Rice" ? "IRRIGATE NOW" : "SKIP IRRIGATION"}
                  </span>
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedCrop === "Rice"
                      ? "Rice requires high moisture levels"
                      : "Model suggests delaying next cycle"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-border bg-background/50">
                    <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Recommended Vol</p>
                    <p className="text-2xl font-bold">0 Liters</p>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-background/50">
                    <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Next Check</p>
                    <p className="text-2xl font-bold">18:00 PM</p>
                  </div>
                </div>

                <Alert className="bg-primary/5 border-primary/20 text-foreground">
                  <Info className="h-4 w-4 text-primary" />
                  <AlertTitle className="text-primary font-bold">Decision Explanation</AlertTitle>
                  <AlertDescription className="text-xs text-muted-foreground leading-relaxed">
                    Soil moisture in {selectedState} is currently at 42%. {selectedCrop} requires specific moisture
                    thresholds. Weather forecast indicates typical seasonal conditions for {selectedState}.
                  </AlertDescription>
                </Alert>
                <div className="flex gap-4">
                  <Button className="flex-1 bg-primary hover:bg-primary/90 text-background font-bold">
                    Override & Irrigate
                  </Button>
                  <Button variant="outline" className="flex-1 border-border font-bold bg-transparent">
                    View Model Logs
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Section 4: Alerts */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> System Alerts
              </h3>

              <AlertCard
                type="critical"
                title="Potential Pipe Leak"
                desc="Sudden moisture loss detected in Sector 4B without irrigation command."
                time="10 mins ago"
              />
              <AlertCard
                type="warning"
                title="Inefficient Usage"
                desc="High evaporation loss detected between 11:00 AM and 01:00 PM."
                time="2 hours ago"
              />
              <AlertCard
                type="normal"
                title="Sensor Calibration"
                desc="Daily self-check complete. All sensors operating within normal parameters."
                time="Today, 08:15 AM"
              />
            </div>
          </div>

          {/* Section 5: Efficiency Analytics */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Water Efficiency Analytics</CardTitle>
              <CardDescription>Impact on sustainability and resource conservation</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={waterConsumptionData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis
                      dataKey="day"
                      stroke="var(--muted-foreground)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      cursor={{ fill: "var(--accent)", opacity: 0.1 }}
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="usage" name="Before Optimization" fill="var(--muted)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="optimized" name="After Optimization" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent flex items-center justify-center">
                    <span className="text-xl font-bold">35%</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Efficiency Boost</h4>
                    <p className="text-sm text-muted-foreground">
                      Average reduction in water waste across all sectors since implementation.
                    </p>
                  </div>
                </div>
                <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
                  <p className="text-sm italic text-muted-foreground leading-relaxed">
                    "This system has successfully reduced daily water usage by 1,200L on average while maintaining
                    critical soil moisture levels for Maize growth stage."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 6: About Project */}
          <section className="pt-12 border-t border-border">
            <div className="max-w-3xl space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">About Precision Agriculture</h2>
              <p className="text-muted-foreground leading-relaxed">
                Agriculture accounts for 70% of global freshwater withdrawals. Our AI-driven system addresses
                <span className="text-primary font-medium"> SDG 2 (Zero Hunger)</span> and
                <span className="text-secondary font-medium"> SDG 6 (Clean Water & Sanitation)</span>
                by optimizing irrigation cycles through multi-sensor data fusion and predictive modeling.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div>
                  <h4 className="text-xs font-black uppercase text-muted-foreground mb-2">Problem</h4>
                  <p className="text-xs text-muted-foreground">
                    Over-irrigation leads to nutrient leaching and massive water waste, while under-irrigation stunts
                    crop growth.
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-muted-foreground mb-2">Solution</h4>
                  <p className="text-xs text-muted-foreground">
                    ML algorithms process real-time soil, weather, and crop-specific data to deliver precise water
                    quantities.
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-muted-foreground mb-2">Data Sources</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Capacitive Soil Sensors</li>
                    <li>• OpenWeather API</li>
                    <li>• Historical Crop Yields</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>

        <footer className="mt-auto border-t border-border p-8 text-center text-xs text-muted-foreground">
          © 2026 Precision Agriculture Water Management System. Built for Sustainability.
        </footer>
      </div>
    </div>
  )
}

function StatsCard({ title, value, trend, icon, description }: any) {
  return (
    <Card className="bg-card border-border border-b-2 border-b-transparent hover:border-b-primary transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && <p className="text-xs font-medium text-primary mt-1">{trend} from last hour</p>}
        <p className="text-[10px] text-muted-foreground mt-2">{description}</p>
      </CardContent>
    </Card>
  )
}

function AlertCard({ type, title, desc, time }: any) {
  const colors = {
    critical: "border-l-destructive bg-destructive/5",
    warning: "border-l-yellow-500 bg-yellow-500/5",
    normal: "border-l-green-500 bg-green-500/5",
  }

  return (
    <div className={`p-4 rounded-xl border border-border border-l-4 ${colors[type as keyof typeof colors]} space-y-1`}>
      <div className="flex justify-between items-start">
        <h4 className="text-sm font-bold">{title}</h4>
        <span className="text-[10px] text-muted-foreground">{time}</span>
      </div>
      <p className="text-xs text-muted-foreground leading-snug">{desc}</p>
    </div>
  )
}
