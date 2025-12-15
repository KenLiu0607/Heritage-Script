// Domain Layer: 定義核心業務實體 (Entities)
// 這些定義應該與後端 DB Schema 或 API 回傳格式保持一致

export type ProductType = 'frozen' | 'chilled';

export interface ReceiptItem {
  id: number;
  date: string;         // ISO Date string: YYYY-MM-DD
  weightClass: string;  // 重量分級 (e.g., "1.4", "2.2")
  name: string;         // 品名
  type: ProductType;    // 冷凍/冷藏
  boxes: number;        // 箱數
  count: number;        // 隻數
  weight: number;       // 總重量
}

export interface ReceiptSummary {
  totalWeight: number;
  totalBoxes: number;
  totalCount: number;
  frozenWeight: number;
  chilledWeight: number;
  frozenPercentage: number;
  chilledPercentage: number;
}
