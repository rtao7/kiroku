import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Link from '@/models/Link';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';

    const query: any = { userId: session.user.id };
    
    if (search) {
      query.$or = [
        { url: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { domain: { $regex: search, $options: 'i' } },
      ];
    }

    const links = await Link.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Link.countDocuments(query);

    return NextResponse.json({
      links,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function fetchMetadata(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Kiroku/1.0)',
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return { title: '', description: '' };
    }

    const html = await response.text();

    let title = '';
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      title = titleMatch[1].trim();
    }

    let description = '';
    const descriptionMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i) ||
                            html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);
    if (descriptionMatch) {
      description = descriptionMatch[1].trim();
    }

    return { title, description };
  } catch (error) {
    return { title: '', description: '' };
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    let { url, title, description, tags } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    await dbConnect();

    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;

      const existingLink = await Link.findOne({
        userId: session.user.id,
        url: url,
      });

      if (existingLink) {
        return NextResponse.json({ error: 'Link already exists' }, { status: 400 });
      }

      // Fetch metadata if title or description not provided
      if (!title || !description) {
        const metadata = await fetchMetadata(url);
        if (!title) title = metadata.title;
        if (!description) description = metadata.description;
      }

      const newLink = new Link({
        url,
        title: title || '',
        description: description || '',
        domain,
        userId: session.user.id,
        tags: tags || [],
      });

      await newLink.save();

      return NextResponse.json(newLink, { status: 201 });
    } catch (urlError) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error creating link:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}