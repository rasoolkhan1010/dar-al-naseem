/**
 * Google Sheets Integration Service
 * 
 * This service handles automatic submission of quiz responses to Google Sheets
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. Create a Google Service Account:
 *    - Go to Google Cloud Console (https://console.cloud.google.com/)
 *    - Create a new project
 *    - Enable Google Sheets API
 *    - Create a Service Account
 *    - Generate a JSON key file
 * 
 * 2. Create a Google Sheet:
 *    - Create a new Google Sheet with the following columns:
 *      A: Timestamp
 *      B: User Type
 *      C: Name
 *      D: Email
 *      E: Phone
 *      F: Looking For (buy/sell/lease)
 *      G: Property Type
 *      H: Budget
 *      I: Requirements
 *      J: Company Name
 *      K: Referral Source
 *      L: Message/Details
 * 
 * 3. Share the Google Sheet with the Service Account email
 *    - Add the service account email (from JSON key) as an editor
 * 
 * 4. Set Environment Variables:
 *    - GOOGLE_SHEETS_ID: Your Sheet ID (from URL: docs.google.com/spreadsheets/d/{SHEET_ID}/...)
 *    - GOOGLE_SERVICE_ACCOUNT_JSON: Base64 encoded JSON key OR path to JSON file
 *    OR use alternative methods below
 */

import { logger } from "../lib/logger";

// Type definitions
interface SheetRow {
  timestamp: string;
  userType: string;
  name: string;
  email: string;
  phone: string;
  looking: string;
  propertyType: string;
  budget: string;
  requirements: string;
  companyName: string;
  referralSource: string;
  message: string;
}

/**
 * OPTION 1: Direct Google Sheets API (Recommended)
 */
export async function submitToGoogleSheetsViaAPI(row: SheetRow): Promise<boolean> {
  try {
    // Note: You'll need to install: npm install googleapis
    // const { google } = require('googleapis');

    const sheetsId = process.env.GOOGLE_SHEETS_ID;
    const credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

    if (!sheetsId || !credentialsJson) {
      logger.warn("Google Sheets credentials not configured");
      return false;
    }

    // Decode base64 credentials if needed
    let credentials;
    try {
      credentials = JSON.parse(
        Buffer.from(credentialsJson, "base64").toString()
      );
    } catch {
      credentials = JSON.parse(credentialsJson);
    }

    // This implementation requires 'googleapis' package
    // Uncomment and use when package is available:
    /*
    const { google } = require('googleapis');
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets('v4');
    const values = [[
      row.timestamp,
      row.userType,
      row.name,
      row.email,
      row.phone,
      row.looking,
      row.propertyType,
      row.budget,
      row.requirements,
      row.companyName,
      row.referralSource,
      row.message,
    ]];

    await sheets.spreadsheets.values.append({
      auth,
      spreadsheetId: sheetsId,
      range: 'Quiz Responses!A:L',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });

    logger.info({ row }, 'Successfully submitted to Google Sheets');
    return true;
    */

    logger.info("Google Sheets API method selected but not yet configured");
    return false;
  } catch (error) {
    logger.error(error, "Error submitting to Google Sheets API");
    return false;
  }
}

/**
 * OPTION 2: Using Google Forms integration
 * Create a hidden Google Form linked to a Sheet and submit responses via form submission
 */
export async function submitToGoogleSheetsViaForm(row: SheetRow): Promise<boolean> {
  try {
    const formId = process.env.GOOGLE_FORM_ID;
    const formFields = {
      timestamp: process.env.GOOGLE_FORM_FIELD_TIMESTAMP,
      userType: process.env.GOOGLE_FORM_FIELD_USER_TYPE,
      name: process.env.GOOGLE_FORM_FIELD_NAME,
      email: process.env.GOOGLE_FORM_FIELD_EMAIL,
      phone: process.env.GOOGLE_FORM_FIELD_PHONE,
      looking: process.env.GOOGLE_FORM_FIELD_LOOKING,
      propertyType: process.env.GOOGLE_FORM_FIELD_PROPERTY,
      budget: process.env.GOOGLE_FORM_FIELD_BUDGET,
      requirements: process.env.GOOGLE_FORM_FIELD_REQUIREMENTS,
      companyName: process.env.GOOGLE_FORM_FIELD_COMPANY,
      referralSource: process.env.GOOGLE_FORM_FIELD_REFERRAL,
      message: process.env.GOOGLE_FORM_FIELD_MESSAGE,
    };

    if (!formId || !Object.values(formFields).every(Boolean)) {
      logger.warn("Google Form configuration incomplete");
      return false;
    }

    const formData = new FormData();
    formData.append(formFields.timestamp, row.timestamp);
    formData.append(formFields.userType, row.userType);
    formData.append(formFields.name, row.name);
    formData.append(formFields.email, row.email);
    formData.append(formFields.phone, row.phone);
    formData.append(formFields.looking, row.looking);
    formData.append(formFields.propertyType, row.propertyType);
    formData.append(formFields.budget, row.budget);
    formData.append(formFields.requirements, row.requirements);
    formData.append(formFields.companyName, row.companyName);
    formData.append(formFields.referralSource, row.referralSource);
    formData.append(formFields.message, row.message);

    const response = await fetch(
      `https://docs.google.com/forms/u/0/d/e/${formId}/formResponse`,
      {
        method: "POST",
        body: formData,
      }
    );

    logger.info("Submitted to Google Sheets via Google Form");
    return response.ok;
  } catch (error) {
    logger.error(error, "Error submitting to Google Form");
    return false;
  }
}

/**
 * OPTION 3: Using Google Apps Script Web App
 * Deploy a Google Apps Script as a web app to receive submissions
 */
export async function submitViaGoogleAppsScript(row: SheetRow): Promise<boolean> {
  try {
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!scriptUrl) {
      logger.warn("Google Apps Script URL not configured");
      return false;
    }

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
    });

    logger.info("Submitted via Google Apps Script");
    return response.ok;
  } catch (error) {
    logger.error(error, "Error submitting via Google Apps Script");
    return false;
  }
}

/**
 * OPTION 4: Using Zapier/Make/IFTTT Webhook
 * Creates an easy integration without coding
 */
export async function submitViaWebhook(row: SheetRow): Promise<boolean> {
  try {
    const webhookUrl = process.env.SHEETS_WEBHOOK_URL;

    if (!webhookUrl) {
      logger.warn("Webhook URL not configured");
      return false;
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timestamp: row.timestamp,
        userType: row.userType,
        name: row.name,
        email: row.email,
        phone: row.phone,
        looking: row.looking,
        propertyType: row.propertyType,
        budget: row.budget,
        requirements: row.requirements,
        companyName: row.companyName,
        referralSource: row.referralSource,
        message: row.message,
      }),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.statusText}`);
    }

    logger.info("Submitted via Webhook");
    return true;
  } catch (error) {
    logger.error(error, "Error submitting via Webhook");
    return false;
  }
}

/**
 * Main function that tries all configured methods
 */
export async function submitToGoogleSheets(row: SheetRow): Promise<boolean> {
  logger.info({ row: row.email }, "Attempting to submit to Google Sheets");

  // Try methods in order of preference
  if (process.env.GOOGLE_SHEETS_ID && process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    if (await submitToGoogleSheetsViaAPI(row)) return true;
  }

  if (process.env.GOOGLE_APPS_SCRIPT_URL) {
    if (await submitViaGoogleAppsScript(row)) return true;
  }

  if (process.env.GOOGLE_FORM_ID) {
    if (await submitToGoogleSheetsViaForm(row)) return true;
  }

  if (process.env.SHEETS_WEBHOOK_URL) {
    if (await submitViaWebhook(row)) return true;
  }

  logger.warn("No working Google Sheets integration method available");
  return false;
}

export const googleSheetsConfig = {
  setupInstructions: `
GOOGLE SHEETS INTEGRATION - SETUP GUIDE
========================================

QUICK START (Using Google Apps Script - Easiest):
1. Create a Google Sheet for responses
2. Go to Extensions > Apps Script
3. Paste this code:

---
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
  return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
}
---

4. Deploy as web app (Execute as: Me, Who has access: Anyone)
5. Copy the deployment URL
6. Set GOOGLE_APPS_SCRIPT_URL env variable

ALTERNATIVE (Using Zapier/Make):
1. Create account at zapier.com or make.com
2. Create new Zap/Scenario
3. Webhook trigger -> Google Sheets action
4. Set SHEETS_WEBHOOK_URL env variable
  `,
};
