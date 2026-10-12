import { NextResponse } from "next/server";
import { z } from "zod";

const Body = z.object({ url: z.string().url().max(2048) });

export async function POST(request: Request) {
  try {
    const parsed = Body.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Enter a valid GitHub repository URL." }, { status: 400 });
    const url = new URL(parsed.data.url);
    if (url.protocol !== "https:" || !["github.com", "www.github.com"].includes(url.hostname.toLowerCase())) {
      return NextResponse.json({ error: "Only public GitHub repository URLs are accepted by this prototype." }, { status: 400 });
    }
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length < 2 || parts.some(p => p === "." || p === "..")) {
      return NextResponse.json({ error: "Use a repository URL like https://github.com/owner/repo." }, { status: 400 });
    }
    return NextResponse.json({ repository: `https://github.com/${parts[0]}/${parts[1]}`, message: "URL shape validated. Repository cloning and code execution are not enabled." });
  } catch {
    return NextResponse.json({ error: "Could not validate repository URL." }, { status: 400 });
  }
}
