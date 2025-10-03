import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();

  // console.log(JSON.stringify(process.env.NEXT_PUBLIC_N8N_REGISTER_WEBHOOK_URL))
  console.log(JSON.stringify(process.env.N8N_API_KEY))
  console.log(JSON.stringify(body))
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_N8N_REGISTER_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.N8N_API_KEY,
      },
      body: JSON.stringify(body),
    });
    console.log(JSON.stringify(response))
    if (!response.ok) {
      const errorText = await response.text();
      console.log(errorText)
      return new NextResponse(errorText, { status: response.status });
    }

    const data = await response.json();
    console.log(JSON.stringify(data))
    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
