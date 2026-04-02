# 🏰 Luxury Estate Showcase - Project Run Instructions

## Project Structure

```
├── artifacts/
│   ├── dar-al-naseem/        # Frontend (React + Vite)
│   ├── api-server/           # Backend (Express.js) - Optional
│   └── mockup-sandbox/       # Design sandbox
├── lib/
│   ├── api-client-react/     # API client library
│   ├── api-spec/             # OpenAPI specification
│   ├── api-zod/              # Zod schemas
│   └── db/                   # Database schema (Drizzle)
└── scripts/                  # Utility scripts
```

## ⚡ Quick Start (Frontend Only - Recommended for Demo)

### Prerequisites
- **Node.js**: v18+ 
- **pnpm**: v8+ (install via `npm install -g pnpm`)

### Step 1: Install Frontend Dependencies
```bash
cd artifacts/dar-al-naseem
pnpm install
```

### Step 2: Start Development Server
```bash
pnpm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  press h + enter to show help
```

### Step 3: Open in Browser
Navigate to: **http://localhost:5173**

---

## 🔧 Full Setup (Frontend + Backend)

### Backend Setup (Optional)

If your Google Apps Script is fully configured, you may not need the backend. But to run it locally:

#### Step 1: Install Backend Dependencies
```bash
cd artifacts/api-server
pnpm install
```

#### Step 2: Create Environment File
Create `artifacts/api-server/.env`:
```env
# Server Config
PORT=3000
NODE_ENV=development

# Email Notifications (Optional)
RESEND_API_KEY=your_resend_key_here
SENDGRID_API_KEY=your_sendgrid_key_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Email Recipients
ADMIN_EMAIL=rasoolkhan990880@gmail.com
```

#### Step 3: Start Backend Server
```bash
pnpm run dev
```

**Expected Output:**
```
Server running on http://localhost:3000
✓ Health check endpoint: GET http://localhost:3000/health
```

#### Step 4: Update Frontend API Client (if needed)
If backend is on different port, check `artifacts/dar-al-naseem/src/lib/utils.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

---

## 📊 Google Apps Script Integration

Your form automatically submits to Google Apps Script:

**Apps Script Web App URL:**
```
https://script.google.com/macros/s/AKfycbyScDw1tvzR75TPc9Ke-D5R5-vXDUIbI8GIuhrpRwt53i3w3LPqGIywGFBXL6PBGgd5/exec
```

**Google Sheet:**
```
https://docs.google.com/spreadsheets/d/10VqP4HNt-RsPAdt8MKyHiAE6iRYbzzvChj-LKSKAnjw/edit
```

### How It Works
1. User fills out quiz/form in the UI
2. Form data is sent via POST to the Apps Script URL
3. Apps Script automatically logs data to your Google Sheet
4. Data backs up locally in browser localStorage
5. Success modal displays (fixed position, doesn't scroll)

### Verify Integration
- Fill out the form at `/`
- Check browser **Developer Console** (F12 → Console tab)
- Look for: `✓ Data submitted to Google Sheets successfully!`
- Check your Google Sheet for new rows

---

## 🎨 Frontend Features

### Key Pages
- **Home** (`/`): Landing page with quiz, hero, company info
- **Quiz Section**: Multi-step form ("Who are you?" → branching forms)
- **Success Modal**: Fixed overlay that appears after submission

### Quiz Flow
```
1. Initial Question: "Who are you?"
   ├── Investor
   │   ├── Looking for? (Buy/Sell/Lease)
   │   ├── Property Type (Villa/Apartment/etc)
   │   └── Investment Form
   ├── Client
   │   └── Login/Contact Form
   ├── Brokerage/Developer
   │   └── Partnership Inquiry Form
   └── Referral/Member
       └── Referral Form
2. Success Modal (Fixed overlay)
3. Auto-reset after 4 seconds
```

### Data Collected
- Full Name
- Email
- Phone Number
- User Type (Investor/Client/Brokerage/Referral)
- Property Preferences (if investor)
- Budget Range
- Special Requirements
- Timestamp

### Navbar Features
- **Left**: Company branding "DAN DAR AL NASEEM SINCE 2006"
- **Right**: Image upload space (drag/drop or click to upload)
  - Uploads to sessionStorage
  - Reloads page to display
  - Persists during session

---

## 🛠️ Build & Deployment

### Build Frontend for Production
```bash
cd artifacts/dar-al-naseem
pnpm run build
```

**Output:** `dist/` folder with static files

### Preview Production Build
```bash
cd artifacts/dar-al-naseem
pnpm run preview
```

### Deploy to Vercel (if configured)
```bash
# Automatic deployment on git push
# Check vercel.json for configuration
```

---

## 🐛 Troubleshooting

### Issue: "localhost:5173 refused to connect"
**Solution:**
```bash
# Kill any process on port 5173
# macOS/Linux:
lsof -ti:5173 | xargs kill -9

# Windows (PowerShell):
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process -Force

# Restart:
pnpm run dev
```

### Issue: "Module not found" errors
**Solution:**
```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm run dev
```

### Issue: Google Apps Script not logging data
**Check:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. Verify Apps Script URL in InterrogationQuiz.tsx (line ~85)
5. Check Google Sheet is accessible: https://docs.google.com/spreadsheets/d/10VqP4HNt-RsPAdt8MKyHiAE6iRYbzzvChj-LKSKAnjw/edit

### Issue: Success modal appears off-screen
**Solution:** Modal is now `fixed` overlay - it should center on screen. If not:
1. Check browser zoom level (Ctrl+0 to reset)
2. Open DevTools Inspector (F12 → Elements tab)
3. Verify `.fixed.inset-0` class on SuccessMessage wrapper

### Issue: Form data not saving
**Check:**
1. Browser console has: `✓ Data submitted to Google Sheets successfully!`
2. localStorage backup exists: F12 → Application/Storage → localStorage → `quiz_submissions`
3. Network tab shows POST request to Apps Script URL (may show error due to CORS, but `no-cors` mode handles it)

---

## 📱 Browser Support
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Android)

---

## 🚀 Advanced Configuration

### Environment Variables
Create `.env` in `artifacts/dar-al-naseem/`:
```env
# API Configuration
VITE_API_URL=http://localhost:3000
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/...

# Analytics (optional)
VITE_GOOGLE_ANALYTICS_ID=G_...
```

### Customize Country Flags
Edit `artifacts/dar-al-naseem/src/components/CountryFlag.tsx`:
- 🇦🇪 UAE
- 🇸🇦 Saudi Arabia  
- 🇺🇸 USA
- 🇮🇳 India
- 🇬🇧 UK

---

## 📞 Support

### For Technical Issues
1. Check console errors (F12 → Console)
2. Verify Google Apps Script deployment is live
3. Confirm localhost URLs match configuration

### For Form Integration
- Apps Script logs to: https://docs.google.com/spreadsheets/d/10VqP4HNt-RsPAdt8MKyHiAE6iRYbzzvChj-LKSKAnjw/edit
- Manual data backup in localStorage (visible in DevTools)
- Email notifications can be added via backend

---

## ✅ Verification Checklist

- [ ] Frontend running on http://localhost:5173
- [ ] Logo upload space visible in navbar (top right)
- [ ] Quiz loads and shows "Who are you?" options
- [ ] Form submission works (shows success modal)
- [ ] Success modal is fixed overlay (doesn't scroll page)
- [ ] Browser console shows submission logs
- [ ] localStorage shows quiz_submissions
- [ ] Google Sheet shows new rows after submission
- [ ] Can dismiss modal with close button or backdrop click

---

**Happy promoting! 🎉**
