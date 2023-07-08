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

    const { name, value } = body;

    if (!name) {
      return new NextResponse("Name is required", {
        status: 400,
      });
    }
    if (!value) {
      return new NextResponse("Value is required", {
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

    const color = await prismadb.color.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLOR_POST]", error);

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

    const color = await prismadb.color.findMany({
      where: {
        storeId: params?.storeId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLOR_GET", error);

    return new NextResponse("Internal error", {
      status: 500,
    });
  }
}
