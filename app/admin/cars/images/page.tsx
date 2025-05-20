import CarImageManager from "@/components/admin/car-image-manager"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, Car } from "lucide-react"

export default function CarImagesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Car className="h-6 w-6" /> Car Category Image Management
      </h1>

      <Alert className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>About Car Images</AlertTitle>
        <AlertDescription>
          Images uploaded here are stored in the 'cars' category in Vercel Blob Storage. These images are specifically
          for car posters and will be available for selection when creating car-related posters.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="manage" className="space-y-4">
        <TabsList>
          <TabsTrigger value="manage">Manage Car Images</TabsTrigger>
          <TabsTrigger value="guide">Admin Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Car Image Gallery</CardTitle>
              <CardDescription>
                Upload, preview, and manage your car images stored in Vercel Blob Storage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CarImageManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guide">
          <Card>
            <CardHeader>
              <CardTitle>Admin Guide: Car Image Management</CardTitle>
              <CardDescription>Learn how to effectively manage car images in the 'cars' category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">About Car Category Images</h3>
                <p>
                  The Cars category is a specialized collection of car-related images stored in Vercel Blob Storage.
                  These images are specifically organized for use in car posters and related products.
                </p>
                <p>
                  All images in this category are stored with the path prefix{" "}
                  <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">cars/</code> in the blob storage, making
                  them easy to identify and manage.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Uploading Car Images</h3>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    <strong>Select an image:</strong> Click the "Add Car Image" button and either drag and drop an image
                    or click to browse your files.
                  </li>
                  <li>
                    <strong>Preview:</strong> Once selected, you'll see a preview of your image.
                  </li>
                  <li>
                    <strong>Auto-generated metadata:</strong> The system will automatically generate:
                    <ul className="list-disc pl-6 mt-2">
                      <li>
                        <strong>Title:</strong> Based on the filename (e.g., "Ferrari F40" from "ferrari_f40.jpg")
                      </li>
                      <li>
                        <strong>Description:</strong> A basic description mentioning the car
                      </li>
                      <li>
                        <strong>Alt Text:</strong> Accessibility text based on the car name
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Edit metadata:</strong> Review and edit the auto-generated metadata as needed.
                  </li>
                  <li>
                    <strong>Upload:</strong> Click "Upload to Cars Category" to save the image.
                  </li>
                </ol>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Managing Car Images</h3>
                <ul className="list-disc pl-6 space-y-3">
                  <li>
                    <strong>View details:</strong> Click the eye icon on any image to view its full details.
                  </li>
                  <li>
                    <strong>Copy URL:</strong> In the image details view, click "Copy URL" to copy the image URL to your
                    clipboard.
                  </li>
                  <li>
                    <strong>Delete:</strong> Click the trash icon to delete an image (note that the sample image cannot
                    be deleted).
                  </li>
                  <li>
                    <strong>Search:</strong> Use the search bar to find images by title, description, or filename.
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Using Car Images in Posters</h3>
                <p>After uploading car images, you can use them in your car posters by:</p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Navigate to the poster creation form</li>
                  <li>Select "Cars" as the category</li>
                  <li>In the image selection dialog, your car images will be available for selection</li>
                  <li>Select the desired car image for your poster</li>
                  <li>Complete the poster details and save</li>
                </ol>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Best Practices for Car Images</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use high-quality images with good resolution (minimum 1200×800 pixels recommended)</li>
                  <li>Ensure the car is the main focus of the image</li>
                  <li>Use consistent lighting and backgrounds when possible</li>
                  <li>Name your files descriptively (e.g., "bmw_m3_blue.jpg" rather than "IMG12345.jpg")</li>
                  <li>Include the make and model in the title for better searchability</li>
                  <li>Add specific details about the car in the description (year, special features, etc.)</li>
                  <li>Keep file sizes under 5MB for optimal performance</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Expanding the Cars Category</h3>
                <p>
                  As your collection grows, consider organizing car images into more specific subcategories by using
                  consistent naming conventions or tags:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Classic cars</li>
                  <li>Sports cars</li>
                  <li>Luxury vehicles</li>
                  <li>Vintage automobiles</li>
                  <li>Concept cars</li>
                  <li>Racing vehicles</li>
                </ul>
                <p className="mt-2">
                  This will help maintain organization as your car image collection expands over time.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
