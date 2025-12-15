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
import { Search, Filter, Plus, AlertTriangle } from "lucide-react";

const inventory = [
  { id: "INV-001", name: "生長飼料 A (Growth Feed A)", category: "飼料", quantity: 12500, unit: "kg", minLevel: 5000, status: "normal", location: "倉庫 A" },
  { id: "INV-002", name: "育雛飼料 B (Starter Feed B)", category: "飼料", quantity: 800, unit: "kg", minLevel: 2000, status: "low", location: "倉庫 A" },
  { id: "INV-003", name: "疫苗 ND+IB", category: "藥品", quantity: 50, unit: "btl", minLevel: 20, status: "normal", location: "冷藏室" },
  { id: "INV-004", name: "抗生素 (Amoxicillin)", category: "藥品", quantity: 12, unit: "kg", minLevel: 10, status: "warning", location: "藥品櫃" },
  { id: "INV-005", name: "墊料 (粗糠)", category: "耗材", quantity: 500, unit: "bag", minLevel: 100, status: "normal", location: "倉庫 B" },
  { id: "INV-006", name: "維生素補充劑", category: "營養品", quantity: 200, unit: "btl", minLevel: 50, status: "normal", location: "藥品櫃" },
];

export default function Inventory() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">庫存管理</h2>
          <p className="text-muted-foreground">資材、飼料與藥品監控</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            篩選
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            入庫作業
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2 bg-card p-2 rounded-md border border-border shadow-sm">
        <Search className="w-5 h-5 text-muted-foreground ml-2" />
        <Input 
          placeholder="搜尋品項名稱、編號..." 
          className="border-0 focus-visible:ring-0 shadow-none bg-transparent"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">編號</TableHead>
                <TableHead>品項名稱</TableHead>
                <TableHead>類別</TableHead>
                <TableHead className="text-right">現有庫存</TableHead>
                <TableHead className="text-right">安全庫存</TableHead>
                <TableHead>儲位</TableHead>
                <TableHead className="text-center">狀態</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-muted-foreground">{item.id}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">{item.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold">
                    {item.quantity.toLocaleString()} <span className="text-xs text-muted-foreground font-normal">{item.unit}</span>
                  </TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">
                    {item.minLevel.toLocaleString()}
                  </TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell className="text-center">
                    {item.status === 'low' ? (
                      <Badge variant="destructive" className="flex w-fit mx-auto items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        庫存過低
                      </Badge>
                    ) : item.status === 'warning' ? (
                      <Badge variant="outline" className="border-amber-500 text-amber-600 flex w-fit mx-auto items-center gap-1 bg-amber-50">
                        <AlertTriangle className="w-3 h-3" />
                        接近下限
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">正常</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">詳情</Button>
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
