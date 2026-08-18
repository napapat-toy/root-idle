# 🌱 รากมหัศจรรย์ (Root Idle)

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Status](https://img.shields.io/badge/Status-Complete-brightgreen?style=for-the-badge)

**เกม Idle ปลูกรากไม้สไตล์เซน — รดน้ำ รอ และดูรากแผ่ขยายเองไปเรื่อยๆ ใต้ผืนดิน**

[🎮 เล่นเกม](#-getting-started) • [✨ จุดเด่นของเกม](#-game-features) • [🛠️ เทคโนโลยี](#-tech-stack) • [🚀 การติดตั้งและรัน](#-getting-started)

</div>

---

## 📖 เกี่ยวกับเกม (About)

**รากมหัศจรรย์ (Root Idle)** เป็นเกมแนว Incremental / Idle Game ที่เน้นความผ่อนคลายและการเติบโตอย่างต่อเนื่องแบบ Procedural กิ่งก้านและรากฝอยทุกเส้นจะคำนวณและงอกเงยตามการตัดสินใจซื้อรากเสริมประเภทต่างๆ ผู้เล่นสามารถอัพเกรดราก, สะท้อนราก (Echo), เก็บเกี่ยวสารอาหาร, ปลดล็อกสกินสีสัน, และหว่านใหม่ (Prestige) เพื่อสะสมเมล็ดนิรันดร์

---

## ✨ จุดเด่นของเกม (Game Features)

### 🌿 1. ระบบรากแผ่ขยายตามธรรมชาติ (Procedural Root Generation)
- กราฟิก SVG แบบเรียลไทม์ที่วาดกิ่งก้านและรากฝอยเติบโตลงสู่ใต้ดินลึกขึ้นเรื่อยๆ ตามจำนวนและประเภทของรากที่ซื้อ
- เพิ่มประสิทธิภาพด้วย **SVG Path Batching** และ **React.memo** ทำให้เกมเรนเดอร์ได้ลื่นไหล 60 FPS บนทุกอุปกรณ์

### 🤖 2. ระบบออโต้ซื้อรากอัจฉริยะ (Smart Lookahead Auto-Buyer)
- เลือกระดับการทำงานได้ 3 ระดับ:
  - **🤖 ถูกที่สุด (Basic):** ซื้อรากเสริมที่ราคาถูกที่สุดที่มีเงินพอซื้อ
  - **🧠 อัจฉริยะ (Smart):** คำนวณล่วงหน้า 1–2 นาที เก็บสารอาหารรอซื้อรากที่คุ้มและให้เรตการผลิตสูงสุด
  - **♾️ ทุกสรรพสิ่ง (All):** ออโต้ซื้อรากเสริม + อัพเกรดราก + สะท้อนรากให้อัตโนมัติ

### 🌌 3. การหว่านใหม่เพื่อสะสมเมล็ดนิรันดร์ (Prestige & Eternal Seeds)
- รีเซ็ตเพื่อรับ **เมล็ดนิรันดร์ (Eternal Seeds)** นำไปอัพเกรดร้านค้าถาวร:
  - วัฒนธรรมเริ่มต้น (Starter Roots)
  - เมล็ดพันธุ์ทองคำ (Golden Seeds Boost)
  - อัตราผลิตสารอาหารแฝง (Passive Rate)
  - ออโต้อีเว้น (Auto Event Clicker) และ ออโต้หว่านใหม่ (Auto Reset)
  - ขยายเวลาความจุออฟไลน์สูงสุด 72 ชั่วโมง

### 🍀 4. อีเวนต์สุ่มและแจ็กพอตโชคดี (Random Events & Lucky Buff)
- อีเวนต์สายฟ้า (⚡ เร่งเรต), ของขวัญ (🎁 สารอาหารก้อนโต), และ **ใบโคลเวอร์ (🍀 โชคดี ×777)**
- บัฟโชคดีสามารถอัพเกรดระยะเวลาเพิ่มขึ้นได้ทีละ +1 วินาที จนถึงสูงสุด **60 วินาที**

### 🎨 5. สกินสีสันรากไม้ (Custom Root Skins)
- **ปกติ (Normal):** สีตามประเภทรากไม้
- **รุ้ง/ทอง (Rainbow/Gold):** ลำต้นทองคำพร้อมรากหลากสีสัน
- **รากเดียวกัน (Same Origin):** จำแนกกลุ่มสีตามสายเลือดของแขนงกิ่งหลัก
- **ขาวดำ (Grayscale):** โทนสีมินิมอล ไล่น้ำหนักความลึก
- **ไล่เข้ม-อ่อน (Earth Gradient):** โทนสีเขียวธรรมชาติ

### 💾 6. ระบบบันทึกข้อมูลครบวงจร (Save & Storage Management)
- บันทึกความคืบหน้าอัตโนมัติลงใน `localStorage`
- มีสล็อตบันทึก 3 ช่องอิสระ พร้อมระบบส่งออก/นำเข้ารหัสเซฟ (Export/Import Save Code)
- คำนวณความคืบหน้าขณะปิดเกม (Offline Progress)

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI Library:** [React 19](https://react.dev/)
- **Styling:** Vanilla CSS (Tailored Design Tokens & Glassmorphism)
- **Graphics:** Procedural Vector SVG Generation

---

## 🚀 การติดตั้งและรันโปรเจกต์ (Getting Started)

### ข้อกำหนดเบื้องต้น
- [Node.js](https://nodejs.org/) (เวอร์ชัน 18.17 หรือใหม่กว่า)
- npm, pnpm หรือ yarn

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. เริ่มต้น Development Server
```bash
npm run dev
```
เปิดบราวเซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

### 3. Build สำหรับ Production
```bash
npm run build
npm run start
```

---

## 📱 การรองรับอุปกรณ์ (Responsive Design)

เกมได้รับการออกแบบด้วยแนวคิด **Mobile-First**:
- ปรับขนาดอัตโนมัติบนหน้าจอทุกขนาด (มือถือ 360px จนถึง Desktop จอกว้าง)
- ตัวเลขสารอาหารคมชัดขนาดใหญ่ (Hero Stats Box)
- แถบเครื่องมือควบคุมแถวเดียว ไม่ตกหล่นหรือบังหน้าจอการเล่น
- รองรับ Safe Area Insets บน iOS และ Android

---

## 📄 ใบอนุญาต (License)

โปรเจกต์นี้เปิดให้ใช้งานและพัฒนาต่อยอดได้ตามเงื่อนไขของ [MIT License](LICENSE)
