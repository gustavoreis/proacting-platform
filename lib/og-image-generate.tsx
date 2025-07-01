import { ImageResponse } from '@vercel/og';

function truncate(text: string, count: number): string {
  return text.length > count ? text.slice(0, count) + "..." : text;
}

const CONFIG = {
  logoUrl:
    "https://cdn.sanity.io/images/3lg5bxa5/production/7742970a1d77796b508b6da8a3567c5abf3e81de-4802x1053.svg",
  noImage:
    "https://cdn.sanity.io/images/3lg5bxa5/production/cf59914a0611ad9f104be909a4e8cb69b541739f-800x800.png",
};

export const ogImageGenerate = async ({
  title,
  shortDescription,
  previewImageUrl,
}: {
  title: string;
  shortDescription: string;
  previewImageUrl: string;
}) => {
  const image = previewImageUrl || CONFIG.noImage;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(to top right, #8B5CF6, #EC4899)",
          color: "white",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "90%",
            maxWidth: 800,
            paddingLeft: 6,
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-start",
              paddingTop: 24,
              paddingRight: 40,
              paddingBottom: 24,
              paddingLeft: 0,
              color: "white",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={CONFIG.logoUrl}
              alt="Logo"
              style={{
                alignSelf: "flex-start",
                height: 24,
                filter: "invert(0.8)",
              }}
            />
            <h1
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                flexGrow: 1,
                fontSize: 32,
                fontWeight: "600",
                marginTop: 20,
                lineHeight: "2.25rem",
                color: "white",
              }}
            >
              {truncate(title, 60)}
            </h1>
            <p
              style={{
                alignSelf: "flex-start",
                fontSize: 16,
                fontWeight: "400",
                color: "#dddddd",
              }}
            >
              {truncate(shortDescription, 60)}
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${image}?w=400&h=400&fit=crop&auto=format`}
            alt="Proacting"
            style={{
              width: 350,
              height: 350,
              borderRadius: "1rem",
            }}
          />
        </div>
      </div>
    ),
    {
      width: 800,
      height: 420,
    }
  );
}; 