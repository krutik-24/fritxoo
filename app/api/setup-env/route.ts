import { NextResponse } from "next/server"

export async function GET() {
  const requiredEnvVars = [
    "GOOGLE_PROJECT_ID",
    "GOOGLE_PRIVATE_KEY_ID",
    "GOOGLE_PRIVATE_KEY",
    "GOOGLE_CLIENT_EMAIL",
    "GOOGLE_CLIENT_ID",
  ]

  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    return NextResponse.json(
      {
        error: "Missing required environment variables",
        missing: missingVars,
        instructions: {
          message: "To set up Google Drive integration, you need to:",
          steps: [
            "1. Go to Google Cloud Console (console.cloud.google.com)",
            "2. Create a new project or select existing one",
            "3. Enable Google Drive API",
            "4. Create a Service Account",
            "5. Download the JSON key file",
            "6. Add the following environment variables to your .env.local:",
            "   GOOGLE_PROJECT_ID=your_project_id",
            "   GOOGLE_PRIVATE_KEY_ID=your_private_key_id",
            '   GOOGLE_PRIVATE_KEY="your_private_key"',
            "   GOOGLE_CLIENT_EMAIL=your_service_account_email",
            "   GOOGLE_CLIENT_ID=your_client_id",
            "7. Share the Google Drive folder with the service account email",
          ],
        },
      },
      { status: 400 },
    )
  }

  return NextResponse.json({
    success: true,
    message: "All required environment variables are set",
  })
}
