import { NextResponse } from "next/server";
import { getCountryByCode } from "@/lib/dataService";

export async function GET(req: Request, { params }: { params: { cca3: string } }) {
  try {
    const result = await getCountryByCode(params.cca3.toUpperCase());
    if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(result);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
