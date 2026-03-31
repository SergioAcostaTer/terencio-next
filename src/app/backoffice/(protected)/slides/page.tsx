import DigitalSignageManager from "@/components/backoffice/DigitalSignageManager";
import { assertPermission, requireAdminPermission } from "@/lib/auth";
import {
  displayDeviceInclude,
  playlistInclude,
  serializeDisplayAdmin,
  serializeMediaAsset,
  serializePlaylistDetails,
} from "@/lib/display";
import { prisma } from "@/lib/prisma";

export default async function SlidesPage() {
  const session = await requireAdminPermission("slides.read");
  const [assets, playlists, displays] = await Promise.all([
    prisma.mediaAsset.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.playlist.findMany({
      include: playlistInclude,
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    }),
    prisma.displayDevice.findMany({
      where: { isPaired: true },
      include: displayDeviceInclude,
      orderBy: [{ createdAt: "desc" }],
    }),
  ]);

  return (
    <div className="space-y-8">
      <section className="backoffice-page-header px-4 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          Backoffice / Digital Signage
        </p>
        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">
              Digital Signage
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Gestiona biblioteca media, playlists y pantallas físicas independientes desde la sección actual del backoffice.
            </p>
          </div>
          <div className="grid gap-4 border-l border-slate-200 pl-4 sm:grid-cols-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Assets</p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">{assets.length}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Playlists</p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">{playlists.length}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Pantallas</p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">{displays.length}</p>
            </div>
          </div>
        </div>
      </section>

      <DigitalSignageManager
        assets={assets.map(serializeMediaAsset)}
        playlists={playlists.map(serializePlaylistDetails)}
        displays={displays.map(serializeDisplayAdmin)}
        canManage={assertPermission(session, "slides.write")}
      />
    </div>
  );
}
