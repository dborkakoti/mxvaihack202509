import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdirSync, existsSync } from 'fs';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const registration_id = data.get('registration_id') as string;

    if (!file || !registration_id) {
      return NextResponse.json({ success: false, error: 'Missing file or registration_id' }, { status: 400 });
    }

    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const fileExtension = file.name.split('.').pop();
    const filename = `${registration_id}.${fileExtension}`;
    const path = join(uploadsDir, filename);
    await writeFile(path, Buffer.from(bytes));

    const selfie_url = `/uploads/${filename}`;

    // Update the registration record in Google Sheet via n8n
    const n8nWebhookUrl = process.env.NEXT_PUBLIC_N8N_UPLOAD_SELFIE_WEBHOOK_URL;
    if (!n8nWebhookUrl) {
      console.error('N8N_UPLOAD_SELFIE_WEBHOOK_URL is not defined');
      return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 });
    }

    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-n8n-api-key': process.env.N8N_API_KEY!,
      },
      body: JSON.stringify({ registration_id, selfie_url }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('n8n webhook failed:', errorBody);
      return NextResponse.json({ success: false, error: 'Failed to update registration' }, { status: 500 });
    }

    const registrationRecord = await response.json();

    // Now trigger the poster generation
    const n8nGeneratePosterUrl = process.env.NEXT_PUBLIC_N8N_GENERATE_POSTER_WEBHOOK_URL;
    if (!n8nGeneratePosterUrl) {
        console.error('NEXT_PUBLIC_N8N_GENERATE_POSTER_WEBHOOK_URL is not defined');
        return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 });
    }

    // This is a fire-and-forget call, we don't wait for the poster to be generated
    fetch(n8nGeneratePosterUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-n8n-api-key': process.env.N8N_API_KEY!,
        },
        body: JSON.stringify({ registration_id, name: registrationRecord.name, selfie_url }),
    });


    return NextResponse.json({ success: true, registrationRecord });
  } catch (error) {
    console.error('Error in poster generation:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}