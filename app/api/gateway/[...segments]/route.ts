import { NextRequest, NextResponse } from "next/server";

import { REMOTE_API_BASE_URL } from "@/lib/constants";

async function handler(request: NextRequest, context: { params: { segments?: string[] } }) {
  const segments = context.params.segments ?? [];
  const targetPath = segments.join("/");
  const search = request.nextUrl.searchParams.toString();

  const url = `${REMOTE_API_BASE_URL}/${targetPath}${search ? `?${search}` : ""}`;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("content-type", contentType);
  }
  const authorization = request.headers.get("authorization");
  if (authorization) {
    headers.set("authorization", authorization);
  }

  const init: RequestInit = {
    method: request.method,
    headers,
    cache: "no-store",
  };

  if (!["GET", "HEAD"].includes(request.method)) {
    const body = await request.text();
    init.body = body;
  }

  try {
    const response = await fetch(url, init);
    const responseBuffer = await response.arrayBuffer();
    const responseHeaders = new Headers();
    const upstreamContentType = response.headers.get("content-type");
    if (upstreamContentType) {
      responseHeaders.set("content-type", upstreamContentType);
    }
    return new NextResponse(responseBuffer, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch {
    return NextResponse.json(
      { message: "No se pudo conectar con el servicio externo." },
      { status: 502 },
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
