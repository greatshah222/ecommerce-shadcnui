"use client";

import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { OrderColoumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface OrderClientProps {
	data: OrderColoumn[];
}

const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
	return (
		<>
			<div className="flex items-center justify-between">
				<Heading title={`Orders (${data?.length})`} description="Manage orders for your store" />
			</div>
			<Separator />

			<DataTable columns={columns} data={data} searchKey="products" />
		</>
	);
};

export default OrderClient;
