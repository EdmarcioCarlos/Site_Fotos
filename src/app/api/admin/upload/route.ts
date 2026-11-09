import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";

const MAX_BANNER_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.must_change_password) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "Requisição inválida" }, { status: 400 });
  }
  if (body.type !== "blob.generate-client-token") {
    return NextResponse.json({ error: "Requisição inválida" }, { status: 400 });
  }

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith("banners/") && !pathname.startsWith("site/")) throw new Error("Caminho não permitido");
        return {
          // SVG fica de fora de propósito: pode conter scripts.
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp"],
          maximumSizeInBytes: MAX_BANNER_BYTES,
          addRandomSuffix: true,
          validUntil: Date.now() + 10 * 60 * 1000,
        };
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Falha ao autorizar o envio do banner", error);
    return NextResponse.json({ error: "Não foi possível enviar a imagem" }, { status: 400 });
  }
}
