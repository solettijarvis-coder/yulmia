import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

// Cache the properties data in memory
let propertiesCache: any[] | null = null;

function getProperties(): any[] {
  if (propertiesCache) return propertiesCache;

  try {
    const dataPath = join(process.cwd(), "..", "data", "properties.json");
    const raw = readFileSync(dataPath, "utf-8");
    propertiesCache = JSON.parse(raw);
    return propertiesCache!;
  } catch {
    // Try alternate path
    try {
      const altPath = join(process.cwd(), "data", "properties.json");
      const raw = readFileSync(altPath, "utf-8");
      propertiesCache = JSON.parse(raw);
      return propertiesCache!;
    } catch {
      return [];
    }
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const properties = getProperties();

  const property = properties.find((p: any) => p.slug === slug);

  if (!property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }

  return NextResponse.json(property);
}
