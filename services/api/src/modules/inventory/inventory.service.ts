export type InventoryRecord = {
  productId: string;
  available: number;
  reserved: number;
};

const inventory = new Map<string, InventoryRecord>([
  ["prod-66", { productId: "prod-66", available: 18, reserved: 0 }],
  ["prod-65", { productId: "prod-65", available: 3, reserved: 0 }],
  ["prod-64", { productId: "prod-64", available: 12, reserved: 0 }],
]);

const locks = new Map<string, Promise<void>>();

async function withLock<T>(key: string, work: () => Promise<T>): Promise<T> {
  const previous = locks.get(key) ?? Promise.resolve();
  let release!: () => void;
  const current = new Promise<void>((resolve) => {
    release = resolve;
  });
  locks.set(
    key,
    previous.then(() => current),
  );
  await previous;
  try {
    return await work();
  } finally {
    release();
    if (locks.get(key) === current) locks.delete(key);
  }
}

export async function reserveInventory(items: Array<{ productId: string; quantity: number }>) {
  const reservationId = `res_${Date.now()}`;
  for (const item of items) {
    await withLock(item.productId, async () => {
      const record = inventory.get(item.productId);
      if (!record || record.available - record.reserved < item.quantity) {
        throw new Error("insufficient_inventory");
      }
      record.reserved += item.quantity;
    });
  }
  return { reservationId };
}

export async function completeReservation(items: Array<{ productId: string; quantity: number }>) {
  for (const item of items) {
    await withLock(item.productId, async () => {
      const record = inventory.get(item.productId);
      if (!record || record.reserved < item.quantity) throw new Error("reservation_missing");
      record.reserved -= item.quantity;
      record.available -= item.quantity;
    });
  }
}

export function inventorySnapshot() {
  return Array.from(inventory.values());
}
