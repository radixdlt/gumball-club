import { NextResponse } from 'next/server'
import { config } from '../../config'

export async function GET() {
  return NextResponse.json({
    dApps: [
      {
        dAppDefinitionAddress: config.dAppDefinitionAddress,
      },
    ],
  })
}
