export default function NeighborhoodDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-serif font-bold text-foreground">
          Neighborhood
        </h1>
        <p className="mt-3 text-muted-foreground">
          Investment profile coming soon.
        </p>
      </div>
    </div>
  );
}