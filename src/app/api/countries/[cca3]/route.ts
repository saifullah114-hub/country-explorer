import { NextResponse } from "next/server";
import { getCountryByCca3 } from "@/lib/dataService";

export async function GET(_: Request, { params }: { params: { cca3: string } }) {
  try {
    const result = await getCountryByCca3(params.cca3.toUpperCase());
    if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(result);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
