import BlobImageManager from "@/components/admin/blob-image-manager"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export default function BlobImagesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Blob Storage Image Management</h1>

      <Alert className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>About Blob Storage</AlertTitle>
        <AlertDescription>
          Images uploaded here are stored in Vercel Blob Storage, providing fast, reliable, and secure image hosting.
          These images can be used throughout your website and will be served from Vercel's global CDN.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="manage" className="space-y-4">
        <TabsList>
          <TabsTrigger value="manage">Manage Images</TabsTrigger>
          <TabsTrigger value="guide">Admin Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Image Gallery</CardTitle>
              <CardDescription>Upload, preview, and manage your images stored in Vercel Blob Storage</CardDescription>
            </CardHeader>
            <CardContent>
              <BlobImageManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guide">
          <Card>
            <CardHeader>
              <CardTitle>Admin Guide: Blob Storage Images</CardTitle>
              <CardDescription>Learn how to effectively use the blob storage image management system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">What is Blob Storage?</h3>
                <p>
                  Vercel Blob Storage is a service that allows you to store and serve images and other files from
                  Vercel's global CDN. Images stored in blob storage are:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Served from a global CDN for fast loading</li>
                  <li>Securely stored and backed up</li>
                  <li>Easily manageable through this admin interface</li>
                  <li>Optimized for web delivery</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Uploading Images</h3>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    <strong>Select an image:</strong> Click the "Upload New Image" button and either drag and drop an
                    image or click to browse your files.
                  </li>
                  <li>
                    <strong>Preview:</strong> Once selected, you'll see a preview of your image.
                  </li>
                  <li>
                    <strong>Add metadata:</strong> Fill in the required title and optional description and alt text.
                    <ul className="list-disc pl-6 mt-2">
                      <li>
                        <strong>Title:</strong> A descriptive name for the image (required)
                      </li>
                      <li>
                        <strong>Description:</strong> Additional details about the image (optional)
                      </li>
                      <li>
                        <strong>Alt Text:</strong> Text description for accessibility and SEO (recommended)
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Upload:</strong> Click "Upload to Blob Storage" to save the image.
                  </li>
                  <li>
                    <strong>Confirmation:</strong> You'll see a success message when the upload is complete.
                  </li>
                </ol>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Managing Images</h3>
                <ul className="list-disc pl-6 space-y-3">
                  <li>
                    <strong>View details:</strong> Click the eye icon on any image to view its full details.
                  </li>
                  <li>
                    <strong>Copy URL:</strong> In the image details view, click "Copy URL" to copy the image URL to your
                    clipboard.
                  </li>
                  <li>
                    <strong>Delete:</strong> Click the trash icon to delete an image. Note that this action cannot be
                    undone.
                  </li>
                  <li>
                    <strong>Search:</strong> Use the search bar to find images by title or description.
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Using Images in Your Website</h3>
                <p>After uploading images to blob storage, you can use them in your website by:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Copying the image URL and using it in your content</li>
                  <li>Selecting the image when creating or editing posters</li>
                  <li>Using the image URL in your HTML or CSS</li>
                </ul>
                <p>
                  The image URL will look something like:{" "}
                  <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">
                    https://[your-project].vercel-storage.com/[image-id]
                  </code>
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Best Practices</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use descriptive titles that help identify the image</li>
                  <li>Always provide alt text for accessibility</li>
                  <li>Keep file sizes under 5MB for optimal performance</li>
                  <li>
                    Use appropriate image formats: JPEG for photos, PNG for graphics with transparency, WebP for best
                    compression
                  </li>
                  <li>Regularly review and remove unused images to keep your storage organized</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
