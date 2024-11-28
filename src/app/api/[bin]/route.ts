"use server";

import { z } from "zod";
import { getBinUseCase } from "@/lib/getBin.usecase";

interface RouteParams {
  bin: string;
}

export async function GET(
  request: Request,
  { params }: { params: RouteParams }
) {
  const { bin } = await params;

  // Validation
  const validator = z.number().int().gte(100000).lte(99999999);
  const binData = validator.safeParse(Number(bin));

  if (binData.error) {
    return Response.json(
      {
        status: "BAD_REQUEST",
        code: 400,
        error: `INVALID_BIN`,
        message: `Invalid BIN type. It should be a number`,
      },
      {
        status: 400,
      }
    );
  }

  const binLookupResponse = await getBinUseCase(binData.data);

  if (binLookupResponse) {
    return Response.json(
      {
        data: binLookupResponse,
      },
      {
        status: 200,
      }
    );
  }

  return Response.json(
    {
      status: "NOT_FOUND",
      code: 404,
      error: `BIN_NOT_FOUND`,
      message: `BIN is not found. Please check the input and try again.`,
    },
    {
      status: 404,
    }
  );
}
