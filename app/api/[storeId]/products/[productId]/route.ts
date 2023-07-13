import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(
	req: Request,
	{
		params,
	}: {
		params: {
			productId: string;
		};
	}
) {
	try {
		if (!params.productId) {
			return new NextResponse("productId is missing", {
				status: 400,
			});
		}

		const product = await prismadb.product.findUnique({
			where: {
				id: params.productId,
			},
			include: {
				images: true,
				category: true,
				size: true,
				color: true,
			},
		});

		return NextResponse.json(product);
	} catch (error) {
		console.log("[PRODUCT_GET]", error);

		return new NextResponse("Internal Error", {
			status: 500,
		});
	}
}

export async function PATCH(
	req: Request,
	{
		params,
	}: {
		params: {
			productId: string;
			storeId: string;
		};
	}
) {
	try {
		const { userId } = auth();
		const body = await req.json();

		if (!userId) {
			return new NextResponse("Unauthenticated", {
				status: 401,
			});
		}

		const { name, price, categoryId, sizeId, colorId, images, isFeatured, isArchived } = body;

		if (!name) {
			return new NextResponse("name is required", {
				status: 400,
			});
		}

		if (!images || !images.length) {
			return new NextResponse("Images are required", {
				status: 400,
			});
		}
		if (!price) {
			return new NextResponse("price is required", {
				status: 400,
			});
		}
		if (!categoryId) {
			return new NextResponse("Category Idis required", {
				status: 400,
			});
		}
		if (!sizeId) {
			return new NextResponse("sizeId is required", {
				status: 400,
			});
		}
		if (!colorId) {
			return new NextResponse("colorId is required", {
				status: 400,
			});
		}

		// CHECK IF STORE BELONGS TO THE USER FIRST
		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params?.storeId,
				userId,
			},
		});

		if (!storeByUserId) {
			// STORE BELONGS TO SOME OTHER USER
			return new NextResponse("Unauthorized", {
				status: 403,
			});
		}
		await prismadb.product.update({
			where: {
				id: params.productId,
			},
			data: {
				name,
				price,
				categoryId,
				isArchived,
				isFeatured,
				colorId,
				sizeId,
				images: {
					deleteMany: {},
				},
			},
		});

		// creating new images after deleting it
		const product = await prismadb.product.update({
			where: {
				id: params.productId,
			},
			data: {
				images: {
					createMany: {
						data: [...images.map((image: { url: string }) => image)],
					},
				},
			},
		});

		return NextResponse.json(product);
	} catch (error) {
		console.log("[PRODUCT_PATCH]", error);

		return new NextResponse("Internal Error", {
			status: 500,
		});
	}
}

export async function DELETE(
	req: Request,
	{
		params,
	}: {
		params: {
			storeId: string;
			productId: string;
		};
	}
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse("Unauthorized", {
				status: 401,
			});
		}

		if (!params.productId) {
			return new NextResponse("productId is missing", {
				status: 400,
			});
		}

		// CHECK IF STORE BELONGS TO THE USER FIRST
		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params?.storeId,
				userId,
			},
		});

		if (!storeByUserId) {
			// STORE BELONGS TO SOME OTHER USER
			return new NextResponse("Unauthorized", {
				status: 403,
			});
		}

		const product = await prismadb.product.deleteMany({
			where: {
				id: params.productId,
			},
		});

		return NextResponse.json(product);
	} catch (error) {
		console.log("[PRODUC_DELETE]", error);

		return new NextResponse("Internal Error", {
			status: 500,
		});
	}
}
