import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

import BillboardClient from "./components/client";
import { SizeColumn } from "./components/columns";
import SizesClient from "./components/client";

const SizesPage = async ({
  params,
}: {
  params: {
    storeId: string;
  };
}) => {
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedSizes: SizeColumn[] = sizes.map((el) => ({
    id: el.id,

    name: el.name,

    value: el.value,
    createdAt: format(el.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizesClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default SizesPage;
