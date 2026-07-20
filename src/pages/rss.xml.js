import rss from '@astrojs/rss';

const postModules = import.meta.glob('./blog/*.md', { eager: true });

export async function GET(context) {
  const site = context.site ?? new URL('https://peterghiorse.com');
  const posts = await Promise.all(
    Object.values(postModules).map(async (post) => {
      const html = await post.compiledContent();
      const absoluteHTML = html.replace(
        /(src|href)=(['"])\/(?!\/)/g,
        `$1=$2${site.href.replace(/\/$/, '')}/`,
      );

      return {
        title: post.frontmatter.title,
        description: post.frontmatter.description,
        pubDate: new Date(`${post.frontmatter.publishDate}T12:00:00Z`),
        link: post.url,
        content: absoluteHTML,
        categories: post.frontmatter.category ? [post.frontmatter.category] : [],
      };
    }),
  );

  posts.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: 'Pete Ghiorse — Writing',
    description: 'Essays and field reports on what AI actually changes—at work, at home, and inside the products we trust.',
    site,
    items: posts,
    customData: '<language>en-us</language>',
  });
}
