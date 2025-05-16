import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminGuide() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Admin Image Management Guide</CardTitle>
        <CardDescription>Learn how to upload, organize, and manage images in your product gallery</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload">Uploading Images</TabsTrigger>
            <TabsTrigger value="organize">Organizing Images</TabsTrigger>
            <TabsTrigger value="manage">Managing Images</TabsTrigger>
            <TabsTrigger value="gallery">Product Gallery</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">How to Upload Images</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                Click the <strong>Upload Images</strong> button at the top of the page.
              </li>
              <li>
                In the upload dialog, either:
                <ul className="list-disc pl-5 mt-1">
                  <li>Drag and drop image files into the designated area, or</li>
                  <li>
                    Click the <strong>Select Files</strong> button to browse your computer
                  </li>
                </ul>
              </li>
              <li>
                For each selected image, provide:
                <ul className="list-disc pl-5 mt-1">
                  <li>
                    A descriptive <strong>name</strong> (required)
                  </li>
                  <li>
                    A <strong>category</strong> from the dropdown menu (required)
                  </li>
                  <li>
                    Optional <strong>tags</strong> by clicking on the tag badges
                  </li>
                </ul>
              </li>
              <li>
                Once all images are properly labeled, click <strong>Upload All</strong>.
              </li>
              <li>Monitor the progress bars to track the upload status.</li>
              <li>When complete, the images will be added to your gallery.</li>
            </ol>
            <div className="bg-blue-50 p-4 rounded-md mt-4">
              <p className="text-blue-800 font-medium">Tips:</p>
              <ul className="list-disc pl-5 text-blue-700">
                <li>You can upload multiple images at once</li>
                <li>Supported formats: JPG, PNG, WebP, and GIF</li>
                <li>Maximum file size: 5MB per image</li>
                <li>Descriptive names help with search and organization</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="organize" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">Organizing Your Images</h3>
            <h4 className="font-medium mt-4">Categories</h4>
            <p>Categories help group similar images together. Each image must belong to one category:</p>
            <ul className="list-disc pl-5 mt-1">
              <li>
                <strong>Movies</strong>: Movie posters and film-related images
              </li>
              <li>
                <strong>TV Shows</strong>: Television series posters and promotional images
              </li>
              <li>
                <strong>Music</strong>: Album covers, band photos, concert images
              </li>
              <li>
                <strong>Sports</strong>: Sports teams, athletes, and event images
              </li>
              <li>
                <strong>Anime</strong>: Anime and manga artwork
              </li>
              <li>
                <strong>Gaming</strong>: Video game artwork and promotional images
              </li>
              <li>
                <strong>Minimalist</strong>: Clean, simple designs with minimal elements
              </li>
              <li>
                <strong>Typography</strong>: Text-focused designs and quotes
              </li>
            </ul>

            <h4 className="font-medium mt-4">Tags</h4>
            <p>Tags provide additional ways to filter and find images. You can add multiple tags to each image:</p>
            <ul className="list-disc pl-5 mt-1">
              <li>
                <strong>Featured</strong>: Highlight special images
              </li>
              <li>
                <strong>New</strong>: Recently added images
              </li>
              <li>
                <strong>Popular</strong>: Best-selling or frequently viewed images
              </li>
              <li>
                <strong>Trending</strong>: Currently popular images
              </li>
              <li>
                <strong>Bestseller</strong>: Top-selling images
              </li>
              <li>
                <strong>Limited</strong>: Limited edition or time-limited images
              </li>
              <li>
                <strong>Sale</strong>: Images currently on sale
              </li>
              <li>
                <strong>Exclusive</strong>: Premium or exclusive content
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="manage" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">Managing Your Image Gallery</h3>
            <h4 className="font-medium">Finding Images</h4>
            <p>Use these tools to quickly locate specific images:</p>
            <ul className="list-disc pl-5 mt-1">
              <li>
                <strong>Search bar</strong>: Type keywords to find images by name
              </li>
              <li>
                <strong>Category filter</strong>: Filter images by their assigned category
              </li>
              <li>
                <strong>Tag filters</strong>: Click on tags to show only images with those tags
              </li>
              <li>
                <strong>View options</strong>: Switch between grid and list views
              </li>
            </ul>

            <h4 className="font-medium mt-4">Editing Images</h4>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Find the image you want to edit in the gallery</li>
              <li>
                Hover over the image and click the <strong>Edit</strong> (pencil) icon
              </li>
              <li>
                In the edit dialog, you can modify:
                <ul className="list-disc pl-5 mt-1">
                  <li>Image name</li>
                  <li>Category</li>
                  <li>Tags</li>
                </ul>
              </li>
              <li>
                Click <strong>Save Changes</strong> when finished
              </li>
            </ol>

            <h4 className="font-medium mt-4">Deleting Images</h4>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Find the image you want to delete</li>
              <li>
                Hover over the image and click the <strong>Delete</strong> (trash) icon
              </li>
              <li>Confirm the deletion when prompted</li>
            </ol>
            <div className="bg-amber-50 p-4 rounded-md mt-4">
              <p className="text-amber-800 font-medium">Warning:</p>
              <p className="text-amber-700">
                Deleting an image is permanent and cannot be undone. If the image is used in any posters, those
                references will be broken.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">Using Images in the Product Gallery</h3>
            <p>After uploading images, you can use them in your product gallery:</p>

            <h4 className="font-medium mt-4">Adding Images to Posters</h4>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                Go to the <strong>Posters</strong> tab in the admin panel
              </li>
              <li>
                Click <strong>Add New Poster</strong> or edit an existing poster
              </li>
              <li>
                In the poster form, click the <strong>Select Image</strong> button
              </li>
              <li>Browse your image gallery and select the desired image</li>
              <li>Complete the poster details (title, description, price, etc.)</li>
              <li>Save the poster to add it to your product gallery</li>
            </ol>

            <h4 className="font-medium mt-4">Best Practices</h4>
            <ul className="list-disc pl-5 mt-1">
              <li>Use high-quality images with good resolution</li>
              <li>Maintain consistent aspect ratios for a professional look</li>
              <li>Use descriptive names that help customers find what they're looking for</li>
              <li>Apply relevant tags to improve searchability</li>
              <li>Regularly review and update your image library</li>
              <li>Remove outdated or unused images to keep your gallery organized</li>
            </ul>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
