# Quiz Integration Setup Guide

## Overview
The Interrogation Quiz system is now integrated with:
- **Form Collection**: Multi-step survey for user qualification
- **Google Sheets Integration**: Automatic data submission
- **Email Notifications**: Alerts to rasoolkhan990880@gmail.com
- **Country Flags**: Visual indicators throughout the app

## Quick Start

### 1. Email Configuration (Choose ONE)

#### Option A: Using Resend (Recommended - Easiest)
```bash
# Get API key from https://resend.com
# Set in your .env file:
RESEND_API_KEY=re_xxxxxxxxxxxxx
SENDER_EMAIL=noreply@daralnaseem.com
```

#### Option B: Using SendGrid
```bash
# Get API key from https://sendgrid.com
# Set in your .env file:
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
SENDER_EMAIL=noreply@daralnaseem.com
```

#### Option C: Using SMTP (Gmail, etc.)
```bash
# For Gmail: Enable "App Passwords" (https://myaccount.google.com/apppasswords)
# Set in your .env file:
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SENDER_EMAIL=your-email@gmail.com
```

### 2. Google Sheets Configuration (Choose ONE)

#### Option A: Google Apps Script (Easiest - No Coding)

1. **Create a Google Sheet**:
   - Go to [Google Sheets](https://sheets.google.com)
   - Create new sheet with these column headers:
     - A: Timestamp
     - B: User Type
     - C: Name
     - D: Email
     - E: Phone
     - F: Looking For
     - G: Property Type
     - H: Budget
     - I: Requirements
     - J: Company Name
     - K: Referral Source
     - L: Message

2. **Create Google Apps Script**:
   - Go to Extensions > Apps Script
   - Delete any existing code and paste:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    data.timestamp,
    data.userType,
    data.name,
    data.email,
    data.phone,
    data.looking,
    data.propertyType,
    data.budget,
    data.requirements,
    data.companyName,
    data.referralSource,
    data.message
  ]);
  
  return ContentService.createTextOutput(
    JSON.stringify({success: true})
  ).setMimeType(ContentService.MimeType.JSON);
}
```

3. **Deploy**:
   - Click "Deploy" > "New Deployment"
   - Type: Select "Web app"
   - Execute as: Your email
   - New users can access: "Anyone"
   - Click "Deploy"
   - Copy the deployment URL

4. **Set Environment Variable**:
```bash
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/d/{DEPLOYMENT_ID}/usercallback
```

#### Option B: Using Zapier/Make (No Code Required)

1. Go to [Zapier](https://zapier.com) or [Make](https://make.com)
2. Create new Zap/Scenario
3. Trigger: Webhooks by Zapier / HTTP
4. Action: Create spreadsheet row in Google Sheets
5. Connect to your Google Sheet
6. Map the fields
7. Copy the webhook URL

8. **Set Environment Variable**:
```bash
SHEETS_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/xxx/...
```

#### Option C: Direct Google Sheets API (Advanced)

1. Install package:
```bash
cd artifacts/api-server
npm install googleapis
```

2. Setup service account (see googleSheets.ts setup instructions)

3. Set environment variables:
```bash
GOOGLE_SHEETS_ID=your-sheet-id-from-url
GOOGLE_SERVICE_ACCOUNT_JSON=base64-encoded-json-key
```

## 3. Backend API Setup

1. **Install dependencies** (if not already done):
```bash
cd artifacts/api-server
npm install
```

2. **Start API server**:
```bash
npm run dev
```

3. **Test endpoints**:
```bash
# Test quiz submission
curl -X POST http://localhost:3000/api/submit-quiz \
  -H "Content-Type: application/json" \
  -d '{
    "userType": "investor",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+971501234567",
    "looking": "buy",
    "propertyType": "Villa",
    "budget": "1M - 5M AED"
  }'

# Test notification
curl -X POST http://localhost:3000/api/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "email": "rasoolkhan990880@gmail.com",
    "data": {
      "userType": "investor",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }'
```

## 4. Frontend Configuration

The quiz component automatically:
- ✅ Collects user information in survey format
- ✅ Submits to `/api/submit-quiz` endpoint
- ✅ Sends notifications to `/api/send-notification` endpoint
- ✅ Shows success message on completion
- ✅ Resets after 3 seconds

## Country Flags

The app now displays country flags (🇦🇪 🇺🇸 🇬🇧 🇸🇦 🇮🇳) wherever these countries are mentioned:
- Header: Legal consultation badge added (top left)
- Founder section: UAE mentions
- COO section: Portfolio countries
- Company section: All operating countries
- Team section: Regional coverage
- Footer: Global presence

## Components Added

### Frontend
- **InterrogationQuiz.tsx**: Main quiz component
- **CountryFlag.tsx**: Country flag utility component

### Backend
- **routes/quiz.ts**: Quiz submission endpoint
- **routes/notifications.ts**: Email notification endpoint
- **services/googleSheets.ts**: Google Sheets integration service

## File Structure
```
artifacts/
├── dar-al-naseem/
│   └── src/
│       ├── components/
│       │   ├── InterrogationQuiz.tsx (NEW)
│       │   └── CountryFlag.tsx (NEW)
│       ├── pages/
│       │   └── Home.tsx (UPDATED)
│       └── ...
├── api-server/
│   └── src/
│       ├── routes/
│       │   ├── quiz.ts (NEW)
│       │   ├── notifications.ts (NEW)
│       │   └── index.ts (UPDATED)
│       ├── services/
│       │   └── googleSheets.ts (NEW)
│       └── ...
```

## Environment Variables Template

Create `.env` file in `artifacts/api-server/`:

```bash
# Email Service (choose one)
RESEND_API_KEY=
SENDGRID_API_KEY=
SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SENDER_EMAIL=noreply@daralnaseem.com

# Google Sheets (choose one)
GOOGLE_SHEETS_ID=
GOOGLE_SERVICE_ACCOUNT_JSON=
GOOGLE_APPS_SCRIPT_URL=
SHEETS_WEBHOOK_URL=
```

## Testing

### 1. Test the Quiz Flow Locally
- Navigate to the home page
- Scroll down to "Find Your Perfect Match" section
- Click through the quiz options
- Fill in the form
- Submit and verify notification email

### 2. Verify Google Sheets Integration
- Check your Google Sheet for new rows
- Confirm all fields are populated correctly

### 3. Verify Email Notifications
- Check email at rasoolkhan990880@gmail.com
- Verify subject and content are correct

## Troubleshooting

### Issue: Forms submitting but not appearing in Google Sheets

**Solution**: 
1. Verify environment variable is set correctly
2. Check Google Apps Script deployment URL is accessible
3. Test webhook directly in browser to see error messages
4. Check browser console for submission errors

### Issue: Emails not being sent

**Solution**:
1. Verify email service is configured (check which method you chose)
2. For Gmail: Confirm app password is enabled
3. Check API keys are correct
4. Look at server logs for error messages

### Issue: CORS errors

**Solution**:
1. Ensure API server has CORS enabled (already configured)
2. Verify frontend is calling correct API endpoint
3. Check that API server is running on expected port

## Support & Resources

- **Google Apps Script Docs**: https://developers.google.com/apps-script
- **Resend Docs**: https://resend.com/docs
- **SendGrid Docs**: https://sendgrid.com/docs
- **Zapier Integration**: https://zapier.com/apps/google-sheets/integrations
- **Make (formerly Integromat)**: https://www.make.com/

## Next Steps

1. ✅ Choose email service and configure
2. ✅ Choose Google Sheets method and configure
3. ✅ Test submission flow end-to-end  4. ✅ Review email templates
5. ✅ Monitor Google Sheets for submissions
6. ✅ Customize user types/questions as needed

---

For custom modifications to the quiz flow, edit `InterrogationQuiz.tsx` component.

