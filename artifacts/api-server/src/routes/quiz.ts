import { Router, type Request, type Response } from "express";
import { logger } from "../lib/logger";
import { submitToGoogleSheets } from "../services/googleSheets";

interface QuizFormData {
  userType: string;
  looking?: string;
  propertyType?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  budget?: string;
  requirements?: string;
  companyName?: string;
  referralSource?: string;
}

const router = Router();

/**
 * Submit quiz form data
 * Saves to Google Sheets via configured method
 */
router.post("/submit-quiz", async (req: Request, res: Response) => {
  try {
    const formData: QuizFormData = req.body;

    // Validate required fields
    if (!formData.userType || !formData.email || !formData.name) {
      return res.status(400).json({
        error: "Missing required fields: userType, email, name",
      });
    }

    logger.info({ formData }, "Quiz form submission received");

    // Prepare row data for Google Sheets
    const row = {
      timestamp: new Date().toISOString(),
      userType: formData.userType,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || "",
      looking: formData.looking || "",
      propertyType: formData.propertyType || "",
      budget: formData.budget || "",
      requirements: formData.requirements || "",
      companyName: formData.companyName || "",
      referralSource: formData.referralSource || "",
      message: formData.message || "",
    };

    // Submit to Google Sheets
    await submitToGoogleSheets(row);

    // Send success response
    return res.json({
      success: true,
      message: "Form submitted successfully",
      data: { id: Date.now() },
    });
  } catch (error) {
    logger.error(error, "Error processing quiz submission");
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

export default router;
