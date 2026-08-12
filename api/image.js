export default async function handler(req, res) {
  const rawUrl = Array.isArray(req.query.url) ? req.query.url[0] : req.query.url;

  if (!rawUrl) {
    return res.status(400).json({ error: "Missing url" });
  }

  let target;
  try {
    target = new URL(rawUrl);
  } catch {
    return res.status(400).json({ error: "Invalid url" });
  }

  if (target.protocol !== "https:" || target.hostname !== "raw.githubusercontent.com") {
    return res.status(403).json({ error: "Only raw.githubusercontent.com is allowed" });
  }

  try {
    const upstream = await fetch(target.toString(), {
      redirect: "follow",
      headers: {
        "User-Agent": "BisayaToolkit-ImageProxy/1.0",
        "Accept": "image/avif,image/webp,image/apng,image/png,image/jpeg,image/*,*/*;q=0.8"
      }
    });

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: "Upstream image request failed",
        status: upstream.status
      });
    }

    const contentType = upstream.headers.get("content-type") || "application/octet-stream";

    if (!contentType.toLowerCase().startsWith("image/")) {
      return res.status(415).json({ error: "Upstream response is not an image" });
    }

    const buffer = Buffer.from(await upstream.arrayBuffer());

    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=2592000, stale-while-revalidate=604800"
    );
    res.setHeader("CDN-Cache-Control", "public, max-age=2592000");
    res.setHeader("Content-Length", String(buffer.length));

    return res.status(200).send(buffer);
  } catch {
    return res.status(502).json({ error: "Image proxy failed" });
  }
}
