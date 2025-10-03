import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_N8N_GET_REGISTRATION_DATA_WEBHOOK_URL}?registration_id=${id}`, {
      headers: {
        'X-API-Key': process.env.N8N_API_KEY,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      return new NextResponse(errorText, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
  return NextResponse.json({});
}
