const fs = require('fs')
const globby = require('globby')
const prettier = require('prettier')
const path = require('path')

; (async () => {

    const pages = await globby([
        'pages/*.tsx',
        '_posts/**/*.md',
        '!pages/_*.tsx',
        '!pages/api',
    ])
    var parse = path.parse;
    const sitemap = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${pages
            .map((page) => {
                //var fileName = parse(page).name;
                //var url = `https://blog.antosubash.com/posts/${fileName}`;
                var fileName = parse(page).name;
                var route = fileName === 'index' ? '' : `/posts/${fileName}`;
                return `
                        <url>
                            <loc>https://blog.antosubash.com${route}</loc>
                            <lastmod>${new Date().toISOString()}</lastmod>
                            <priority>0.80</priority>
                        </url>
                    `
            })
            .join('')}
        </urlset>
    `

    const formatted = prettier.format(sitemap, {
        parser: 'html',
    })

    // eslint-disable-next-line no-sync
    fs.writeFileSync('public/sitemap.xml', formatted)
})()