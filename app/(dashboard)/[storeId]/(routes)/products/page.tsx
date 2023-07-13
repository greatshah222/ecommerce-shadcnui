import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

import { ProductColumn } from "./components/columns";
import ProductClient from "./components/client";

const ProductsPage = async ({
  params,
}: {
  params: {
    storeId: string;

    productId: string;
  };
}) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      size: true,
      color: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = products.map((el) => ({
    id: el.id,

    name: el.name,
    isFeatured: el?.isFeatured,
    isArchived: el?.isArchived,

    price: formatter.format(el?.price?.toNumber()), // is decimal so converting to number

    category: el?.category?.name,

    size: el?.size?.name,
    color: el?.color?.value, // to displayy hex value
    createdAt: format(el.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
