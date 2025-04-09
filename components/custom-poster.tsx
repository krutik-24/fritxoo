"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Upload, ImageIcon, Type, Layout, PaintBucket } from "lucide-react"

export default function CustomPoster() {
  const [posterTitle, setPosterTitle] = useState("")
  const [posterSize, setPosterSize] = useState("12×18 inches")
  const [textColor, setTextColor] = useState("#ffffff")
  const [backgroundColor, setBackgroundColor] = useState("#000000")
  const [fontSize, setFontSize] = useState(48)

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Create Your Custom Poster</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Preview</h3>
            <div
              className="aspect-[2/3] rounded-md flex items-center justify-center overflow-hidden"
              style={{ backgroundColor }}
            >
              <div className="text-center px-8" style={{ color: textColor, fontSize: `${fontSize}px` }}>
                {posterTitle || "Your Text Here"}
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Customize</h3>

            <Tabs defaultValue="text">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <Type className="h-4 w-4" /> Text
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" /> Upload
                </TabsTrigger>
                <TabsTrigger value="layout" className="flex items-center gap-2">
                  <Layout className="h-4 w-4" /> Layout
                </TabsTrigger>
                <TabsTrigger value="style" className="flex items-center gap-2">
                  <PaintBucket className="h-4 w-4" /> Style
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="poster-text">Poster Text</Label>
                  <Input
                    id="poster-text"
                    placeholder="Enter your text here"
                    value={posterTitle}
                    onChange={(e) => setPosterTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="font-size">Font Size</Label>
                  <Slider
                    id="font-size"
                    min={24}
                    max={96}
                    step={1}
                    value={[fontSize]}
                    onValueChange={(value) => setFontSize(value[0])}
                  />
                  <div className="text-right text-sm text-gray-500">{fontSize}px</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="text-color">Text Color</Label>
                    <div className="flex">
                      <Input
                        id="text-color"
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-12 h-10 p-1 rounded-l-md"
                      />
                      <Input
                        type="text"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="rounded-l-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bg-color">Background Color</Label>
                    <div className="flex">
                      <Input
                        id="bg-color"
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-12 h-10 p-1 rounded-l-md"
                      />
                      <Input
                        type="text"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="upload" className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">Drag and drop your image here</p>
                  <p className="text-gray-400 text-sm mb-4">Supports JPG, PNG (Max 10MB)</p>
                  <Button>Browse Files</Button>
                </div>
              </TabsContent>

              <TabsContent value="layout" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="poster-size">Poster Size</Label>
                  <Select value={posterSize} onValueChange={setPosterSize}>
                    <SelectTrigger id="poster-size">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12×18 inches">12×18 inches</SelectItem>
                      <SelectItem value="16×24 inches">16×24 inches</SelectItem>
                      <SelectItem value="18×24 inches">18×24 inches</SelectItem>
                      <SelectItem value="24×36 inches">24×36 inches</SelectItem>
                      <SelectItem value="Custom Size">Custom Size</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="border rounded-md p-2 text-center cursor-pointer hover:bg-gray-50">
                    <div className="aspect-[2/3] bg-gray-200 mb-2"></div>
                    <span className="text-sm">Portrait</span>
                  </div>
                  <div className="border rounded-md p-2 text-center cursor-pointer hover:bg-gray-50">
                    <div className="aspect-[3/2] bg-gray-200 mb-2"></div>
                    <span className="text-sm">Landscape</span>
                  </div>
                  <div className="border rounded-md p-2 text-center cursor-pointer hover:bg-gray-50">
                    <div className="aspect-square bg-gray-200 mb-2"></div>
                    <span className="text-sm">Square</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="style" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-md p-2 text-center cursor-pointer hover:bg-gray-50">
                    <div className="aspect-[2/3] bg-gradient-to-b from-purple-500 to-pink-500 mb-2"></div>
                    <span className="text-sm">Gradient</span>
                  </div>
                  <div className="border rounded-md p-2 text-center cursor-pointer hover:bg-gray-50">
                    <div className="aspect-[2/3] bg-black mb-2"></div>
                    <span className="text-sm">Solid</span>
                  </div>
                  <div className="border rounded-md p-2 text-center cursor-pointer hover:bg-gray-50">
                    <div className="aspect-[2/3] bg-gray-800 bg-opacity-50 mb-2"></div>
                    <span className="text-sm">Transparent</span>
                  </div>
                  <div className="border rounded-md p-2 text-center cursor-pointer hover:bg-gray-50">
                    <div className="aspect-[2/3] bg-gray-200 mb-2"></div>
                    <span className="text-sm">Pattern</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-8 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-2xl">Rs. 199</p>
                  <p className="text-gray-500 text-sm">Free shipping on orders above Rs. 499</p>
                </div>
                <Button className="bg-black text-white hover:bg-gray-800">Add to Cart</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
