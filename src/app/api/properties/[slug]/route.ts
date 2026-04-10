import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

// Cache the properties data in memory
let propertiesCache: any[] | null = null;

function getProperties(): any[] {
  if (propertiesCache) return propertiesCache;

  // Try multiple paths for different environments
  const paths = [
    join(process.cwd(), "data", "properties.json"),       // Vercel: data/ in project root
    join(process.cwd(), "..", "data", "properties.json"), // Local dev: ../data/
  ];

  for (const dataPath of paths) {
    try {
      const raw = readFileSync(dataPath, "utf-8");
      propertiesCache = JSON.parse(raw);
      return propertiesCache!;
    } catch {
      continue;
    }
  }

  return [];
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
