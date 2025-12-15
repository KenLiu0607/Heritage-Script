import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Upload, 
  Snowflake, 
  ThermometerSun,
  Scale,
  Package,
  Bird,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";
import { read, utils } from "xlsx";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data based on the user's Excel image
const initialReceipts = [
  { id: 1, date: "2025/12/01", weightClass: "1.4", name: "古早公全雞-1.4(套袋)", type: "frozen", boxes: 3, count: 30, weight: 44.41 },
  { id: 2, date: "2025/12/01", weightClass: "2.4", name: "古早公全雞-2.4(套袋)", type: "frozen", boxes: 128, count: 768, weight: 1933.32 },
  { id: 3, date: "2025/12/01", weightClass: "2.6", name: "古早公全雞-2.6(套袋)", type: "frozen", boxes: 37, count: 222, weight: 600.84 },
  { id: 4, date: "2025/12/01", weightClass: "2.8", name: "古早公全雞-2.8(套袋)", type: "frozen", boxes: 4, count: 24, weight: 69.24 },
  { id: 5, date: "2025/12/01", weightClass: "3.0", name: "古早公全雞-3.0(套袋)", type: "frozen", boxes: 1, count: 5, weight: 15.40 },
  { id: 6, date: "2025/12/01", weightClass: "1.5", name: "古早母全雞-1.5(套袋)", type: "chilled", boxes: 9, count: 90, weight: 139.61 },
  { id: 7, date: "2025/12/01", weightClass: "1.6", name: "古早母全雞-1.6(套袋)", type: "chilled", boxes: 13, count: 130, weight: 214.85 },
  { id: 8, date: "2025/12/01", weightClass: "1.7", name: "古早母全雞-1.7(套袋)", type: "chilled", boxes: 21, count: 210, weight: 367.58 },
  { id: 9, date: "2025/12/01", weightClass: "1.8", name: "古早母全雞-1.8(套袋)", type: "chilled", boxes: 34, count: 340, weight: 629.27 },
  { id: 10, date: "2025/12/01", weightClass: "1.9", name: "古早母全雞-1.9(套袋)", type: "chilled", boxes: 47, count: 470, weight: 917.13 },
  { id: 11, date: "2025/12/01", weightClass: "2.0", name: "古早母全雞-2.0(套袋)", type: "chilled", boxes: 139, count: 1390, weight: 2930.94 },
  { id: 12, date: "2025/12/01", weightClass: "2.2", name: "古早母全雞-2.2(套袋)", type: "chilled", boxes: 142, count: 1420, weight: 3254.61 },
];

export default function Receiving() {
  const [receipts, setReceipts] = useState(initialReceipts);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const totalWeight = receipts.reduce((acc, curr) => acc + curr.weight, 0);
  const totalBoxes = receipts.reduce((acc, curr) => acc + curr.boxes, 0);
  const totalCount = receipts.reduce((acc, curr) => acc + curr.count, 0);
  
  const frozenWeight = receipts.filter(r => r.type === 'frozen').reduce((acc, curr) => acc + curr.weight, 0);
  const chilledWeight = receipts.filter(r => r.type === 'chilled').reduce((acc, curr) => acc + curr.weight, 0);

  // Pagination Logic
  const totalPages = Math.ceil(receipts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = receipts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = utils.sheet_to_json(ws);
        
        // Helper to format date
        const formatDate = (val: any) => {
          if (!val) return new Date().toISOString().split('T')[0];
          // Handle Excel serial date (number)
          if (typeof val === 'number') {
            // Excel base date is 1900-01-01, but there is a leap year bug in 1900
            // JS base is 1970-01-01.
            // 25569 is days between 1900-01-01 and 1970-01-01
            const date = new Date((val - 25569) * 86400 * 1000);
            return date.toISOString().split('T')[0].replace(/-/g, '/');
          }
          // Handle string date
          return String(val);
        };

        // Map Excel columns to our data structure
        // Assuming Excel headers: 生產日期, 重量分布, 肉品名稱, 冷凍別, 箱數, 隻數, 重量
        const newReceipts = data.map((row: any, index: number) => ({
          id: Date.now() + index,
          date: formatDate(row['生產日期']),
          weightClass: String(row['重量分布'] || row['規格'] || '0.0'),
          name: row['肉品名稱'] || row['品名'] || 'Unknown',
          type: (row['冷凍別'] || '').includes('冷藏') ? 'chilled' : 'frozen',
          boxes: Number(row['箱數'] || 0),
          count: Number(row['隻數'] || 0),
          weight: Number(row['重量'] || 0)
        }));

        if (newReceipts.length > 0) {
          setReceipts(prev => [...newReceipts, ...prev]);
          setCurrentPage(1); // Reset to first page on new upload
          toast({
            title: "匯入成功",
            description: `已成功匯入 ${newReceipts.length} 筆資料`,
          });
        }
      } catch (error) {
        console.error("Error parsing excel:", error);
        toast({
          title: "匯入失敗",
          description: "檔案格式錯誤或無法讀取",
          variant: "destructive"
        });
      }
    };
    reader.readAsBinaryString(file);
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">契作交貨管理</h2>
          <p className="text-muted-foreground">進貨驗收、規格分級與入庫紀錄</p>
        </div>
        <div className="flex gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept=".xlsx,.xls,.csv"
          />
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            匯入 Excel
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            匯出報表
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新增驗收單
          </Button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">總進貨重量</CardTitle>
            <Scale className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-primary">{totalWeight.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="text-sm font-normal text-muted-foreground">kg</span></div>
            <p className="text-xs text-muted-foreground mt-1">本批次總計</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">總箱數 / 隻數</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{totalBoxes} <span className="text-sm font-normal text-muted-foreground">箱</span> / {totalCount.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">隻</span></div>
            <p className="text-xs text-muted-foreground mt-1">平均每箱 {Math.round(totalCount/totalBoxes)} 隻</p>
          </CardContent>
        </Card>

        <Card className="bg-sky-50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-sky-700 dark:text-sky-400">冷凍品佔比</CardTitle>
            <Snowflake className="h-4 w-4 text-sky-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-sky-700 dark:text-sky-400">
              {Math.round((frozenWeight / totalWeight) * 100)}%
            </div>
            <p className="text-xs text-sky-600/80 dark:text-sky-400/70 mt-1">
              {frozenWeight.toLocaleString(undefined, { maximumFractionDigits: 0 })} kg
            </p>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-400">冷藏品佔比</CardTitle>
            <ThermometerSun className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400">
              {Math.round((chilledWeight / totalWeight) * 100)}%
            </div>
            <p className="text-xs text-emerald-600/80 dark:text-emerald-400/70 mt-1">
              {chilledWeight.toLocaleString(undefined, { maximumFractionDigits: 0 })} kg
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b border-border flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="搜尋肉品名稱、規格..." className="pl-8" />
            </div>
            <div className="ml-auto flex gap-2">
              <Button variant="outline" size="sm" className="h-8 border-dashed">
                <Filter className="mr-2 h-3 w-3" />
                規格篩選
              </Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">生產日期</TableHead>
                <TableHead>冷凍別</TableHead>
                <TableHead>肉品名稱</TableHead>
                <TableHead>重量分級</TableHead>
                <TableHead className="text-right">箱數</TableHead>
                <TableHead className="text-right">隻數</TableHead>
                <TableHead className="text-right">總重量 (kg)</TableHead>
                <TableHead className="text-right">平均單隻重 (kg)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-mono text-muted-foreground">{row.date}</TableCell>
                  <TableCell>
                    {row.type === 'frozen' ? (
                      <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100 flex w-fit items-center gap-1">
                        <Snowflake className="w-3 h-3" />
                        冷凍
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 flex w-fit items-center gap-1">
                        <ThermometerSun className="w-3 h-3" />
                        冷藏
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono">{row.weightClass}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">{row.boxes}</TableCell>
                  <TableCell className="text-right font-mono">{row.count}</TableCell>
                  <TableCell className="text-right font-mono font-bold">{row.weight.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">
                    {(row.weight / row.count).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-4 py-4 border-t border-border">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">每頁顯示</span>
              <Select 
                value={String(itemsPerPage)} 
                onValueChange={(val) => {
                  setItemsPerPage(Number(val));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[70px] h-8">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">筆，共 {receipts.length} 筆</span>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[3rem] text-center">
                {currentPage} / {totalPages || 1}
              </span>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
