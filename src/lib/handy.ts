"use server";

import { BinLookUpResponse } from "./getBin.usecase";

interface BinHandyResponse {
  Status: string;
  Scheme: string;
  Type: string;
  Issuer: string;
  CardTier: string;
  Country: {
    A2: string;
    A3: string;
    N3: string;
    ISD: string;
    Name: string;
    Cont: string;
  };
  Luhn: boolean;
}

export async function getBinFromHandy(
  bin: number
): Promise<BinLookUpResponse | null> {
  try {
    const response = await fetch(`https://data.handyapi.com/bin/${bin}`);
    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as BinHandyResponse;

    if (data.Status === "NOT FOUND") {
      return null;
    }

    return mapToDomainEntity(data);
  } catch {
    return null;
  }
}

function mapToDomainEntity(data: BinHandyResponse): BinLookUpResponse {
  return {
    scheme: data.Scheme,
    type: data.Type,
    tier: data.CardTier,
    issuer: data.Issuer,
    luhn: Boolean(data.Luhn),
    country: {
      iso_a2: data?.Country?.A2,
      iso_a3: data?.Country?.A3,
      iso_country: data?.Country?.Name,
      iso_number: Number(data?.Country?.N3),
    },
  };
}
