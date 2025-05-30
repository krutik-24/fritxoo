import { NextResponse } from "next/server"
import { google } from "googleapis"

export async function GET() {
  try {
    // Set up Google Drive API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: "service_account",
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.GOOGLE_CLIENT_EMAIL}`,
      },
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    })

    const drive = google.drive({ version: "v3", auth })

    // Test connection by getting folder info
    const folderInfo = await drive.files.get({
      fileId: "15naQn-sq3rTARgOXSack1OgWcoYNkuOx",
      fields: "id, name, permissions",
    })

    return NextResponse.json({
      success: true,
      message: "Google Drive connection successful!",
      folder: {
        id: folderInfo.data.id,
        name: folderInfo.data.name,
      },
      serviceAccount: process.env.GOOGLE_CLIENT_EMAIL,
    })
  } catch (error) {
    console.error("Google Drive connection error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to connect to Google Drive",
        details: error instanceof Error ? error.message : "Unknown error",
        troubleshooting: [
          "1. Verify all environment variables are set correctly",
          "2. Ensure the service account has access to the Google Drive folder",
          "3. Check that the Google Drive API is enabled in your Google Cloud project",
          "4. Make sure the private key format is correct (with proper line breaks)",
        ],
      },
      { status: 500 },
    )
  }
}
