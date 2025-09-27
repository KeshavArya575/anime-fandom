// fetch-character.js
const axios = require('axios');

async function fetchCharacterData(characterName) {
  // Replace spaces with underscores for the URL
  const formattedName = characterName.replace(/ /g, '_');
  
  const API_URL = `https://typemoon.fandom.com/api.php`;

  const params = {
    action: 'query',
    format: 'json',
    prop: 'extracts',
    titles: formattedName,
    exintro: true,
    explaintext: true,
    origin: '*',
  };

  try {
    console.log(`Fetching data for ${characterName}...`);
    const response = await axios.get(API_URL, { params });

    // The Fandom API nests the data in a tricky way. We need to parse it.
    const pages = response.data.query.pages;
    const pageId = Object.keys(pages)[0]; // Get the first (and only) page ID

    // Check if the page was found
    if (pageId === "-1") {
      console.log(`Character "${characterName}" not found on the wiki.`);
      return;
    }

    const characterData = pages[pageId];
    const { title, extract } = characterData;

    console.log('\n--- DATA FETCHED ---');
    console.log('Title:', title);
    console.log('Extract:', extract);
    console.log('--------------------\n');

    return { title, extract };

  } catch (error) {
    console.error('Error fetching data from Fandom API:', error.message);
  }
}

// Run the function for the character you want to import
fetchCharacterData('Artoria Pendragon');