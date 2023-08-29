import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    dApps: [
      {
        dAppDefinitionAddress: process.env.NEXT_PUBLIC_DAPP_DEFINITION_ADDRESS,
      },
    ],
  })
}
