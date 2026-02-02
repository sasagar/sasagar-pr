import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { writeFileSync, mkdirSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface OGPData {
  totalPRs: number;
  openPRs: number;
  mergedPRs: number;
  closedPRs: number;
  lastUpdated: string;
}

// Load font for satori
async function loadFont(): Promise<ArrayBuffer> {
  // Try to load system TTF fonts (not TTC which is unsupported)
  const fontPaths = [
    // Linux
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    // Windows
    "C:\\Windows\\Fonts\\arial.ttf",
  ];

  for (const fontPath of fontPaths) {
    try {
      const fontData = readFileSync(fontPath);
      return fontData.buffer.slice(
        fontData.byteOffset,
        fontData.byteOffset + fontData.byteLength
      );
    } catch {
      // Try next font
    }
  }

  // Fetch Inter font from Google Fonts (widely available, good for UI)
  console.log("Fetching font from Google Fonts...");
  const fontResponse = await fetch(
    "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
  );
  if (!fontResponse.ok) {
    throw new Error(`Failed to fetch font: ${fontResponse.status}`);
  }
  return await fontResponse.arrayBuffer();
}

function createOGPElement(data: OGPData) {
  const { totalPRs, openPRs, mergedPRs, closedPRs, lastUpdated } = data;

  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        padding: "60px",
        fontFamily: "Inter, sans-serif",
        color: "#ffffff",
      },
      children: [
        // Header with avatar and name
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "24px",
              marginBottom: "40px",
            },
            children: [
              // Avatar
              {
                type: "img",
                props: {
                  src: "https://github.com/sasagar.png",
                  width: 100,
                  height: 100,
                  style: {
                    borderRadius: "50%",
                    border: "4px solid #4a9eff",
                  },
                },
              },
              // Name and title
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: "48px",
                          fontWeight: "700",
                          color: "#ffffff",
                        },
                        children: "sasagar",
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: "28px",
                          color: "#8b9dc3",
                        },
                        children: "GitHub PR Portfolio",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        // Stats container
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "20px",
              padding: "40px",
              marginBottom: "40px",
              flex: 1,
            },
            children: [
              // Total PRs
              {
                type: "div",
                props: {
                  style: {
                    fontSize: "36px",
                    fontWeight: "700",
                    marginBottom: "24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  },
                  children: [
                    {
                      type: "span",
                      props: {
                        style: { color: "#8b9dc3" },
                        children: "Total PRs:",
                      },
                    },
                    {
                      type: "span",
                      props: {
                        style: { color: "#4a9eff" },
                        children: String(totalPRs),
                      },
                    },
                  ],
                },
              },
              // Status breakdown
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    gap: "40px",
                    fontSize: "28px",
                  },
                  children: [
                    // Open
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        },
                        children: [
                          {
                            type: "div",
                            props: {
                              style: {
                                width: "16px",
                                height: "16px",
                                borderRadius: "50%",
                                background: "#22c55e",
                              },
                            },
                          },
                          {
                            type: "span",
                            props: {
                              style: { color: "#8b9dc3" },
                              children: "Open:",
                            },
                          },
                          {
                            type: "span",
                            props: {
                              style: { color: "#22c55e", fontWeight: "700" },
                              children: String(openPRs),
                            },
                          },
                        ],
                      },
                    },
                    // Merged
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        },
                        children: [
                          {
                            type: "div",
                            props: {
                              style: {
                                width: "16px",
                                height: "16px",
                                borderRadius: "50%",
                                background: "#a855f7",
                              },
                            },
                          },
                          {
                            type: "span",
                            props: {
                              style: { color: "#8b9dc3" },
                              children: "Merged:",
                            },
                          },
                          {
                            type: "span",
                            props: {
                              style: { color: "#a855f7", fontWeight: "700" },
                              children: String(mergedPRs),
                            },
                          },
                        ],
                      },
                    },
                    // Closed
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        },
                        children: [
                          {
                            type: "div",
                            props: {
                              style: {
                                width: "16px",
                                height: "16px",
                                borderRadius: "50%",
                                background: "#ef4444",
                              },
                            },
                          },
                          {
                            type: "span",
                            props: {
                              style: { color: "#8b9dc3" },
                              children: "Closed:",
                            },
                          },
                          {
                            type: "span",
                            props: {
                              style: { color: "#ef4444", fontWeight: "700" },
                              children: String(closedPRs),
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        // Footer with last updated
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              justifyContent: "center",
              fontSize: "24px",
              color: "#6b7280",
            },
            children: `Last updated: ${lastUpdated}`,
          },
        },
      ],
    },
  };
}

export async function generateOGPImage(data: OGPData): Promise<void> {
  console.log("Generating OGP image...");

  const font = await loadFont();

  const element = createOGPElement(data);

  const svg = await satori(element as React.ReactNode, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Inter",
        data: font,
        weight: 400,
        style: "normal",
      },
      {
        name: "Inter",
        data: font,
        weight: 700,
        style: "normal",
      },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: 1200,
    },
  });

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  // Ensure public directory exists
  const publicDir = join(__dirname, "..", "public");
  mkdirSync(publicDir, { recursive: true });

  const outputPath = join(publicDir, "ogp.png");
  writeFileSync(outputPath, pngBuffer);

  console.log(`OGP image generated: ${outputPath}`);
}

// For standalone execution
if (import.meta.url === `file://${process.argv[1]}`) {
  // Default test data
  generateOGPImage({
    totalPRs: 156,
    openPRs: 12,
    mergedPRs: 138,
    closedPRs: 6,
    lastUpdated: "2026-02-02 21:00:00",
  });
}
