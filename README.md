# 🀄 HanziDeck - Nền tảng học từ mới Tiếng Trung kết hợp Hanzii & Quizlet

> Website học từ vựng tiếng Trung toàn diện với trải nghiệm Flashcard 3D, từ điển phân tích bộ thủ, trích xuất từ vựng tự động từ đoạn văn, giao diện **Liquid Glass** kiểu Apple, và **Trợ lý AI Gemini 3.5 Flash Lite** sửa ngữ pháp & luyện phát âm.

Tên miền triển khai: `hanzideck.brianthecrab.id.vn`

---

## 🌟 Điểm nổi bật & Tính năng chính

### 1. 🗂️ Học Flashcard & Trắc nghiệm phong cách Quizlet
- **Thẻ lật 3D (3D Flip Card):**
  - Mặt trước: Chữ Hán to bản, cấp độ HSK, số nét, nút phát âm thanh.
  - Mặt sau: Phiên âm Pinyin, âm Hán Việt, nghĩa tiếng Việt/tiếng Anh, phân tích bộ thủ & các câu ví dụ thực tế.
  - Phím tắt thông minh: Nhấn `Phím Cách (Space)` để lật thẻ, `Mũi tên Trái [←] / Phải [→]` để chuyển từ, `Phím [A]` để nghe đọc.
- **Chế độ Luyện Trắc nghiệm (Quiz Mode):**
  - Tự động sinh câu hỏi trắc nghiệm 4 đáp án: *Chữ Hán ➔ Nghĩa*, *Nghĩa ➔ Chữ Hán*, *Nghe phát âm ➔ Chọn Chữ Hán*.
  - Hiệu ứng pháo hoa chúc mừng (confetti) khi đạt điểm cao.

### 2. 📖 Tra cứu Từ điển phong cách Hanzii
- Tra cứu nhanh tức thì theo Chữ Hán (汉字), Pinyin (không dấu hoặc có dấu), âm Hán Việt hoặc nghĩa tiếng Việt.
- Bóc tách chi tiết: Bộ thủ cấu thành (Radicals), số nét viết, ví dụ song ngữ.
- 1-Click: Thêm ngay từ vào bất kỳ Bộ thẻ (Deck) nào hoặc đưa vào Ngăn xếp học hôm nay (Daily Stack).

### 3. ✂️ Bóc tách từ vựng thông minh từ văn bản (Smart Text Extractor)
- Dán bất kỳ đoạn văn bản tiếng Trung nào (bài báo, hội thoại, tin tức...).
- Hệ thống tự động phân tách từ vựng chuẩn xác bằng `Intl.Segmenter` (chuẩn ECMAScript hiện đại).
- So sánh với kho từ bạn đã học để đánh dấu nổi bật các **Từ mới chưa biết**.
- Bấm vào bất kỳ từ nào để tra nghĩa nhanh hoặc bấm *"Thêm tất cả từ mới vào bộ học"* chỉ với 1 cú nhấp chuột.

### 4. 📅 Ngăn xếp học theo ngày & Mục tiêu ngày (Daily Stack)
- Quản lý hàng đợi từ vựng chờ học.
- Tùy chỉnh mục tiêu ngày (Daily Goal): 5, 10, 20, 30 từ/ngày.
- Theo dõi tiến độ học trong ngày và chuỗi ngày học liên tục (Streak Counter).

### 5. 🤖 Trợ lý AI Gemini 3.5 Flash Lite (Sửa Ngữ pháp & Luyện Phát âm)
- **Bảo mật API Key qua Cookie:** Người dùng tự nhập API Key tại phần Cài đặt. Key được lưu an toàn trong Cookie trình duyệt máy khách (`SameSite=Strict`), không lưu vào cơ sở dữ liệu chung và không chuyển tiếp qua máy chủ trung gian.
- **Sửa lỗi Ngữ pháp & Gợi ý Nâng cao (Enhance):** Phát hiện lỗi trật tự từ, lượng từ, giải thích chi tiết bằng tiếng Việt và gợi ý các mẫu câu bản xứ/thành ngữ HSK cao cấp hơn.
- **Phân tích Phát âm & Biến điệu (Pronunciation Coach):** Chỉ rõ các quy tắc biến điệu thanh điệu trong câu (không bù, biến điệu nhất, 2 thanh 3 liền nhau), lưu ý khẩu hình các âm dễ nhầm (zh/ch/sh vs z/c/s).
- **Luyện nói qua Microphone:** Bấm micro đọc câu tiếng Trung, AI sẽ so sánh và chấm điểm độ chính xác phát âm.

### 6. 🎨 Giao diện Liquid Glass & 10 Bộ màu tuyển chọn
- Hiệu ứng kính mờ chuẩn Apple với thanh trượt chỉnh trực quan độ mờ nền (`Blur`) và độ trong suốt (`Opacity`).
- 10 Profile màu sắc độc đáo:
  1. 🌿 **Cẩm Thạch Đế Vương (Imperial Jade)**
  2. 🏮 **Tử Cấm Thành (Forbidden City Crimson)**
  3. 🌸 **Hoa Anh Đào (Sakura Blossom)**
  4. ⚡ **Thượng Hải Neon (Cyber Shanghai)**
  5. 🌊 **Đại Dương Thẳm (Deep Ocean)**
  6. 🍂 **Ngân Hạnh Thu (Autumn Ginkgo)**
  7. 🍵 **Trà Đạo Zen (Matcha Zen)**
  8. 🔮 **Thạch Anh Đêm (Midnight Amethyst)**
  9. 🪨 **Đá Phiến Tối Giản (Minimalist Slate)**
  10. 🌅 **Hoàng Hôn San Hô (Sunset Coral)**
- Chuyển đổi linh hoạt 3 ngôn ngữ giao diện: **Tiếng Việt**, **English**, **中文 (Tiếng Trung)**.

### 7. 🔊 Hệ thống Audio Tiếng Trung 3 Lớp
- **Ưu tiên 1:** Web Speech API trình duyệt (`SpeechSynthesisUtterance`, `zh-CN`) miễn phí 100%, không tốn tài nguyên, giọng đọc Beijing bản xứ.
- **Ưu tiên 2:** Dynamic TTS stream URL fallback.
- **Ưu tiên 3:** Hỗ trợ link file âm thanh thu âm người thật bên ngoài nếu có.

---

## 🛠️ Hướng dẫn cài đặt & Triển khai

### 1. Chạy thử nghiệm trên máy cục bộ (Local Development)

```powershell
# Chuyển vào thư mục dự án
cd C:\Users\Legion\.gemini\antigravity\scratch\hanzideck

# Cài đặt dependencies (đã hoàn thành)
npm install

# Khởi chạy môi trường phát triển
npm run dev
```
Mở trình duyệt truy cập: `http://localhost:3000`

---

### 2. Thiết lập Cơ sở dữ liệu Supabase

1. Truy cập [Supabase.com](https://supabase.com) và tạo một Project mới (miễn phí).
2. Vào mục **SQL Editor** trong thanh điều hướng bên trái.
3. Mở file `supabase/schema.sql` trong dự án HanziDeck, copy toàn bộ nội dung và dán vào SQL Editor, sau đó bấm **Run**.
4. Vào mục **Project Settings** ➔ **API**:
   - Copy **Project URL** dán vào biến `NEXT_PUBLIC_SUPABASE_URL`
   - Copy **anon public key** dán vào biến `NEXT_PUBLIC_SUPABASE_ANON_KEY` trong file `.env.local`.

---

### 3. Đưa mã nguồn lên GitHub

```powershell
cd C:\Users\Legion\.gemini\antigravity\scratch\hanzideck

# Khởi tạo git và commit
git init
git add .
git commit -m "feat: initial commit HanziDeck with 3D flashcards, Hanzii dict, liquid glass, and Gemini AI coach"

# Liên kết tới kho GitHub của bạn (thay username của bạn vào)
# git remote add origin https://github.com/your-username/HanziDeck.git
# git branch -M main
# git push -u origin main
```

---

### 4. Triển khai lên Vercel & Cấu hình tên miền `hanzideck.brianthecrab.id.vn`

1. Truy cập [Vercel.com](https://vercel.com) ➔ Bấm **Add New...** ➔ **Project** ➔ Chọn repo `HanziDeck` từ GitHub của bạn.
2. Trong phần **Environment Variables**, thêm 2 biến:
   - `NEXT_PUBLIC_SUPABASE_URL`: (URL Supabase của bạn)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Anon key của bạn)
3. Bấm **Deploy**. Vercel sẽ tự động build và cấp cho bạn một domain dạng `hanzideck-xxx.vercel.app`.
4. **Cài đặt tên miền tùy chỉnh:**
   - Trong dashboard Vercel của dự án, vào **Settings** ➔ **Domains**.
   - Nhập tên miền: `hanzideck.brianthecrab.id.vn` ➔ Bấm **Add**.
   - Vercel sẽ hiển thị bản ghi DNS cần cấu hình.
5. **Cấu hình DNS tại nhà cung cấp tên miền của bạn (`brianthecrab.id.vn`):**
   - Tạo bản ghi mới:
     - **Type:** `CNAME`
     - **Name (Host):** `hanzideck`
     - **Target (Value):** `cname.vercel-dns.com`
     - **Proxy status:** Tắt (DNS Only nếu dùng Cloudflare) hoặc để tự động.
   - Chờ từ 1-5 phút để bản ghi DNS có hiệu lực và SSL được Vercel tự động kích hoạt.
