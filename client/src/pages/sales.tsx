import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Search, Filter, Plus, FileText, Truck, MoreHorizontal } from "lucide-react";

const sales = [
  { id: "SO-2025-089", client: "好食超市 (BestMart)", date: "2025-03-15", items: "黑羽土雞 (整雞)", quantity: 200, amount: 85000, status: "pending", delivery: "2025-03-20" },
  { id: "SO-2025-088", client: "美味餐廳集團", date: "2025-03-14", items: "白肉雞 (分切)", quantity: 500, amount: 62000, status: "processing", delivery: "2025-03-18" },
  { id: "SO-2025-087", client: "傳統市場批發商 A", date: "2025-03-14", items: "紅羽土雞", quantity: 300, amount: 105000, status: "shipped", delivery: "2025-03-15" },
  { id: "SO-2025-086", client: "有機食品店", date: "2025-03-13", items: "黑羽土雞", quantity: 50, amount: 25000, status: "delivered", delivery: "2025-03-14" },
  { id: "SO-2025-085", client: "好食超市 (BestMart)", date: "2025-03-10", items: "黑羽土雞", quantity: 150, amount: 63750, status: "delivered", delivery: "2025-03-12" },
];

export default function Sales() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">銷售訂單</h2>
          <p className="text-muted-foreground">訂單處理與出貨追蹤</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            匯出報表
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            建立訂單
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
         <Card>
           <CardContent className="pt-6">
             <div className="text-2xl font-bold font-mono text-primary">12</div>
             <p className="text-xs text-muted-foreground font-medium uppercase mt-1">待處理訂單</p>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="pt-6">
             <div className="text-2xl font-bold font-mono text-amber-600">5</div>
             <p className="text-xs text-muted-foreground font-medium uppercase mt-1">今日預計出貨</p>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="pt-6">
             <div className="text-2xl font-bold font-mono text-green-600">$1,245,000</div>
             <p className="text-xs text-muted-foreground font-medium uppercase mt-1">本月營收</p>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="pt-6">
             <div className="text-2xl font-bold font-mono">3.2 天</div>
             <p className="text-xs text-muted-foreground font-medium uppercase mt-1">平均交貨期</p>
           </CardContent>
         </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b border-border flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="搜尋訂單、客戶..." className="pl-8" />
            </div>
            <div className="ml-auto flex gap-2">
              <Button variant="outline" size="sm" className="h-8 border-dashed">
                <Filter className="mr-2 h-3 w-3" />
                狀態篩選
              </Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">訂單編號</TableHead>
                <TableHead>客戶名稱</TableHead>
                <TableHead>訂購日期</TableHead>
                <TableHead>品項</TableHead>
                <TableHead className="text-right">數量</TableHead>
                <TableHead className="text-right">金額</TableHead>
                <TableHead>預計出貨</TableHead>
                <TableHead className="text-center">狀態</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-muted-foreground">{order.id}</TableCell>
                  <TableCell className="font-medium">{order.client}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{order.date}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell className="text-right font-mono">{order.quantity}</TableCell>
                  <TableCell className="text-right font-mono">${order.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-sm">{order.delivery}</TableCell>
                  <TableCell className="text-center">
                    {order.status === 'pending' && <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">待確認</Badge>}
                    {order.status === 'processing' && <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">處理中</Badge>}
                    {order.status === 'shipped' && <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">運送中</Badge>}
                    {order.status === 'delivered' && <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">已送達</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
