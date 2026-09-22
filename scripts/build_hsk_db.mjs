import fs from 'fs';
import path from 'path';

async function fetchHskLevel(level) {
  const url = `https://raw.githubusercontent.com/drkameleon/complete-hsk-vocabulary/main/wordlists/inclusive/new/${level}.json`;
  console.log(`Fetching HSK ${level} from ${url}...`);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch HSK ${level}: ${res.status}`);
  }
  const data = await res.json();
  console.log(`HSK ${level} fetched: ${data.length} items`);
  return data.map((item, idx) => {
    const primaryForm = item.forms?.[0] || {};
    const pinyin = primaryForm.transcriptions?.pinyin || '';
    const meanings = primaryForm.meanings || [];
    const meaning = Array.isArray(meanings) ? meanings.slice(0, 3).join('; ') : String(meanings);

    return {
      id: `hsk${level}-${idx + 1}`,
      deck_id: `deck-hsk${level}`,
      hanzi: item.simplified,
      pinyin: pinyin,
      meaning_vi: meaning,
      radical: item.radical || '',
      hsk_level: level,
      frequency: item.frequency || 0,
      examples: []
    };
  });
}

async function main() {
  try {
    const outDir = path.resolve('./src/data');
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const allWords = [];
    // Fetch levels 1 to 6 (or 1 to 3 if high levels take long, let's fetch 1 to 6!)
    for (let level = 1; level <= 6; level++) {
      try {
        const words = await fetchHskLevel(level);
        allWords.push(...words);
      } catch (err) {
        console.error(`Error fetching level ${level}:`, err.message);
      }
    }

    console.log(`Total HSK 3.0 words collected: ${allWords.length}`);
    const targetFile = path.join(outDir, 'hsk_vocabulary.json');
    fs.writeFileSync(targetFile, JSON.stringify(allWords, null, 2), 'utf-8');
    console.log(`Successfully written to ${targetFile}`);
  } catch (err) {
    console.error('Build HSK failed:', err);
    process.exit(1);
  }
}

main();
