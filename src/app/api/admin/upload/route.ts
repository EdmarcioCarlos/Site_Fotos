import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";

const MAX_BANNER_BYTES = 10 * 1024 * 1024;
const MAX_ICON_BYTES = 1 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.must_change_password) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json({ error: "Content-Type deve ser multipart/form-data" }, { status: 400 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const pathPrefix = (formData.get("pathPrefix") as string) || "site/";

    if (!file) {
      return NextResponse.json({ error: "Arquivo não enviado" }, { status: 400 });
    }

    // Validações
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Tipo de arquivo não permitido. Use JPG, PNG ou WebP." }, { status: 400 });
    }

    const maxBytes = pathPrefix.startsWith("banners/") ? MAX_BANNER_BYTES : MAX_ICON_BYTES;
    if (file.size > maxBytes) {
      const maxMB = maxBytes / (1024 * 1024);
      return NextResponse.json({ error: `Arquivo muito grande. Máximo ${maxMB} MB.` }, { status: 400 });
    }

    // Valida pathPrefix
    if (!pathPrefix.startsWith("banners/") && !pathPrefix.startsWith("site/")) {
      return NextResponse.json({ error: "Caminho não permitido" }, { status: 400 });
    }

    // Gera nome único
    const ext = file.type === "image/jpeg" ? "jpg" : file.type === "image/png" ? "png" : "webp";
    const pathname = `${pathPrefix}${Date.now()}-${crypto.randomUUID()}.${ext}`;

    // Upload server-side para Vercel Blob
    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: false, // já incluímos no nome
    });

    return NextResponse.json({ url: blob.url, pathname: blob.pathname });
  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json({ error: "Falha ao enviar imagem" }, { status: 500 });
  }
}
