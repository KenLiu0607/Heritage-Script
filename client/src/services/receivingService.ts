import { ReceiptItem, ReceiptSummary } from "@/types/domain";

// Service Layer: 負責資料的 CRUD 與商業邏輯運算
// 目前使用 Mock Data 模擬後端行為，未來可直接替換為 fetch/axios 呼叫

// 模擬資料庫
let mockReceipts: ReceiptItem[] = [
  {
    id: 1,
    date: "2025/12/01",
    weightClass: "1.4",
    name: "古早公全雞-1.4(套袋)",
    type: "frozen",
    boxes: 3,
    count: 30,
    weight: 44.41,
  },
  {
    id: 2,
    date: "2025/12/01",
    weightClass: "2.4",
    name: "古早公全雞-2.4(套袋)",
    type: "frozen",
    boxes: 128,
    count: 768,
    weight: 1933.32,
  },
  {
    id: 3,
    date: "2025/12/01",
    weightClass: "2.6",
    name: "古早公全雞-2.6(套袋)",
    type: "frozen",
    boxes: 37,
    count: 222,
    weight: 600.84,
  },
  {
    id: 4,
    date: "2025/12/01",
    weightClass: "2.8",
    name: "古早公全雞-2.8(套袋)",
    type: "frozen",
    boxes: 4,
    count: 24,
    weight: 69.24,
  },
  {
    id: 5,
    date: "2025/12/01",
    weightClass: "3.0",
    name: "古早公全雞-3.0(套袋)",
    type: "frozen",
    boxes: 1,
    count: 5,
    weight: 15.4,
  },
  {
    id: 6,
    date: "2025/12/01",
    weightClass: "1.5",
    name: "古早母全雞-1.5(套袋)",
    type: "chilled",
    boxes: 9,
    count: 90,
    weight: 139.61,
  },
  {
    id: 7,
    date: "2025/12/01",
    weightClass: "1.6",
    name: "古早母全雞-1.6(套袋)",
    type: "chilled",
    boxes: 13,
    count: 130,
    weight: 214.85,
  },
  {
    id: 8,
    date: "2025/12/01",
    weightClass: "1.7",
    name: "古早母全雞-1.7(套袋)",
    type: "chilled",
    boxes: 21,
    count: 210,
    weight: 367.58,
  },
  {
    id: 9,
    date: "2025/12/01",
    weightClass: "1.8",
    name: "古早母全雞-1.8(套袋)",
    type: "chilled",
    boxes: 34,
    count: 340,
    weight: 629.27,
  },
  {
    id: 10,
    date: "2025/12/01",
    weightClass: "1.9",
    name: "古早母全雞-1.9(套袋)",
    type: "chilled",
    boxes: 47,
    count: 470,
    weight: 917.13,
  },
  {
    id: 11,
    date: "2025/12/01",
    weightClass: "2.0",
    name: "古早母全雞-2.0(套袋)",
    type: "chilled",
    boxes: 139,
    count: 1390,
    weight: 2930.94,
  },
  {
    id: 12,
    date: "2025/12/01",
    weightClass: "2.2",
    name: "古早母全雞-2.2(套袋)",
    type: "chilled",
    boxes: 142,
    count: 1420,
    weight: 3254.61,
  },
];

export const receivingService = {
  // 模擬 API: 獲取所有驗收單
  async getAll(): Promise<ReceiptItem[]> {
    // 模擬網路延遲
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...mockReceipts];
  },

  // 模擬 API: 批次匯入
  async importBatch(items: Omit<ReceiptItem, "id">[]): Promise<ReceiptItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newItems = items.map((item, index) => ({
      ...item,
      id: Date.now() + index,
    }));

    mockReceipts = [...newItems, ...mockReceipts];
    return newItems;
  },

  // 商業邏輯: 計算統計數據 (這部分邏輯未來可移至後端，或保留在前端作為 View Model 計算)
  calculateSummary(items: ReceiptItem[]): ReceiptSummary {
    const totalWeight = items.reduce((acc, curr) => acc + curr.weight, 0);
    const totalBoxes = items.reduce((acc, curr) => acc + curr.boxes, 0);
    const totalCount = items.reduce((acc, curr) => acc + curr.count, 0);

    const frozenWeight = items
      .filter((r) => r.type === "frozen")
      .reduce((acc, curr) => acc + curr.weight, 0);
    const chilledWeight = items
      .filter((r) => r.type === "chilled")
      .reduce((acc, curr) => acc + curr.weight, 0);

    return {
      totalWeight,
      totalBoxes,
      totalCount,
      frozenWeight,
      chilledWeight,
      frozenPercentage:
        totalWeight > 0 ? Math.round((frozenWeight / totalWeight) * 100) : 0,
      chilledPercentage:
        totalWeight > 0 ? Math.round((chilledWeight / totalWeight) * 100) : 0,
    };
  },
};
