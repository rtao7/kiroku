import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Link from '@/models/Link';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key');
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key required' }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ apiKey });
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    const body = await request.json();
    const { links } = body;

    if (!Array.isArray(links)) {
      return NextResponse.json({ error: 'Links must be an array' }, { status: 400 });
    }

    const results = {
      created: 0,
      skipped: 0,
      errors: [] as string[],
    };

    for (const linkData of links) {
      try {
        const { url } = linkData;
        
        if (!url) {
          results.errors.push('URL is required');
          continue;
        }

        const urlObj = new URL(url);
        const domain = urlObj.hostname;

        const existingLink = await Link.findOne({
          userId: user._id.toString(),
          url: url,
        });

        if (existingLink) {
          results.skipped++;
          continue;
        }

        const newLink = new Link({
          url,
          title: linkData.title || '',
          description: linkData.description || '',
          domain,
          userId: user._id.toString(),
          tags: linkData.tags || [],
          isFavorite: linkData.isFavorite || false,
        });

        await newLink.save();
        results.created++;
      } catch (error) {
        results.errors.push(`Error processing ${linkData.url}: ${error}`);
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error syncing links:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key');
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key required' }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ apiKey });
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const lastSync = searchParams.get('lastSync');

    const query: any = { userId: user._id.toString() };
    
    if (lastSync) {
      query.updatedAt = { $gte: new Date(lastSync) };
    }

    const links = await Link.find(query).sort({ updatedAt: -1 });

    return NextResponse.json({ links });
  } catch (error) {
    console.error('Error fetching sync data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}