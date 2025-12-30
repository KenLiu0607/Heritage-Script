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
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import type { ContractDelivery } from "@shared/schema";
import { read, utils } from "xlsx";
import { cn } from "@/lib/utils";

interface EditableCellProps {
  value: string | number;
  onSave: (value: string) => void;
  type?: "text" | "number";
  precision?: number;
  isInteger?: boolean;
  className?: string;
}

function EditableCell({ value, onSave, type = "text", precision, isInteger, className }: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (tempValue !== String(value)) {
      if (type === "number") {
        const num = parseFloat(tempValue);
        if (isNaN(num)) return;
        if (isInteger && !Number.isInteger(num)) return;
        if (precision !== undefined) {
          const parts = tempValue.split(".");
          if (parts[1] && parts[1].length > precision) return;
        }
      }
      onSave(tempValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBlur();
    } else if (e.key === "Escape") {
      setTempValue(String(value));
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={className}
      />
    );
  }

  return (
    <div 
      onClick={() => setIsEditing(true)} 
      className={cn("cursor-pointer hover:bg-accent/50 px-2 py-1 rounded", className)}
    >
      {value}
    </div>
  );
}

export default function Receiving() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: deliveries = [], isLoading } = useQuery<ContractDelivery[]>({
    queryKey: ['/api/deliveries'],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: any }) => {
      const res = await apiRequest("PATCH", `/api/deliveries/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/deliveries'] });
      toast({ title: "儲存成功" });
    },
    onError: () => {
      toast({ title: "儲存失敗", variant: "destructive" });
    }
  });

  const importMutation = useMutation({
    mutationFn: async (items: any[]) => {
      // Exclude ID to allow DB to generate it
      const sanitizedItems = items.map(({ id, ...rest }) => rest);
      const res = await apiRequest("POST", "/api/deliveries/batch", sanitizedItems);
      return res.json();
    },
    onSuccess: (newItems) => {
      queryClient.invalidateQueries({ queryKey: ['/api/deliveries'] });
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

  const handleUpdate = (id: number, field: string, value: any) => {
    updateMutation.mutate({ id, data: { [field]: value } });
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
        
        const newItems = data.map((row: any) => ({
          freezingType: (row['冷凍別'] || '').includes('冷藏') ? '冷藏' : '冷凍',
          meatName: row['肉品名稱'] || row['品名'] || 'Unknown',
          weightGrade: String(row['重量分布'] || row['規格'] || '0.0'),
          boxCount: Number(row['箱數'] || 0),
          pieceCount: Number(row['隻數'] || 0),
          totalWeight: String(row['重量'] || 0),
          avgWeight: Number(row['隻數']) > 0 ? (Number(row['重量']) / Number(row['隻數'])).toFixed(2) : "0.00"
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

  // Pagination Logic
  const totalPages = Math.ceil(deliveries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = deliveries.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalWeight = deliveries.reduce((acc, d) => acc + parseFloat(String(d.totalWeight)), 0);
  const totalBoxes = deliveries.reduce((acc, d) => acc + d.boxCount, 0);
  const totalPieceCount = deliveries.reduce((acc, d) => acc + d.pieceCount, 0);

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
          <Button variant="default" onClick={() => importMutation.mutate(deliveries)} disabled={importMutation.isPending || deliveries.length === 0}>
             <Plus className="mr-2 h-4 w-4" /> 儲存至資料庫
          </Button>
          <Button variant="outline"><Download className="mr-2 h-4 w-4" /> 匯出報表</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">總進貨重量</CardTitle>
            <Scale className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-primary">{totalWeight.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">kg</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">總箱數 / 隻數</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{totalBoxes} <span className="text-sm font-normal text-muted-foreground">箱</span> / {totalPieceCount} <span className="text-sm font-normal text-muted-foreground">隻</span></div>
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
          </div>
          <Table>
            <TableHeader>
              <TableRow>
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
                  <TableCell>
                    <Select 
                      value={row.freezingType} 
                      onValueChange={(val) => handleUpdate(row.id, "freezingType", val)}
                    >
                      <SelectTrigger className="w-[100px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="冷凍">冷凍</SelectItem>
                        <SelectItem value="冷藏">冷藏</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <EditableCell 
                      value={row.meatName} 
                      onSave={(val) => handleUpdate(row.id, "meatName", val)} 
                    />
                  </TableCell>
                  <TableCell>
                    <EditableCell 
                      value={row.weightGrade} 
                      type="number"
                      precision={1}
                      onSave={(val) => handleUpdate(row.id, "weightGrade", val)} 
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <EditableCell 
                      value={row.boxCount} 
                      type="number"
                      isInteger
                      onSave={(val) => handleUpdate(row.id, "boxCount", parseInt(val))} 
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <EditableCell 
                      value={row.pieceCount} 
                      type="number"
                      isInteger
                      onSave={(val) => handleUpdate(row.id, "pieceCount", parseInt(val))} 
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <EditableCell 
                      value={row.totalWeight} 
                      type="number"
                      precision={2}
                      onSave={(val) => handleUpdate(row.id, "totalWeight", val)} 
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <EditableCell 
                      value={row.avgWeight} 
                      type="number"
                      precision={2}
                      onSave={(val) => handleUpdate(row.id, "avgWeight", val)} 
                    />
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
