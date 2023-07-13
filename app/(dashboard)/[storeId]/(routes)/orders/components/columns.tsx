"use client";

import { ColumnDef } from "@tanstack/react-table";

export type OrderColoumn = {
	id: string;
	phone: string;
	address: string;
	isPaid: boolean;
	totalPrice: string;
	products: string;
	createdAt: string;
};

export const columns: ColumnDef<OrderColoumn>[] = [
	{
		accessorKey: "products",
		header: "Products",
	},

	{
		accessorKey: "phone",
		header: "Phone",
	},
	{
		accessorKey: "address",
		header: "Address",
	},
	{
		accessorKey: "totalPrice",
		header: "Total price",
	},
	{
		accessorKey: "isPaid",
		header: "Paid",
	},
];
