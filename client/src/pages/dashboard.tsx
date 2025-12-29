import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Users,
  Package,
  DollarSign,
  Activity,
  ShoppingCart,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const data = [
  { name: "1月", production: 4000, sales: 2400 },
  { name: "2月", production: 3000, sales: 1398 },
  { name: "3月", production: 2000, sales: 9800 },
  { name: "4月", production: 2780, sales: 3908 },
  { name: "5月", production: 1890, sales: 4800 },
  { name: "6月", production: 2390, sales: 3800 },
  { name: "7月", production: 3490, sales: 4300 },
];

const fcrData = [
  { batch: "B-001", fcr: 1.5 },
  { batch: "B-002", fcr: 1.45 },
  { batch: "B-003", fcr: 1.6 },
  { batch: "B-004", fcr: 1.48 },
  { batch: "B-005", fcr: 1.52 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              總產量 (本月)
            </CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              12,345{" "}
              <span className="text-sm font-normal text-muted-foreground">
                kg
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2.5% 較上月
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              總銷售額
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">$45,231</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +10.1% 較上月
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              存活率 (平均)
            </CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">96.8%</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center text-red-500">
              <TrendingDown className="h-3 w-3 mr-1" />
              -0.2% 較上批
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              庫存預警
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-amber-600">
              3 項
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              飼料 A, 疫苗 B, 包材 C
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>產銷趨勢分析</CardTitle>
            <CardDescription>過去 7 個月的生產量與銷售量對比</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--chart-2))"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--chart-2))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                    itemStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <Area
                    type="monotone"
                    dataKey="production"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorProd)"
                    name="生產量"
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="hsl(var(--chart-2))"
                    fillOpacity={1}
                    fill="url(#colorSales)"
                    name="銷售量"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>飼料轉換率 (FCR)</CardTitle>
            <CardDescription>近期批次效率監控</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={fcrData}
                  layout="vertical"
                  margin={{ top: 0, right: 30, left: 20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis type="number" domain={[0, 2]} hide />
                  <YAxis
                    dataKey="batch"
                    type="category"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={50}
                  />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted))" }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Bar
                    dataKey="fcr"
                    fill="hsl(var(--primary))"
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                    name="FCR"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>標準 FCR 目標：1.5 以下</p>
              <p>目前平均：1.51</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>待辦事項</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {[
                { text: "審核 B-006 批次飼料採購單", urgent: true },
                { text: "確認 C 客戶下週訂單需求", urgent: false },
                { text: "安排 3 號舍疫苗接種", urgent: true },
                { text: "更新月度財務報表", urgent: false },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      item.urgent ? "bg-red-500" : "bg-blue-500",
                    )}
                  />
                  <span className={cn(item.urgent && "font-medium")}>
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>系統公告</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="p-3 bg-muted rounded-md border border-border">
                <p className="font-medium text-foreground mb-1">系統維護通知</p>
                <p>
                  系統將於本週日凌晨 2:00 進行例行維護，預計暫停服務 2 小時。
                </p>
              </div>
              <div className="p-3 bg-muted rounded-md border border-border">
                <p className="font-medium text-foreground mb-1">新功能上線</p>
                <p>「智能排程優化」模組已上線，請至設定頁面開啟試用。</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>快速操作</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Package className="h-5 w-5" />
              新增批次
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <ShoppingCart className="h-5 w-5" />
              建立訂單
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <DollarSign className="h-5 w-5" />
              紀錄支出
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Activity className="h-5 w-5" />
              異常回報
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
