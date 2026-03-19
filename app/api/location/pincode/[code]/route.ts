import { NextResponse } from "next/server";

type PostalApiResponse = Array<{
  Status: string;
  PostOffice?: Array<{
    Name: string;
    District: string;
    State: string;
    Country: string;
    Pincode: string;
  }>;
}>;

export async function GET(_request: Request, { params }: { params: { code: string } }) {
  const code = String(params.code ?? "").trim();
  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: "Invalid PIN code." }, { status: 400 });
  }

  const response = await fetch(`https://api.postalpincode.in/pincode/${code}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    return NextResponse.json({ error: "PIN lookup failed." }, { status: 502 });
  }

  const data = (await response.json().catch(() => null)) as PostalApiResponse | null;
  const first = data?.[0];
  const office = first?.PostOffice?.[0];

  if (!office) {
    return NextResponse.json({ error: "No location found for this PIN." }, { status: 404 });
  }

  return NextResponse.json({
    city: office.District,
    state: office.State,
    country: office.Country || "India",
    area: office.Name,
    postalCode: office.Pincode,
  });
}
