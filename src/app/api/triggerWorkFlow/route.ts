import { NextResponse } from "next/server";
import { triggerKestraWorkflow } from "@/../lib/kestra";

export async function POST(req: Request) {
  const { category } = await req.json();

  const result = await triggerKestraWorkflow(category);

  return NextResponse.json({
    status: result ? "Workflow Triggered" : "Failed",
  });
}
