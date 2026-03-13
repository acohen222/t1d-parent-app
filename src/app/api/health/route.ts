export async function GET() {
  const configured = !!process.env.ANTHROPIC_API_KEY;
  const keyPreview = configured
    ? `${process.env.ANTHROPIC_API_KEY!.slice(0, 10)}...`
    : null;

  return Response.json({ configured, keyPreview });
}
