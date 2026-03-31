import { NextResponse } from "next/server";

import {
  DISPLAY_PAIRING_TTL_MS,
  generatePairingCode,
  getPairingExpiryDate,
} from "@/lib/display";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function createUniquePairingCode() {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const pairingCode = generatePairingCode();
    const existing = await prisma.displayDevice.findUnique({
      where: { pairingCode },
      select: { id: true },
    });

    if (!existing) {
      return pairingCode;
    }
  }

  throw new Error("No se pudo generar un PIN de emparejamiento único.");
}

export async function POST() {
  await prisma.displayDevice.deleteMany({
    where: {
      isPaired: false,
      pairingExpiresAt: {
        lt: new Date(),
      },
    },
  });

  const pairingCode = await createUniquePairingCode();
  const device = await prisma.displayDevice.create({
    data: {
      name: "Pantalla sin vincular",
      pairingCode,
      pairingExpiresAt: getPairingExpiryDate(),
    },
  });

  return NextResponse.json({
    id: device.id,
    pairingCode: device.pairingCode,
    pairingExpiresAt: new Date(Date.now() + DISPLAY_PAIRING_TTL_MS).toISOString(),
  });
}
