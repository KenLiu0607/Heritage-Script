import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { 
  Calendar, 
  Clock, 
  MoreHorizontal, 
  AlertCircle,
  CheckCircle2
} from "lucide-react";

const batches = [
  {
    id: "B-2025-001",
    shed: "A-01",
    breed: "黑羽土雞",
    startDate: "2025-01-10",
    expectedDate: "2025-04-10",
    quantity: 5000,
    currentDay: 65,
    totalDays: 90,
    status: "active",
    health: "good",
    stage: "成長期"
  },
  {
    id: "B-2025-002",
    shed: "A-02",
    breed: "紅羽土雞",
    startDate: "2025-02-15",
    expectedDate: "2025-05-15",
    quantity: 4800,
    currentDay: 29,
    totalDays: 90,
    status: "active",
    health: "warning",
    stage: "育雛期"
  },
  {
    id: "B-2025-003",
    shed: "B-01",
    breed: "白肉雞",
    startDate: "2025-03-01",
    expectedDate: "2025-04-15",
    quantity: 10000,
    currentDay: 15,
    totalDays: 45,
    status: "active",
    health: "good",
    stage: "育雛期"
  },
  {
    id: "B-2024-099",
    shed: "C-01",
    breed: "黑羽土雞",
    startDate: "2024-11-01",
    expectedDate: "2025-02-01",
    quantity: 5000,
    currentDay: 90,
    totalDays: 90,
    status: "completed",
    health: "good",
    stage: "已出貨"
  }
];

export default function Production() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">生產排程</h2>
          <p className="text-muted-foreground">監控各雞舍批次進度與健康狀況</p>
        </div>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          新增批次計畫
        </Button>
      </div>

      <div className="grid gap-6">
        {batches.map((batch) => (
          <Card key={batch.id} className="overflow-hidden border-l-4 border-l-primary hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-start justify-between bg-muted/30 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">{batch.id}</Badge>
                  <span className="font-bold text-lg">{batch.shed} 舍 - {batch.breed}</span>
                  {batch.health === 'warning' && (
                    <Badge variant="destructive" className="ml-2">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      需注意
                    </Badge>
                  )}
                  {batch.status === 'completed' && (
                     <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      已完成
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    入雛: {batch.startDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    預計出貨: {batch.expectedDate}
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-4 gap-6">
                <div className="md:col-span-2 space-y-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-muted-foreground">飼養進度 ({batch.stage})</span>
                    <span className="font-mono font-bold">{batch.currentDay} / {batch.totalDays} 天</span>
                  </div>
                  <Progress value={(batch.currentDay / batch.totalDays) * 100} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>開始</span>
                    <span>預計完成</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">在養數量</span>
                    <div className="text-xl font-bold font-mono">{batch.quantity.toLocaleString()}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">預估重量</span>
                    <div className="text-xl font-bold font-mono">{(batch.currentDay * 0.03 + 0.04).toFixed(2)} kg</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">累積飼料</span>
                    <div className="text-xl font-bold font-mono">{(batch.quantity * batch.currentDay * 0.1 / 1000).toFixed(1)} t</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">存活率</span>
                    <div className={cn("text-xl font-bold font-mono", batch.health === 'warning' ? "text-red-500" : "text-green-600")}>
                      {batch.health === 'warning' ? '94.2%' : '98.5%'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
