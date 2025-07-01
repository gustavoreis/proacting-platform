import { NextRequest } from "next/server";
import { fetchTrackById } from "@/lib/sanity";
import { ogImageGenerate } from "@/lib/og-image-generate";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ trackId: string }> }
) {
  try {
    const { trackId } = await params;

    if (!trackId) {
      return new Response("Track ID is required", { status: 400 });
    }

    const track = await fetchTrackById(trackId);

    if (!track) {
      return new Response("Track not found", { status: 404 });
    }

    const title = track.title;
    const shortDescription = track.shortDescription || "Protocolo da Proacting";
    const previewImageUrl = track.previewImageUrl || "";

    return await ogImageGenerate({
      title,
      shortDescription,
      previewImageUrl,
    });
  } catch (error) {
    console.error("Error generating OG image for track:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
} 