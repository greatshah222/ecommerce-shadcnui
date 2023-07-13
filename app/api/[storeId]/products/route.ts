import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: {
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

    const {
      name,
      price,
      categoryId,
      sizeId,
      colorId,
      images,
      isFeatured,
      isArchived,
    } = body;

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

    if (!params?.storeId) {
      return new NextResponse("Store id is required", {
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

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        categoryId,
        isArchived,
        isFeatured,
        colorId,
        sizeId,
        storeId: params.storeId,

        images: {
          createMany: {
            data: [...images.map((el: { url: string }) => el)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_POST]", error);

    return new NextResponse("Internal error", {
      status: 500,
    });
  }
}

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
    };
  }
) {
  try {
    if (!params?.storeId) {
      return new NextResponse("Store id is required", {
        status: 400,
      });
    }

    const billboard = await prismadb.billboard.findMany({
      where: {
        storeId: params?.storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARDS_GET", error);

    return new NextResponse("Internal error", {
      status: 500,
    });
  }
}
