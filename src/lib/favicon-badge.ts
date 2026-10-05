let originalFavicon: string | null = null;

export function setFaviconBadge(count: number) {
  const link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
  if (!link) return;
  if (originalFavicon === null) {
    originalFavicon = link.getAttribute("href") || link.href;
  }

  if (count === 0) {
    link.href = originalFavicon;
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const img = new Image();
  img.src = originalFavicon;
  img.onload = () => {
    ctx.drawImage(img, 0, 0, 32, 32);
    ctx.beginPath();
    ctx.arc(24, 8, 8, 0, 2 * Math.PI);
    ctx.fillStyle = "#D64545";
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(count > 9 ? "9+" : String(count), 24, 9);
    link.href = canvas.toDataURL("image/png");
  };
}