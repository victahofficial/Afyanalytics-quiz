const axios = require('axios')
const prisma = require('./prisma')

const GRAPH_API_VERSION = 'v20.0'

async function syncSocialFeeds() {
    console.log('Starting social feed sync...')
    
    // 1. Check SiteSettings for last sync time
    const lastSyncSetting = await prisma.siteSetting.findUnique({ where: { key: 'social_last_sync' } })
    const now = new Date()
    
    if (lastSyncSetting) {
        const lastSync = new Date(lastSyncSetting.value)
        const hourAgo = new Date(now.getTime() - (60 * 60 * 1000))
        if (lastSync > hourAgo) {
            console.log('Social feed sync skipped: Recently updated.')
            return false
        }
    }

    const {
        FACEBOOK_PAGE_ID,
        FACEBOOK_ACCESS_TOKEN,
        INSTAGRAM_BUSINESS_ID,
        INSTAGRAM_ACCESS_TOKEN,
        YOUTUBE_CHANNEL_ID,
        YOUTUBE_API_KEY
    } = process.env

    const posts = []

    // 2. Fetch Facebook Posts
    if (FACEBOOK_PAGE_ID && FACEBOOK_ACCESS_TOKEN) {
        try {
            const fbRes = await axios.get(`https://graph.facebook.com/${GRAPH_API_VERSION}/${FACEBOOK_PAGE_ID}/feed`, {
                params: {
                    access_token: FACEBOOK_ACCESS_TOKEN,
                    fields: 'message,full_picture,permalink_url,created_time',
                    limit: 5
                }
            })
            
            if (fbRes.data?.data) {
                fbRes.data.data.forEach(item => {
                    posts.push({
                        platform: 'Facebook',
                        content: item.message || '',
                        postUrl: item.permalink_url,
                        imageUrl: item.full_picture,
                        postedAt: new Date(item.created_time)
                    })
                })
            }
        } catch (err) {
            console.error('Error fetching Facebook feed:', err.response?.data || err.message)
        }
    }

    // 3. Fetch Instagram Media
    if (INSTAGRAM_BUSINESS_ID && INSTAGRAM_ACCESS_TOKEN) {
        try {
            const igRes = await axios.get(`https://graph.facebook.com/${GRAPH_API_VERSION}/${INSTAGRAM_BUSINESS_ID}/media`, {
                params: {
                    access_token: INSTAGRAM_ACCESS_TOKEN,
                    fields: 'caption,media_url,permalink,timestamp,media_type',
                    limit: 5
                }
            })

            if (igRes.data?.data) {
                igRes.data.data.forEach(item => {
                    // Filter for IMAGE or VIDEO (CAROUSEL_ALBUM also usually fine)
                    posts.push({
                        platform: 'Instagram',
                        content: item.caption || '',
                        postUrl: item.permalink,
                        imageUrl: item.media_url,
                        postedAt: new Date(item.timestamp)
                    })
                })
            }
        } catch (err) {
            console.error('Error fetching Instagram feed:', err.response?.data || err.message)
        }
    }
    // 4. Fetch YouTube Videos
    if (YOUTUBE_CHANNEL_ID && YOUTUBE_API_KEY) {
        try {
            const ytRes = await axios.get('https://www.googleapis.com/youtube/v3/activities', {
                params: {
                    part: 'snippet,contentDetails',
                    channelId: YOUTUBE_CHANNEL_ID,
                    key: YOUTUBE_API_KEY,
                    maxResults: 5
                }
            })

            if (ytRes.data?.items) {
                ytRes.data.items.forEach(item => {
                    if (item.snippet.type === 'upload') {
                        posts.push({
                            platform: 'YouTube',
                            content: item.snippet.title || '',
                            postUrl: `https://www.youtube.com/watch?v=${item.contentDetails.upload.videoId}`,
                            imageUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
                            postedAt: new Date(item.snippet.publishedAt)
                        })
                    }
                })
            }
        } catch (err) {
            console.error('Error fetching YouTube feed:', err.response?.data || err.message)
        }
    }

    // 4. Update Database
    if (posts.length > 0) {
        // We only keep the latest few posts?
        // Let's create new ones that don't exist
        for (const post of posts) {
            // Check if postUrl already exists to avoid duplicates
            if (!post.postUrl) continue
            
            const existing = await prisma.socialPost.findFirst({
                where: { postUrl: post.postUrl }
            })
            
            if (!existing) {
                await prisma.socialPost.create({ data: post })
            }
        }
        
        // Optional: Cleanup old posts (keep only top 20 total)
        // const allPosts = await prisma.socialPost.findMany({ orderBy: { postedAt: 'desc' }, skip: 20 })
        // const idsToDelete = allPosts.map(p => p.id)
        // if (idsToDelete.length > 0) await prisma.socialPost.deleteMany({ where: { id: { in: idsToDelete } } })
    }

    // 5. Update last sync time
    await prisma.siteSetting.upsert({
        where: { key: 'social_last_sync' },
        update: { value: now.toISOString() },
        create: { key: 'social_last_sync', value: now.toISOString() }
    })

    console.log('Social feed sync completed.')
    return true
}

module.exports = { syncSocialFeeds }
