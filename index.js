const axios = require('axios');
const cheerio = require('cheerio');
const connection = require('./db');

const extractLinks = async (url) => {
    try {
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

        return links;
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

// Main function to extract, filter and insert URLs
const scrapeAndInsertValidUrls = async (url) => {

    const links = await extractLinks(url);
    console.log('Total links count:', links.length);

    const validUrls = links.filter(href => /articleshow/.test(href) && /cms/.test(href));

    // If valid URLs are found, insert them into MySQL
    if (validUrls.length > 0) {
        console.log('Valid URLs:', validUrls);
        console.log('Valid URLs count:', validUrls.length);
        insertValidUrls(validUrls);
    } else {
        console.log('No valid URLs found.');
    }
};

const url = 'https://timesofindia.indiatimes.com/';
scrapeAndInsertValidUrls(url);