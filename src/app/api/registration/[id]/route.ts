import { NextRequest, NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: NextRequest, context: any) {
  const id = context?.params?.id;

  try {
    const webhookUrl = `${process.env.NEXT_PUBLIC_N8N_GET_REGISTRATION_DATA_WEBHOOK_URL}?registration_id=${id}`;
    const apiKey = process.env.N8N_API_KEY;

    if (!process.env.NEXT_PUBLIC_N8N_GET_REGISTRATION_DATA_WEBHOOK_URL || !apiKey) {
      console.error('N8N_GET_REGISTRATION_DATA_WEBHOOK_URL or N8N_API_KEY is not defined');
      return new NextResponse('Server configuration error', { status: 500 });
    }

    const response = await fetch(webhookUrl, {
      headers: {
        'X-API-Key': apiKey,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      return new NextResponse(errorText, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
