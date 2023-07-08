import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

import BillboardClient from "./components/client";
import { CategoryColumn } from "./components/columns";

const CategoriesPage = async ({
  params,
}: {
  params: {
    storeId: string;
  };
}) => {
  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },

    include: {
      billboard: true, // populating the billboard as well
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCategories: CategoryColumn[] = categories.map((el) => ({
    id: el.id,
    name: el.name,

    billboardLabel: el.billboard.label,

    createdAt: format(el.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
