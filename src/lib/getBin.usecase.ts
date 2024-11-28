"use server";

import dayjs from "dayjs";
import { getBin, updateRow, createRow, mapEntityToResponse } from "./data";
import { getBinFromHandy } from "./handy";

const initialDate = "2024-11-27";

export interface Country {
  iso_a2: string | null;
  iso_a3: string | null;
  iso_number: number | null;
  iso_country: string | null;
}

export interface BinLookUpResponse {
  scheme: string | null;
  type: string | null;
  issuer: string | null;
  tier: string | null;
  country: Country | null;
  luhn: boolean | null;
}

export async function getBinUseCase(
  bin: number
): Promise<BinLookUpResponse | null> {
  const data = await getBin(bin);

  if (data) {
    const updatedAtDate = dayjs(data.updated_at);
    const setupBinDate = dayjs(initialDate);
    const currentDate = dayjs();

    if (
      updatedAtDate.isSame(setupBinDate, "day") ||
      currentDate.isAfter(updatedAtDate.add(1, "month"), "day")
    ) {
      const responseFromHandy = await getBinFromHandy(bin);

      if (responseFromHandy) {
        await updateRow(data, responseFromHandy);
        return responseFromHandy;
      }
    }

    return mapEntityToResponse(data);
  } else {
    const responseFromHandy = await getBinFromHandy(bin);
    if (responseFromHandy) {
      await createRow(bin, responseFromHandy);
      return responseFromHandy;
    }
  }

  return null;
}
