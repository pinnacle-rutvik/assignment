const axios = require('axios');
const cheerio = require('cheerio');

const extractLinks = async (url) => {
    try {
        const response = await axios.get(url);
        const data = response.data;
        const $ = cheerio.load(data);

        const links = [];

        // Selecting all anchor tags and extracting href 
        $('a').each((index, element) => {
            const link = $(element).attr('href');
            // Make sure the href attribute exists and is not empty
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

const url = 'https://timesofindia.indiatimes.com/';
extractLinks(url).then((links) => {
    console.log('Total links count:', links.length);


    const findValidUrls = links.filter(href => {
        const validUrls = /articleshow/.test(href) && /cms/.test(href);
        return validUrls;
    });
    if (findValidUrls) {
        console.log('Valid URLs:', findValidUrls);
        console.log('Valid URLs count:', findValidUrls.length);
    }
});