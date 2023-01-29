module.exports = {
    rewrites: async () => [
        {
            source: '/rss.xml',
            destination: '/api/rss',
        },
        {
            source: "/rss",
            destination: "/api/rss",
        }
    ],
};