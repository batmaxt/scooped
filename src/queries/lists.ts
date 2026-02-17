import { createClient } from "@/lib/supabase/client";
import type { List, ListItem, ListItemType } from "@/types/models";

const supabase = createClient();

// ---------------------------------------------------------------------------
// Fetch lists
// ---------------------------------------------------------------------------

export async function fetchUserLists(userId: string): Promise<List[]> {
  const { data, error } = await supabase
    .from("lists")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching user lists:", error);
    return [];
  }

  return (data || []) as List[];
}

export async function fetchPublicUserLists(userId: string): Promise<List[]> {
  const { data, error } = await supabase
    .from("lists")
    .select("*")
    .eq("user_id", userId)
    .eq("is_public", true)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching public user lists:", error);
    return [];
  }

  return (data || []) as List[];
}

export async function fetchListById(listId: string): Promise<List | null> {
  const { data, error } = await supabase
    .from("lists")
    .select("*")
    .eq("id", listId)
    .single();

  if (error) {
    console.error("Error fetching list:", error);
    return null;
  }

  return data as List;
}

// ---------------------------------------------------------------------------
// Create / Update / Delete lists
// ---------------------------------------------------------------------------

export async function createList(
  userId: string,
  input: { name: string; description?: string; is_public?: boolean }
): Promise<List> {
  const { data, error } = await supabase
    .from("lists")
    .insert({
      user_id: userId,
      name: input.name,
      description: input.description || null,
      is_public: input.is_public ?? true,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as List;
}

export async function updateList(
  listId: string,
  updates: { name?: string; description?: string; is_public?: boolean }
): Promise<List> {
  const { data, error } = await supabase
    .from("lists")
    .update(updates)
    .eq("id", listId)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as List;
}

export async function deleteList(listId: string): Promise<void> {
  const { error } = await supabase.from("lists").delete().eq("id", listId);
  if (error) throw new Error(error.message);
}

// ---------------------------------------------------------------------------
// List items
// ---------------------------------------------------------------------------

export async function fetchListItems(listId: string): Promise<ListItem[]> {
  const { data, error } = await supabase
    .from("list_items")
    .select(
      `
      *,
      location:locations(*),
      flavor:flavors(*, brand:brands(*)),
      brand:brands(*)
    `
    )
    .eq("list_id", listId)
    .order("position");

  if (error) {
    console.error("Error fetching list items:", error);
    return [];
  }

  return (data || []) as unknown as ListItem[];
}

export async function addListItem(
  listId: string,
  itemType: ListItemType,
  itemId: string,
  note?: string
): Promise<ListItem> {
  // Get the current max position
  const { data: existing } = await supabase
    .from("list_items")
    .select("position")
    .eq("list_id", listId)
    .order("position", { ascending: false })
    .limit(1);

  const nextPosition = existing && existing.length > 0 ? existing[0].position + 1 : 0;

  const row: Record<string, unknown> = {
    list_id: listId,
    item_type: itemType,
    position: nextPosition,
    note: note || null,
  };

  if (itemType === "location") row.location_id = itemId;
  else if (itemType === "flavor") row.flavor_id = itemId;
  else if (itemType === "brand") row.brand_id = itemId;

  const { data, error } = await supabase
    .from("list_items")
    .insert(row)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as ListItem;
}

export async function removeListItem(itemId: string): Promise<void> {
  const { error } = await supabase
    .from("list_items")
    .delete()
    .eq("id", itemId);

  if (error) throw new Error(error.message);
}

// ---------------------------------------------------------------------------
// Reorder items (batch position update)
// ---------------------------------------------------------------------------

export async function reorderListItems(
  items: { id: string; position: number }[]
): Promise<void> {
  // Update each item's position sequentially
  for (const item of items) {
    const { error } = await supabase
      .from("list_items")
      .update({ position: item.position })
      .eq("id", item.id);

    if (error) throw new Error(error.message);
  }
}

// ---------------------------------------------------------------------------
// Check which of a user's lists contain a given item
// ---------------------------------------------------------------------------

export async function fetchListsContainingItem(
  userId: string,
  itemType: ListItemType,
  itemId: string
): Promise<string[]> {
  const fkColumn =
    itemType === "location"
      ? "location_id"
      : itemType === "flavor"
        ? "flavor_id"
        : "brand_id";

  const { data, error } = await supabase
    .from("list_items")
    .select("list_id, lists!inner(user_id)")
    .eq(fkColumn, itemId)
    .eq("lists.user_id", userId);

  if (error) {
    console.error("Error fetching lists containing item:", error);
    return [];
  }

  return (data || []).map((row: any) => row.list_id as string);
}
