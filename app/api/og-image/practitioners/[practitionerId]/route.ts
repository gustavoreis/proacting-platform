import { NextRequest } from "next/server";
import { fetchPractitionerById } from "@/lib/sanity";
import { ogImageGenerate } from "@/lib/og-image-generate";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ practitionerId: string }> }
) {
  try {
    const { practitionerId } = await params;

    if (!practitionerId) {
      return new Response("Practitioner ID is required", { status: 400 });
    }

    const practitioner = await fetchPractitionerById(practitionerId);

    if (!practitioner) {
      return new Response("Practitioner not found", { status: 404 });
    }

    const title = `${practitioner.prefix || ""} ${practitioner.name}`.trim();
    const shortDescription = practitioner.bio || "Practitioner da Proacting";
    const previewImageUrl = practitioner.avatarUrl || "";

    return await ogImageGenerate({
      title,
      shortDescription,
      previewImageUrl,
    });
  } catch (error) {
    console.error("Error generating OG image for practitioner:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
} 