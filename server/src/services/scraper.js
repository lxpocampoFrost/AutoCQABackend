const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeText(url) {
  try {
    function hasTextContent($element) {
      return $element.text().trim().length > 0;
    }

    const scrapedData = [];
    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);

    let textElements = $('body').find('*');
    let pageTitle = $('title').text().trim();

    const elementsWithText = textElements.filter(function() {
      return hasTextContent($(this)) || $(this).find(hasTextContent);
    });

    elementsWithText.each((index, element) => {
      const textContent = $(element).text().trim();

      if (textContent) { 
        scrapedData.push({ content: textContent });
      }
    });

    return {
      scrapedData: scrapedData,
      pageTitle: pageTitle
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = scrapeText;