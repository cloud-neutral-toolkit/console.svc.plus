
const fs = require('node:fs/promises');
const path = require('node:path');
const matter = require('gray-matter');

const CONTENT_DIR = path.join(process.cwd(), 'src/content');

async function collectMarkdownEntries(dir, rootDir) {
    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        const results = [];

        for (const entry of entries) {
            const entryPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                results.push(...(await collectMarkdownEntries(entryPath, rootDir)));
                continue;
            }

            if (entry.isFile() && entry.name.endsWith('.md')) {
                const relativePath = path.relative(rootDir, entryPath).replace(/\\/g, '/');
                results.push({
                    filePath: entryPath,
                    slug: relativePath.replace(/\.md$/, ''),
                });
            }
        }
        return results;
    } catch (e) {
        if (e.code === 'ENOENT') return [];
        throw e;
    }
}

async function readMarkdownFiles(type) {
    const dir = path.join(CONTENT_DIR, type);
    const entries = await collectMarkdownEntries(dir, dir);

    const items = await Promise.all(
        entries.map(async (entry) => {
            const raw = await fs.readFile(entry.filePath, 'utf8');
            const { data, content } = matter(raw);
            return {
                slug: entry.slug,
                ...data,
                content,
            };
        }),
    );

    return items.sort((a, b) => a.slug.localeCompare(b.slug));
}

function filterPostsByLanguage(posts, language) {
    const groups = new Map();

    for (const post of posts) {
        if (post.slug.includes('social/')) {
            continue;
        }

        const match = post.slug.match(/^(.*)_(en|zh)$/);
        const baseSlug = match ? match[1] : post.slug;

        if (!groups.has(baseSlug)) {
            groups.set(baseSlug, []);
        }
        groups.get(baseSlug).push(post);
    }

    const filtered = [];

    for (const group of groups.values()) {
        if (language === 'zh') {
            const match = group.find(p => p.slug.endsWith('_zh')) || group.find(p => !p.slug.match(/_(en|zh)$/));
            if (match) {
                filtered.push(match);
            }
        } else {
            const match = group.find(p => p.slug.endsWith('_en'));
            if (match) {
                filtered.push(match);
            }
        }
    }

    return filtered;
}

async function main() {
    console.log('--- Debugging Content Loading ---');
    console.log(`Content Dir: ${CONTENT_DIR}`);

    try {
        const allPosts = await readMarkdownFiles('blog');
        console.log(`Found ${allPosts.length} raw posts.`);

        allPosts.forEach(p => console.log(` - ${p.slug}`));

        const zhPosts = filterPostsByLanguage(allPosts, 'zh');
        console.log(`\nFiltered (zh): ${zhPosts.length} posts.`);
        zhPosts.forEach(p => console.log(` - ${p.slug}`));

        const enPosts = filterPostsByLanguage(allPosts, 'en');
        console.log(`\nFiltered (en): ${enPosts.length} posts.`);

    } catch (e) {
        console.error('Error:', e);
    }
}

main();
