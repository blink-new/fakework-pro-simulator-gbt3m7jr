import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response('Unauthorized', { status: 401 });
    }

    const token = authHeader.substring(7);
    const url = new URL(req.url);
    const maxResults = url.searchParams.get('max_results') || '10';
    const sinceId = url.searchParams.get('since_id');

    // Build Twitter API URL
    const twitterUrl = new URL('https://api.twitter.com/2/users/me/timelines/reverse_chronological');
    twitterUrl.searchParams.set('max_results', maxResults);
    twitterUrl.searchParams.set('tweet.fields', 'created_at,author_id,public_metrics,context_annotations,entities');
    twitterUrl.searchParams.set('user.fields', 'name,username,profile_image_url,verified');
    twitterUrl.searchParams.set('expansions', 'author_id,attachments.media_keys');
    twitterUrl.searchParams.set('media.fields', 'type,url,preview_image_url');
    
    if (sinceId) {
      twitterUrl.searchParams.set('since_id', sinceId);
    }

    // Fetch timeline from Twitter API
    const response = await fetch(twitterUrl.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'FakeWorkPro/1.0',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Twitter API error:', error);
      return new Response(`Twitter API error: ${error}`, { 
        status: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const data = await response.json();
    
    // Transform the data for easier consumption
    const transformedData = {
      tweets: data.data?.map((tweet: any) => {
        const author = data.includes?.users?.find((user: any) => user.id === tweet.author_id);
        const media = tweet.attachments?.media_keys?.map((key: string) => 
          data.includes?.media?.find((m: any) => m.media_key === key)
        ).filter(Boolean) || [];

        return {
          id: tweet.id,
          text: tweet.text,
          created_at: tweet.created_at,
          author: {
            id: author?.id,
            name: author?.name,
            username: author?.username,
            profile_image_url: author?.profile_image_url,
            verified: author?.verified || false,
          },
          metrics: tweet.public_metrics,
          media: media,
          entities: tweet.entities,
          context_annotations: tweet.context_annotations,
        };
      }) || [],
      meta: data.meta || {},
    };

    return new Response(JSON.stringify(transformedData), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Timeline fetch error:', error);
    return new Response(`Internal Server Error: ${error.message}`, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
});