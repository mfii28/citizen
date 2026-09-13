import type { Metadata } from "next";
import { galleryImages, initiatives } from "@/lib/mock-data";
import { SectionHeading } from "@/components/ui";

export const metadata: Metadata = { title: "Media Gallery" };

export default function GalleryPage() {
  const images = galleryImages.map((img) => ({
    ...img,
    initiativeTitle: initiatives.find((i) => i.id === img.initiativeId)?.title,
  }));

  return (
    <section className="section-y">
      <div className="container-page">
        <SectionHeading eyebrow="See it for yourself" title="Media Gallery" description="Photos and event albums from across every initiative." />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img) => (
            <div key={img.id} className="group relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-ocean-600 to-ocean-950">
              <span className="px-2 text-center font-mono text-[11px] text-ocean-200">{img.initiativeTitle ?? "Gallery"}</span>
              {img.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 text-[11px] text-white opacity-0 transition group-hover:opacity-100">
                  {img.caption}
                </div>
              )}
            </div>
          ))}
          {images.length === 0 && (
            <p className="col-span-full text-ocean-500">
              No photos yet — this section is ready for real images once you add them.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
