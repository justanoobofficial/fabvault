/**
 * Design reference: renders the product card against the local seed file so the
 * hover, tilt and quick add states can be reviewed without a database.
 * Not linked from the storefront. Delete freely.
 */
"use client";

import seedData from "@/lib/seed-data.json";
import { ProductCard } from "@/components/ProductCard";

export default function PreviewPage() {
  const products = seedData.map((item, index) => ({
    id: `seed-${index}`,
    name: item.name,
    price: item.price,
    image: item.image,
    category: item.category,
    sizes: item.sizes,
    tag: item.tag || undefined,
  }));

  return (
    <main className="bg-paper px-5 py-16 sm:px-8 lg:px-12">
      <div className="grid grid-cols-1 gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </main>
  );
}
