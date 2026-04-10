// Deterministic mock data generator using simple hash of slug
// Same slug always produces the same mock data

function hashSlug(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    const char = slug.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit int
  }
  return Math.abs(hash);
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export interface WalkScores {
  transit: number;
  schools: number;
  grocery: number;
  medical: number;
  shopping: number;
  overall: number;
}

export interface NearbyPlace {
  name: string;
  type: string;
  distance: string;
  icon: string;
}

const schoolNames = [
  "Sunrise Elementary", "Palm View K-8", "Coral Park Elementary",
  "Riverside Academy", "Lakeside Preparatory", "Gulf Stream School",
  "Hibiscus Elementary", "Manatee Bay Elementary", "Driftwood Middle",
  "Plantation High", "Coconut Creek High", "Piper High",
  "Atlantic High", "Deerfield Beach Elementary", "Park Trails Elementary",
];

const groceryNames = [
  "Publix Super Market", "Winn-Dixie", "Aldi",
  "Trader Joe's", "Whole Foods Market", "Sedano's",
  "Fresh Market", "Sprouts Farmers Market", " Bravo Supermarket",
  "President Supermarket", "Niagara Bottling", "Save-A-Lot",
];

const medicalNames = [
  "Baptist Health Urgent Care", "Cleveland Clinic", "Jackson Memorial",
  "Mount Sinai Medical Center", "Holy Cross Hospital", "Memorial Regional",
  "Palms West Hospital", "JFK Medical Center", "Boca Raton Regional",
  "Delray Medical Center", "West Boca Medical Center", "Good Samaritan MC",
];

const transitNames = [
  "Tri-Rail Station", "Brightline Station", "Bus Stop #42",
  "Bus Stop #115", "Metrorail Station", "Bus Stop #7",
  "Tri-Rail: Mangonia Park", "Brightline: West Palm", "Bus Stop #83",
  "Tri-Rail: Delray Beach", "Bus Stop #21", "Bus Stop #60",
];

const shoppingNames = [
  "The Galleria Mall", "Aventura Mall", "Town Center at Boca Raton",
  "Palm Beach Outlets", "Sawgrass Mills", "Gulf Stream Park",
  "Mizner Park", "Royal Palm Place", "Delray Marketplace",
  "CocoWalk", "The Falls", "Dadeland Mall",
];

const placeDataByType: Record<string, { names: string[]; icon: string; type: string }> = {
  Schools: { names: schoolNames, icon: "🏫", type: "Schools" },
  Grocery: { names: groceryNames, icon: "🛒", type: "Grocery" },
  Medical: { names: medicalNames, icon: "🏥", type: "Medical" },
  Transit: { names: transitNames, icon: "🚊", type: "Transit" },
  Shopping: { names: shoppingNames, icon: "🛍️", type: "Shopping" },
};

export function getMockWalkScores(slug: string): WalkScores {
  const base = hashSlug(slug);
  const rand = seededRandom(base);

  const score = () => Math.floor(rand() * 56) + 40; // 40-95

  const transit = score();
  const schools = score();
  const grocery = score();
  const medical = score();
  const shopping = score();
  const overall = Math.round((transit + schools + grocery + medical + shopping) / 5);

  return { transit, schools, grocery, medical, shopping, overall };
}

export function getMockNearbyPlaces(slug: string): NearbyPlace[] {
  const base = hashSlug(slug + "-places");
  const rand = seededRandom(base);

  const places: NearbyPlace[] = [];

  for (const [, data] of Object.entries(placeDataByType)) {
    // Pick 3-4 places per category
    const count = 3 + Math.floor(rand() * 2);
    const usedIndices = new Set<number>();

    for (let i = 0; i < count; i++) {
      let idx: number;
      do {
        idx = Math.floor(rand() * data.names.length);
      } while (usedIndices.has(idx) && usedIndices.size < data.names.length);
      usedIndices.add(idx);

      // Distance: 0.1 - 2.5 miles
      const dist = (rand() * 2.4 + 0.1).toFixed(1);

      places.push({
        name: data.names[idx],
        type: data.type,
        distance: `${dist} mi`,
        icon: data.icon,
      });
    }
  }

  return places;
}
