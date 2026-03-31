import { NextResponse } from "next/server";

import {
  displayDeviceInclude,
  serializeDisplayState,
  subscribeDisplay,
} from "@/lib/display";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function formatSseEvent(event: string, data: unknown) {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const device = await prisma.displayDevice.findFirst({
    where: {
      deviceToken: id,
      isPaired: true,
    },
    include: displayDeviceInclude,
  });

  if (!device) {
    return NextResponse.json({ error: "Dispositivo no válido." }, { status: 404 });
  }

  const encoder = new TextEncoder();
  const initialState = serializeDisplayState(device);

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(formatSseEvent(event, data)));
      };

      send("state", initialState);
      const keepAlive = setInterval(() => {
        send("ping", { ts: Date.now() });
      }, 20_000);

      const unsubscribe = subscribeDisplay(id, (event) => {
        send(event.type, event.payload);
      });

      const abortHandler = () => {
        clearInterval(keepAlive);
        unsubscribe();
        controller.close();
      };

      request.signal.addEventListener("abort", abortHandler);
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
