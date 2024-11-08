const axios = require('axios');
const cheerio = require('cheerio');
const connection = require('./db');

const extractLinks = async (urls) => {
    const allLinks = [];
    try {
        for (let url of urls) {
            const response = await axios.get(url);
            const data = response.data;
            const $ = cheerio.load(data);

            const links = [];

            $('a').each((index, element) => {
                const link = $(element).attr('href');
                if (link && link.trim() !== '') {
                    links.push(link);
                }
            });

            allLinks.push({ url, links });
        }
        return allLinks;
    } catch (error) {
        console.error('Error fetching or parsing the webpage:', error);
        return [];
    }
};

const insertValidUrls = (urls) => {
    urls.forEach(url => {
        connection.execute(
            'INSERT INTO valid_urls (url) VALUES (?)',
            [url],
            (err, results) => {
                if (err) {
                    console.error('Error inserting URL:', err);
                }
            }
        );
    });
    console.log(`Inserted ${urls.length} valid URLs.`);
};

const scrapeAndInsertValidUrls = async (urls) => {
    try {
        const allLinks = await extractLinks(urls);
        console.log(`Scraped links from ${urls.length} URLs`);

        const validUrls = [];

        allLinks.forEach(({ url, links }) => {

            const filteredLinks = links.filter(href => /articleshow/.test(href) && /cms/.test(href));

            if (filteredLinks.length > 0) {
                validUrls.push(...filteredLinks);
            } else {
                console.log(`No valid URLs found for ${url}.`);
            }
        });

        if (validUrls.length > 0) {
            console.log('Inserting valid URLs...');
            insertValidUrls(validUrls);
        } else {
            console.log('No valid URLs to insert.');
        }
    } catch (error) {
        console.error('Error scraping and inserting URLs:', error);
    }
};

const getSourceUrls = () => {
    connection.execute(
        'SELECT url FROM urls',
        async (err, results) => {
            if (err) {
                console.error('Error fetching URLs from DB:', err);
                return;
            }

            if (results && results.length > 0) {
                console.log(`Found ${results.length} URLs in the database.`);
                const urls = results.map(result => result.url);
                await scrapeAndInsertValidUrls(urls);
            } else {
                console.log('No URLs found in the database.');
            }
        }
    );
};

// Start the process
getSourceUrls();
