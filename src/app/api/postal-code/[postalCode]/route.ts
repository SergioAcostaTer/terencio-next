import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PROVINCES: Record<string, string> = {
  "01": "Araba",
  "02": "Albacete",
  "03": "Alicante",
  "04": "Almeria",
  "05": "Avila",
  "06": "Badajoz",
  "07": "Balears",
  "08": "Barcelona",
  "09": "Burgos",
  "10": "Caceres",
  "11": "Cadiz",
  "12": "Castellon",
  "13": "Ciudad Real",
  "14": "Cordoba",
  "15": "A Coruna",
  "16": "Cuenca",
  "17": "Girona",
  "18": "Granada",
  "19": "Guadalajara",
  "20": "Gipuzkoa",
  "21": "Huelva",
  "22": "Huesca",
  "23": "Jaen",
  "24": "Leon",
  "25": "Lleida",
  "26": "La Rioja",
  "27": "Lugo",
  "28": "Madrid",
  "29": "Malaga",
  "30": "Murcia",
  "31": "Navarra",
  "32": "Ourense",
  "33": "Asturias",
  "34": "Palencia",
  "35": "Las Palmas",
  "36": "Pontevedra",
  "37": "Salamanca",
  "38": "Santa Cruz de Tenerife",
  "39": "Cantabria",
  "40": "Segovia",
  "41": "Sevilla",
  "42": "Soria",
  "43": "Tarragona",
  "44": "Teruel",
  "45": "Toledo",
  "46": "Valencia",
  "47": "Valladolid",
  "48": "Bizkaia",
  "49": "Zamora",
  "50": "Zaragoza",
  "51": "Ceuta",
  "52": "Melilla",
};

function getProvince(postalCode: string) {
  return PROVINCES[postalCode.slice(0, 2)] ?? null;
}

type PostalLookupResponse = {
  cities: string[];
  province: string | null;
  source: "external" | "province-fallback";
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ postalCode: string }> },
) {
  const { postalCode } = await context.params;

  if (!/^(0[1-9]|[1-4]\d|5[0-2])\d{3}$/.test(postalCode)) {
    return NextResponse.json({ error: "Código postal no válido." }, { status: 400 });
  }

  const province = getProvince(postalCode);

  try {
    const response = await fetch(`https://api.zippopotam.us/es/${postalCode}`, {
      signal: AbortSignal.timeout(2500),
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Postal lookup failed");
    }

    const payload = (await response.json()) as {
      places?: Array<{ "place name"?: string; state?: string }>;
    };

    const cities = Array.from(
      new Set(
        (payload.places ?? [])
          .map((place) => place["place name"]?.trim())
          .filter((value): value is string => Boolean(value)),
      ),
    );

    const resolvedProvince =
      payload.places?.find((place) => place.state?.trim())?.state?.trim() ?? province;

    return NextResponse.json({
      cities,
      province: resolvedProvince,
      source: "external",
    } satisfies PostalLookupResponse);
  } catch {
    return NextResponse.json({
      cities: [],
      province,
      source: "province-fallback",
    } satisfies PostalLookupResponse);
  }
}
