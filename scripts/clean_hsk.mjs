import fs from 'fs';
import path from 'path';

const filePath = path.resolve('./src/data/hsk_vocabulary.json');
const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const map = new Map();

for (const item of raw) {
  if (!map.has(item.hanzi)) {
    // First time seen is its lowest HSK level because we processed level 1, then 2, etc.
    map.set(item.hanzi, {
      id: `hsk-${item.hsk_level}-${map.size + 1}`,
      deck_id: `deck-hsk${item.hsk_level}`,
      hanzi: item.hanzi,
      pinyin: item.pinyin,
      meaning_vi: item.meaning_vi,
      radical: item.radical || '',
      hsk_level: item.hsk_level,
      examples: []
    });
  }
}

const uniqueWords = Array.from(map.values());
console.log(`Deduplicated unique HSK 1-6 vocabulary: ${uniqueWords.length} words`);

// Also add famous Chengyu (Thành ngữ)
const famousChengyu = [
  { hanzi: '马到成功', pinyin: 'mǎ dào chéng gōng', meaning_vi: 'Mã đáo thành công / Đạt thắng lợi tức thì', hsk_level: 6, deck_id: 'deck-chengyu' },
  { hanzi: '一心一意', pinyin: 'yī xīn yī yì', meaning_vi: 'Toàn tâm toàn ý / Một lòng một dạ', hsk_level: 5, deck_id: 'deck-chengyu' },
  { hanzi: '半途而废', pinyin: 'bàn tú ér fèi', meaning_vi: 'Bỏ dở nửa chừng / Không kiên trì', hsk_level: 6, deck_id: 'deck-chengyu' },
  { hanzi: '莫名其妙', pinyin: 'mò míng qí miào', meaning_vi: 'Khó hiểu kỳ quặc không rõ lý do', hsk_level: 5, deck_id: 'deck-chengyu' },
  { hanzi: '卧薪尝胆', pinyin: 'wò xīn cháng dǎn', meaning_vi: 'Nếm mật nằm gai / Kiên nhẫn chịu khổ để phục thù', hsk_level: 6, deck_id: 'deck-chengyu' },
  { hanzi: '画蛇添足', pinyin: 'huà shé tiān zú', meaning_vi: 'Vẽ rắn thêm chân / Làm việc thừa thãi vô ích', hsk_level: 5, deck_id: 'deck-chengyu' },
  { hanzi: '拔苗助长', pinyin: 'bá miáo zhù zhǎng', meaning_vi: 'Dục tốc bất đạt / Nóng vội làm hỏng việc', hsk_level: 5, deck_id: 'deck-chengyu' },
  { hanzi: '井底之蛙', pinyin: 'jǐng dǐ zhī wā', meaning_vi: 'Ếch ngồi đáy giếng / Tầm nhìn hạn hẹp', hsk_level: 5, deck_id: 'deck-chengyu' },
  { hanzi: '自相矛盾', pinyin: 'zì xiāng máo dùn', meaning_vi: 'Tự mâu thuẫn / Trước sau bất nhất', hsk_level: 5, deck_id: 'deck-chengyu' },
  { hanzi: '胸有成竹', pinyin: 'xiōng yǒu chéng zhú', meaning_vi: 'Nắm chắc phần thắng / Đã có tính toán kỹ', hsk_level: 6, deck_id: 'deck-chengyu' },
  { hanzi: '温故知新', pinyin: 'wēn gù zhī xīn', meaning_vi: 'Ôn cũ biết mới / Học hỏi từ quá khứ', hsk_level: 6, deck_id: 'deck-chengyu' },
  { hanzi: '熟能生巧', pinyin: 'shú néng shēng qiǎo', meaning_vi: 'Trăm hay không bằng tay quen', hsk_level: 5, deck_id: 'deck-chengyu' }
];

famousChengyu.forEach((cy, idx) => {
  if (!map.has(cy.hanzi)) {
    uniqueWords.push({
      id: `chengyu-${idx + 1}`,
      deck_id: cy.deck_id,
      hanzi: cy.hanzi,
      pinyin: cy.pinyin,
      meaning_vi: cy.meaning_vi,
      radical: '成语',
      hsk_level: cy.hsk_level,
      examples: []
    });
  }
});

fs.writeFileSync(filePath, JSON.stringify(uniqueWords), 'utf-8');
console.log(`Final vocabulary written to ${filePath}: ${uniqueWords.length} total entries!`);
