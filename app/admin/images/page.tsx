import ImageManager from "@/components/admin/image-manager"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export default function ImagesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Image Management System</h1>

      <Alert className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>About Image Storage</AlertTitle>
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
              <ImageManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guide">
          <Card>
            <CardHeader>
              <CardTitle>Admin Guide: Image Management System</CardTitle>
              <CardDescription>Learn how to effectively use the image management system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Getting Started</h3>
                <p>
                  The Image Management System allows you to upload, organize, and manage images for your website. All
                  images are stored in Vercel Blob Storage, providing fast, reliable, and secure image hosting with
                  global CDN delivery.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Uploading Images</h3>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    <strong>Select an image:</strong> Click the "Upload Image" button in the top-right corner of the
                    gallery.
                  </li>
                  <li>
                    <strong>Choose a file:</strong> Either drag and drop an image into the designated area or click to
                    browse your files.
                    <ul className="list-disc pl-6 mt-2">
                      <li>Supported formats: JPEG, PNG, WebP, GIF</li>
                      <li>Maximum file size: 5MB</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Preview:</strong> Once selected, you'll see a preview of your image.
                  </li>
                  <li>
                    <strong>Add metadata:</strong> The system will automatically generate:
                    <ul className="list-disc pl-6 mt-2">
                      <li>
                        <strong>Title:</strong> Based on the filename (e.g., "Ferrari F40" from "ferrari_f40.jpg")
                      </li>
                      <li>
                        <strong>Description:</strong> A basic description based on the title
                      </li>
                      <li>
                        <strong>Alt Text:</strong> Accessibility text based on the title
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Select category:</strong> Choose the appropriate category for your image from the dropdown
                    menu.
                  </li>
                  <li>
                    <strong>Edit metadata:</strong> Review and edit the auto-generated metadata as needed.
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
                    <strong>Browsing:</strong> All uploaded images appear in the gallery view.
                  </li>
                  <li>
                    <strong>Searching:</strong> Use the search bar to find images by title, description, or filename.
                  </li>
                  <li>
                    <strong>Filtering:</strong> Use the category filter to view images from a specific category.
                  </li>
                  <li>
                    <strong>Viewing details:</strong> Click the eye icon on any image to view its full details.
                  </li>
                  <li>
                    <strong>Copying URL:</strong> In the image details view, click "Copy URL" to copy the image URL to
                    your clipboard.
                  </li>
                  <li>
                    <strong>Deleting:</strong> Click the trash icon to delete an image (note that sample images cannot
                    be deleted).
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Using Images in Your Website</h3>
                <p>After uploading images, you can use them in your website by:</p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Copying the image URL and using it in your content</li>
                  <li>Selecting the image when creating or editing posters</li>
                  <li>Using the image URL in your HTML or CSS</li>
                </ol>
                <p>
                  The image URL will look something like:{" "}
                  <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">
                    https://[your-project].vercel-storage.com/[category]/[image-id]
                  </code>
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Image Categories</h3>
                <p>
                  Organizing your images into categories helps keep your image library manageable and makes it easier to
                  find specific images. The system includes the following categories:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>General:</strong> For miscellaneous images that don't fit other categories
                  </li>
                  <li>
                    <strong>Cars:</strong> For car-related images and posters
                  </li>
                  <li>
                    <strong>Movies:</strong> For movie posters and film-related images
                  </li>
                  <li>
                    <strong>Music:</strong> For music-related images and album covers
                  </li>
                  <li>
                    <strong>Sports:</strong> For sports-related images and posters
                  </li>
                  <li>
                    <strong>Anime:</strong> For anime and manga-related images
                  </li>
                  <li>
                    <strong>Gaming:</strong> For video game-related images
                  </li>
                  <li>
                    <strong>Minimalist:</strong> For minimalist design posters
                  </li>
                  <li>
                    <strong>Typography:</strong> For text-focused and typography-based images
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Best Practices</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Use descriptive filenames:</strong> Name your files in a way that describes their content
                    (e.g., "ferrari_250_gto_red.jpg" rather than "IMG12345.jpg")
                  </li>
                  <li>
                    <strong>Optimize image size:</strong> Keep file sizes under 5MB for optimal performance
                  </li>
                  <li>
                    <strong>Choose the right format:</strong> Use JPEG for photos, PNG for graphics with transparency,
                    WebP for best compression
                  </li>
                  <li>
                    <strong>Add detailed metadata:</strong> Provide accurate titles, descriptions, and alt text
                  </li>
                  <li>
                    <strong>Use appropriate categories:</strong> Categorize your images correctly for better
                    organization
                  </li>
                  <li>
                    <strong>Regular maintenance:</strong> Periodically review and remove unused images to keep your
                    storage organized
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Troubleshooting</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Upload failures:</strong> Ensure your image meets the size and format requirements
                  </li>
                  <li>
                    <strong>Images not appearing:</strong> Try refreshing the gallery using the refresh button
                  </li>
                  <li>
                    <strong>Search not working:</strong> Check for typos and try using partial terms
                  </li>
                  <li>
                    <strong>Cannot delete images:</strong> Sample images cannot be deleted
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
