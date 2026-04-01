'use client'

import { useState } from 'react'

export default function Home() {
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
      setResult('')
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
      setResult('')
    }
  }

  const handleRemoveBg = async () => {
    if (!image) return

    setLoading(true)
    const formData = new FormData()
    formData.append('image', image)

    try {
      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to remove background')

      const blob = await response.blob()
      setResult(URL.createObjectURL(blob))
    } catch (error) {
      alert('Error removing background')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!result) return
    const a = document.createElement('a')
    a.href = result
    a.download = 'removed-bg.png'
    a.click()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 drop-shadow-2xl">
            ✨ Magic Eraser
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-medium">
            Remove backgrounds in seconds
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-10">
          {!preview ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-4 border-dashed rounded-2xl p-12 md:p-20 text-center transition-all ${
                dragActive
                  ? 'border-purple-500 bg-purple-50 scale-105'
                  : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <div className="text-6xl mb-4">🖼️</div>
                <div className="text-2xl font-bold text-gray-700 mb-2">
                  Drop your image here
                </div>
                <div className="text-gray-500">or click to browse</div>
              </label>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800">📷 Original</h3>
                    <button
                      onClick={() => {
                        setPreview('')
                        setResult('')
                        setImage(null)
                      }}
                      className="text-sm text-gray-500 hover:text-red-500"
                    >
                      ✕ Clear
                    </button>
                  </div>
                  <div className="relative rounded-xl overflow-hidden shadow-lg border-4 border-gray-200">
                    <img src={preview} alt="Original" className="w-full" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-gray-800">✨ Result</h3>
                  <div className="relative rounded-xl overflow-hidden shadow-lg border-4 border-purple-200 bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%,transparent_75%,#f0f0f0_75%,#f0f0f0),linear-gradient(45deg,#f0f0f0_25%,transparent_25%,transparent_75%,#f0f0f0_75%,#f0f0f0)] bg-[length:20px_20px] bg-[position:0_0,10px_10px]">
                    {result ? (
                      <img src={result} alt="Result" className="w-full" />
                    ) : (
                      <div className="aspect-square flex items-center justify-center text-gray-400 text-6xl">
                        {loading ? '⏳' : '🎨'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleRemoveBg}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 transition-all transform hover:scale-105 active:scale-95 shadow-lg disabled:scale-100"
                >
                  {loading ? '⏳ Processing...' : '✨ Remove Background'}
                </button>

                {result && (
                  <button
                    onClick={handleDownload}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg font-bold py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                  >
                    ⬇️ Download PNG
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        <div className="mt-8 text-center text-white/80 text-sm">
          Powered by Remove.bg API
        </div>
      </div>
    </main>
  )
}
