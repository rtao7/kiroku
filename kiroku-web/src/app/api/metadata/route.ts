import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Fetch the URL and extract metadata
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Kiroku/1.0; +https://kiroku.app)',
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        throw new Error('Failed to fetch URL');
      }

      const html = await response.text();

      // Extract title
      let title = '';
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (titleMatch) {
        title = titleMatch[1].trim();
      }

      // Extract description from meta tags
      let description = '';
      const descriptionMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i) ||
                              html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);
      if (descriptionMatch) {
        description = descriptionMatch[1].trim();
      }

      // Extract OG image
      let image = '';
      const imageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
      if (imageMatch) {
        image = imageMatch[1].trim();
      }

      return NextResponse.json({
        title: title || '',
        description: description || '',
        image: image || '',
      });
    } catch (fetchError) {
      console.error('Error fetching metadata:', fetchError);
      return NextResponse.json({
        title: '',
        description: '',
        image: '',
      });
    }
  } catch (error) {
    console.error('Error processing metadata request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
