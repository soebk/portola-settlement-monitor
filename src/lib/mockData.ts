export type TransactionStatus = "Pending" | "Cleared" | "Failed";

export interface Transaction {
  id: string;
  clientName: string;
  amount: number;
  status: TransactionStatus;
  timestamp: string;
}

export const HIGH_VALUE_THRESHOLD = 10000;

export const mockTransactions: Transaction[] = [
  { id: "TXN-001", clientName: "Sarah Chen", amount: 250.00, status: "Cleared", timestamp: "2025-02-05T09:12:33Z" },
  { id: "TXN-002", clientName: "Marcus Rivera", amount: 1200.50, status: "Cleared", timestamp: "2025-02-05T09:15:01Z" },
  { id: "TXN-003", clientName: "Priya Patel", amount: 75.00, status: "Pending", timestamp: "2025-02-05T09:22:47Z" },
  { id: "TXN-004", clientName: "James O'Brien", amount: 5000.00, status: "Cleared", timestamp: "2025-02-05T09:30:12Z" },
  { id: "TXN-005", clientName: "Lumen Digital Holdings", amount: 12500.00, status: "Pending", timestamp: "2025-02-05T09:31:55Z" },
  { id: "TXN-006", clientName: "Aisha Mohammed", amount: 340.75, status: "Failed", timestamp: "2025-02-05T09:33:20Z" },
  { id: "TXN-007", clientName: "David Kim", amount: 890.00, status: "Cleared", timestamp: "2025-02-05T09:40:08Z" },
  { id: "TXN-008", clientName: "Rachel Torres", amount: 2150.00, status: "Cleared", timestamp: "2025-02-05T09:42:33Z" },
  { id: "TXN-009", clientName: "Alex Nguyen", amount: 125.25, status: "Pending", timestamp: "2025-02-05T09:50:17Z" },
  { id: "TXN-010", clientName: "Crescent Bay Ventures", amount: 9999.99, status: "Cleared", timestamp: "2025-02-05T09:55:44Z" },
  { id: "TXN-011", clientName: "Olivia Martinez", amount: 3200.00, status: "Pending", timestamp: "2025-02-05T10:01:12Z" },
  { id: "TXN-012", clientName: "Tom Bradley", amount: 450.00, status: "Cleared", timestamp: "2025-02-05T10:05:30Z" },
  { id: "TXN-013", clientName: "Apex Clearing Solutions", amount: 15750.00, status: "Failed", timestamp: "2025-02-05T10:08:45Z" },
  { id: "TXN-014", clientName: "Nina Kowalski", amount: 80.00, status: "Cleared", timestamp: "2025-02-05T10:12:20Z" },
  { id: "TXN-015", clientName: "Sarah Chen", amount: 1600.00, status: "Cleared", timestamp: "2025-02-05T10:15:55Z" },
  { id: "TXN-016", clientName: "Jordan Hayes", amount: 725.50, status: "Pending", timestamp: "2025-02-05T10:20:33Z" },
  { id: "TXN-017", clientName: "Redstone Treasury LLC", amount: 28000.00, status: "Cleared", timestamp: "2025-02-05T10:25:18Z" },
  { id: "TXN-018", clientName: "Marcus Rivera", amount: 190.00, status: "Failed", timestamp: "2025-02-05T10:28:02Z" },
  { id: "TXN-019", clientName: "Emily Watson", amount: 950.75, status: "Cleared", timestamp: "2025-02-05T10:33:41Z" },
  { id: "TXN-020", clientName: "Chris Nakamura", amount: 2800.00, status: "Pending", timestamp: "2025-02-05T10:38:15Z" },
  { id: "TXN-021", clientName: "Priya Patel", amount: 410.00, status: "Cleared", timestamp: "2025-02-05T10:42:50Z" },
  { id: "TXN-022", clientName: "Harborview Capital", amount: 11200.00, status: "Cleared", timestamp: "2025-02-05T10:45:22Z" },
  { id: "TXN-023", clientName: "Daniel Okafor", amount: 175.25, status: "Pending", timestamp: "2025-02-05T10:50:08Z" },
  { id: "TXN-024", clientName: "Lisa Chang", amount: 3100.00, status: "Failed", timestamp: "2025-02-05T10:55:33Z" },
  { id: "TXN-025", clientName: "Ryan Murphy", amount: 560.00, status: "Cleared", timestamp: "2025-02-05T11:00:15Z" },
  { id: "TXN-026", clientName: "Cascade Payments Inc", amount: 18400.00, status: "Pending", timestamp: "2025-02-05T11:05:42Z" },
  { id: "TXN-027", clientName: "Sofia Reyes", amount: 95.50, status: "Cleared", timestamp: "2025-02-05T11:10:20Z" },
  { id: "TXN-028", clientName: "Michael Foster", amount: 4200.00, status: "Cleared", timestamp: "2025-02-05T11:15:55Z" },
  { id: "TXN-029", clientName: "Aisha Mohammed", amount: 10000.01, status: "Failed", timestamp: "2025-02-05T11:18:30Z" },
  { id: "TXN-030", clientName: "Kevin Park", amount: 675.00, status: "Cleared", timestamp: "2025-02-05T11:22:45Z" },
  { id: "TXN-031", clientName: "Hannah Liu", amount: 1850.00, status: "Pending", timestamp: "2025-02-05T11:28:12Z" },
  { id: "TXN-032", clientName: "James O'Brien", amount: 320.00, status: "Cleared", timestamp: "2025-02-05T11:32:08Z" },
  { id: "TXN-033", clientName: "Tidewater Compliance Ltd", amount: 22100.00, status: "Cleared", timestamp: "2025-02-05T11:35:40Z" },
  { id: "TXN-034", clientName: "Zara Hussain", amount: 1450.00, status: "Pending", timestamp: "2025-02-05T11:40:22Z" },
  { id: "TXN-035", clientName: "Ben Carter", amount: 55.00, status: "Failed", timestamp: "2025-02-05T11:43:55Z" },
  { id: "TXN-036", clientName: "Alex Nguyen", amount: 2700.00, status: "Cleared", timestamp: "2025-02-05T11:48:30Z" },
  { id: "TXN-037", clientName: "Pinnacle Reserve Fund", amount: 45000.00, status: "Pending", timestamp: "2025-02-05T11:52:18Z" },
  { id: "TXN-038", clientName: "Megan Clark", amount: 380.00, status: "Cleared", timestamp: "2025-02-05T11:55:45Z" },
  { id: "TXN-039", clientName: "David Kim", amount: 1125.75, status: "Cleared", timestamp: "2025-02-05T12:00:12Z" },
  { id: "TXN-040", clientName: "Sarah Chen", amount: 6500.00, status: "Failed", timestamp: "2025-02-05T12:05:33Z" },
  { id: "TXN-041", clientName: "Tyler Washington", amount: 210.00, status: "Cleared", timestamp: "2025-02-05T12:10:20Z" },
  { id: "TXN-042", clientName: "Lumen Digital Holdings", amount: 13800.00, status: "Pending", timestamp: "2025-02-05T12:15:08Z" },
  { id: "TXN-043", clientName: "Olivia Martinez", amount: 775.00, status: "Cleared", timestamp: "2025-02-05T12:18:42Z" },
  { id: "TXN-044", clientName: "Sam Delgado", amount: 1100.00, status: "Cleared", timestamp: "2025-02-05T12:22:55Z" },
  { id: "TXN-045", clientName: "Rachel Torres", amount: 4800.00, status: "Pending", timestamp: "2025-02-05T12:28:30Z" },
  { id: "TXN-046", clientName: "Chris Nakamura", amount: 150.50, status: "Failed", timestamp: "2025-02-05T12:32:15Z" },
  { id: "TXN-047", clientName: "Apex Clearing Solutions", amount: 10250.00, status: "Cleared", timestamp: "2025-02-05T12:35:48Z" },
  { id: "TXN-048", clientName: "Jordan Hayes", amount: 625.25, status: "Pending", timestamp: "2025-02-05T12:40:22Z" },
  { id: "TXN-049", clientName: "Emily Watson", amount: 3400.00, status: "Cleared", timestamp: "2025-02-05T12:45:10Z" },
  { id: "TXN-050", clientName: "Tom Bradley", amount: 890.00, status: "Cleared", timestamp: "2025-02-05T12:50:33Z" },
];
