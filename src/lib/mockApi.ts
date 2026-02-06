import { Transaction } from "./mockData";

export async function clearFunds(transactionId: string): Promise<{ success: boolean }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1500);
  });
}

const STREAM_CLIENTS = [
  "Sarah Chen", "Marcus Rivera", "Priya Patel", "James O'Brien",
  "Aisha Mohammed", "David Kim", "Rachel Torres", "Alex Nguyen",
  "Olivia Martinez", "Tom Bradley", "Nina Kowalski", "Jordan Hayes",
  "Emily Watson", "Chris Nakamura", "Daniel Okafor", "Lisa Chang",
  "Ryan Murphy", "Sofia Reyes", "Michael Foster", "Kevin Park",
  "Hannah Liu", "Zara Hussain", "Ben Carter", "Tyler Washington",
  "Sam Delgado", "Megan Clark",
  "Lumen Digital Holdings", "Apex Clearing Solutions",
  "Cascade Payments Inc", "Pinnacle Reserve Fund",
  "Redstone Treasury LLC", "Harborview Capital",
  "Tidewater Compliance Ltd", "Crescent Bay Ventures",
];

export function generateTransaction(counter: number): Transaction {
  const clientName = STREAM_CLIENTS[Math.floor(Math.random() * STREAM_CLIENTS.length)];

  const rand = Math.random();
  let amount: number;
  if (rand < 0.6) {
    amount = Math.round((50 + Math.random() * 2000) * 100) / 100;
  } else if (rand < 0.85) {
    amount = Math.round((2000 + Math.random() * 8000) * 100) / 100;
  } else {
    amount = Math.round((10000 + Math.random() * 40000) * 100) / 100;
  }

  return {
    id: `TXN-${String(counter).padStart(3, "0")}`,
    clientName,
    amount,
    status: "Pending",
    timestamp: new Date().toISOString(),
  };
}
