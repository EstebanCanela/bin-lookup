"use server";

import { ColumnType, Generated, Selectable, Updateable } from "kysely";
import { db } from "./database";
import { BinLookUpResponse } from "./getBin.usecase";

export interface Database {
  binbase: BinbaseTable;
}

export interface BinbaseTable {
  id: Generated<number>;
  bin: number;
  brand: string | null;
  bank: string | null;
  type: string | null;
  level: string | null;
  isocountry: string | null;
  isoa2: string | null;
  isoa3: string | null;
  isonumber: number | null;
  www: string | null;
  phone: string | null;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, never>;
}

export type Binbase = Selectable<BinbaseTable>;
export type BinbaseUpdate = Updateable<BinbaseTable>;

export async function updateRow(
  originalData: Binbase,
  data: BinLookUpResponse
) {
  return db
    .updateTable("binbase")
    .set({
      brand: data.scheme || originalData.brand,
      bank: data.issuer || originalData.bank,
      type: data.type || originalData.type,
      level: data.tier || originalData.level,
      isocountry: data.country?.iso_country || originalData.isocountry,
      isoa2: data.country?.iso_a2 || originalData.isoa2,
      isoa3: data.country?.iso_a3 || originalData.isoa3,
      isonumber: data.country?.iso_number || originalData.isonumber,
    })
    .where("id", "=", originalData.id)
    .executeTakeFirst();
}

export async function createRow(bin: number, data: BinLookUpResponse) {
  return db
    .insertInto("binbase")
    .values({
      bin,
      brand: data.scheme,
      bank: data.issuer,
      type: data.type,
      level: data.tier,
      isocountry: data.country?.iso_country,
      isoa2: data.country?.iso_a2,
      isoa3: data.country?.iso_a3,
      isonumber: data.country?.iso_number,
    })
    .executeTakeFirst();
}

export async function getBin(bin: number) {
  const data = await db
    .selectFrom("binbase")
    .where("bin", "=", bin)
    .selectAll()
    .executeTakeFirst();

  return data as Binbase;
}

export async function mapEntityToResponse(
  data: Binbase
): Promise<BinLookUpResponse> {
  return {
    scheme: data.brand,
    type: data.type,
    tier: data.level,
    issuer: data.bank,
    luhn: true,
    country: {
      iso_a2: data.isoa2,
      iso_a3: data.isoa3,
      iso_country: data.isocountry,
      iso_number: data.isonumber,
    },
  };
}
