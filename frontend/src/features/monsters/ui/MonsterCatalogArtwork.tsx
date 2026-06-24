import { Box } from "@mui/material";

import { createMonsterFallbackImage } from "@/features/monsters/ui/monsterCatalog.utils";

type MonsterCatalogArtworkProps = {
  alt: string;
  backgroundColor?: string;
  imageUrl: string | null;
  imageBackgroundColor?: string;
  minHeight?: number | string | Record<string, number | string>;
  objectFit?: "cover" | "contain";
  overlay?: boolean;
};

export function MonsterCatalogArtwork({
  alt,
  backgroundColor = "secondary.dark",
  imageUrl,
  imageBackgroundColor = "rgba(22, 18, 15, 0.18)",
  minHeight = 260,
  objectFit = "cover",
  overlay = true,
}: MonsterCatalogArtworkProps) {
  const fallbackImage = createMonsterFallbackImage(alt);

  return (
    <Box
      sx={{
        bgcolor: backgroundColor,
        minHeight,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        alt={alt}
        component="img"
        onError={(event) => {
          if (event.currentTarget.src !== fallbackImage) {
            event.currentTarget.src = fallbackImage;
          }
        }}
        src={imageUrl ?? fallbackImage}
        sx={{
          backgroundColor: imageBackgroundColor,
          display: "block",
          height: "100%",
          inset: 0,
          objectFit,
          position: "absolute",
          width: "100%",
        }}
      />
      {overlay ? (
        <Box
          sx={{
            background:
              "linear-gradient(180deg, rgba(11, 10, 9, 0.08) 0%, rgba(11, 10, 9, 0.2) 55%, rgba(11, 10, 9, 0.82) 100%)",
            inset: 0,
            position: "absolute",
          }}
        />
      ) : null}
    </Box>
  );
}
