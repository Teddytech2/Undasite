import { NextResponse } from "next/server";
import { z } from "zod";

const Body = z.object({
  projectName: z.string().trim().min(1).max(100).regex(/^[a-zA-Z0-9][a-zA-Z0-9-]*$/),
  domain: z.string().trim().max(253).optional().default("")
});

export async function POST(request: Request) {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Project name must use letters, numbers, and hyphens." }, { status: 400 });

  if (!process.env.VERCEL_TOKEN) {
    return NextResponse.json({
      configured: false,
      message: "Deployment is not connected yet. Add VERCEL_TOKEN server-side, then implement authenticated project packaging and the Vercel API deployment flow."
    }, { status: 200 });
  }

  // Deliberately does not deploy arbitrary code. Production deployment requires authenticated
  // ownership checks, validated build artifacts, limits, and secure Vercel API integration.
  return NextResponse.json({
    configured: true,
    projectName: parsed.data.projectName,
    domain: parsed.data.domain || null,
    message: "Vercel token detected. The deployment pipeline is not enabled in this starter; implement project upload and ownership checks before deploying."
  }, { status: 200 });
}
