const axios = require('axios');

async function scrapeTimesOfIndia() {
    try {
        const url = 'https://timesofindia.indiatimes.com/';

        const { data } = await axios.get(url);

        const links = extractLinks(data);

        const validLinks = filterValidLinks(links);

        console.log(`Total Links Scraped: ${links.length}`);
        console.log("Valid Article Links:", validLinks);
        console.log(`Valid Article Links count: ${validLinks.length}`);

    } catch (error) {
        console.error("Error scraping the website:", error);
    }
}


function extractLinks(html) {
    
    const linkRegex = /href="(https?:\/\/[^"]+)"/g;
    const links = [];
    let match;

   
    while ((match = linkRegex.exec(html)) !== null) {
        links.push(match[1]); 
    }
    return links;
}

function filterValidLinks(links) {
    const validLinks = links.filter(link => link.includes('articleshow') && link.includes('cms'));
    return validLinks;
}


scrapeTimesOfIndia();
