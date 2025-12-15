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
import { receivingService } from "@/services/receivingService";
import { ReceiptItem } from "@/types/domain";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  ChevronsRight,
  Loader2
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

export default function Receiving() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // 1. 使用 Service Layer 獲取資料
  const { data: receipts = [], isLoading } = useQuery({
    queryKey: ['receipts'],
    queryFn: receivingService.getAll
  });

  // 2. 商業邏輯運算 (Summary)
  const summary = receivingService.calculateSummary(receipts);

  // 3. Mutation: 處理匯入
  const importMutation = useMutation({
    mutationFn: receivingService.importBatch,
    onSuccess: (newItems) => {
      queryClient.setQueryData(['receipts'], (old: ReceiptItem[] = []) => [...newItems, ...old]);
      setCurrentPage(1);
      toast({
        title: "匯入成功",
        description: `已成功匯入 ${newItems.length} 筆資料`,
      });
    },
    onError: () => {
      toast({
        title: "匯入失敗",
        description: "資料處理發生錯誤",
        variant: "destructive"
      });
    }
  });

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
          if (typeof val === 'number') {
            const date = new Date((val - 25569) * 86400 * 1000);
            return date.toISOString().split('T')[0].replace(/-/g, '/');
          }
          return String(val);
        };

        const newItems: Omit<ReceiptItem, 'id'>[] = data.map((row: any) => ({
          date: formatDate(row['生產日期']),
          weightClass: String(row['重量分布'] || row['規格'] || '0.0'),
          name: row['肉品名稱'] || row['品名'] || 'Unknown',
          type: (row['冷凍別'] || '').includes('冷藏') ? 'chilled' : 'frozen',
          boxes: Number(row['箱數'] || 0),
          count: Number(row['隻數'] || 0),
          weight: Number(row['重量'] || 0)
        }));

        if (newItems.length > 0) {
          importMutation.mutate(newItems);
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={importMutation.isPending}>
            {importMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
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
            <div className="text-2xl font-bold font-mono text-primary">{summary.totalWeight.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="text-sm font-normal text-muted-foreground">kg</span></div>
            <p className="text-xs text-muted-foreground mt-1">本批次總計</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">總箱數 / 隻數</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{summary.totalBoxes} <span className="text-sm font-normal text-muted-foreground">箱</span> / {summary.totalCount.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">隻</span></div>
            <p className="text-xs text-muted-foreground mt-1">
              平均每箱 {summary.totalBoxes > 0 ? Math.round(summary.totalCount/summary.totalBoxes) : 0} 隻
            </p>
          </CardContent>
        </Card>

        <Card className="bg-sky-50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-sky-700 dark:text-sky-400">冷凍品佔比</CardTitle>
            <Snowflake className="h-4 w-4 text-sky-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-sky-700 dark:text-sky-400">
              {summary.frozenPercentage}%
            </div>
            <p className="text-xs text-sky-600/80 dark:text-sky-400/70 mt-1">
              {summary.frozenWeight.toLocaleString(undefined, { maximumFractionDigits: 0 })} kg
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
              {summary.chilledPercentage}%
            </div>
            <p className="text-xs text-emerald-600/80 dark:text-emerald-400/70 mt-1">
              {summary.chilledWeight.toLocaleString(undefined, { maximumFractionDigits: 0 })} kg
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
                    {row.count > 0 ? (row.weight / row.count).toFixed(2) : "0.00"}
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
