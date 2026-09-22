import { asc } from "drizzle-orm";
import { categories } from "@luccello/database";
import { getDatabase } from "../../shared/database/client.js";

export async function listDatabaseCategories() {
  return getDatabase().select().from(categories).orderBy(asc(categories.nameAr));
}
