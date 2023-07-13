import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

import BillboardClient from "./components/client";
import { OrderColoumn } from "./components/columns";
import { formatter } from "@/lib/utils";

const OrdersPage = async ({
	params,
}: {
	params: {
		storeId: string;
	};
}) => {
	const orders = await prismadb.order.findMany({
		where: {
			storeId: params.storeId,
		},
		include: {
			orderItems: {
				include: {
					product: true,
				},
			},
		},

		orderBy: {
			createdAt: "desc",
		},
	});

	const formattedOrders: OrderColoumn[] = orders.map((el) => ({
		id: el.id,

		phone: el?.phone,
		address: el?.address,

		products: el?.orderItems?.map((el1) => el1.product.name).join(", "),

		totalPrice: formatter.format(
			el?.orderItems?.reduce((total, item) => {
				return total + Number(item.product.price);
			}, 0)
		),
		isPaid: el?.isPaid,
		createdAt: format(el.createdAt, "MMMM do, yyyy"),
	}));
	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<BillboardClient data={formattedOrders} />
			</div>
		</div>
	);
};

export default OrdersPage;
