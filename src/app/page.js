"use client"

import { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

export default function Home() {
  const [images, setImages] = useState([]);
  const [collageCreated, setCollageCreated] = useState(false);
  const canvasRef = useRef(null);

  const onDrop = (acceptedFiles) => {
    setImages(acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    })));
    setCollageCreated(false); // Reset collage creation when new images are uploaded
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: true,
    maxFiles: 2
  });

  const handleCreateCollage = () => {
    setCollageCreated(true);
  };

  useEffect(() => {
    if (collageCreated && images.length === 2 && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
    
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    
      const imageElements = images.map(image => {
        const img = new Image();
        img.src = image.preview;
        return img;
      });
    
      // Helper function to draw an image on the canvas
      const drawImageStretch = (img, x, y, width, height) => {
        ctx.drawImage(img, x, y, width, height);
      };
    
      imageElements[0].onload = () => {
        drawImageStretch(imageElements[0], 0, 0, canvas.width, canvas.height / 2);
    
        // Add white frame around the first image
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 4, canvas.height / 2); // Left frame
        ctx.fillRect(canvas.width - 4, 0, 4, canvas.height / 2); // Right frame
        ctx.fillRect(0, 0, canvas.width, 4); // Top frame
        ctx.fillRect(0, canvas.height / 2 - 4, canvas.width, 4); // Bottom frame
    
        imageElements[1].onload = () => {
          drawImageStretch(imageElements[1], 0, canvas.height / 2, canvas.width, canvas.height / 2);
    
          // Add white frame around the second image
          ctx.fillRect(0, canvas.height / 2, 4, canvas.height / 2); // Left frame
          ctx.fillRect(canvas.width - 4, canvas.height / 2, 4, canvas.height / 2); // Right frame
          ctx.fillRect(0, canvas.height - 4, canvas.width, 4); // Bottom frame
        };
      };
    }
  }, [collageCreated, images]);

  const handleDownloadCollage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'collage.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="px-5 pt-10 pb-20">
      <div className='max-w-4xl m-auto'>
        <h1 className="text-2xl font-bold text-center mb-10">Photo Collage Maker</h1>
        <div className='mb-10'>
          <h2 className='text-xl font-bold mb-2'>①画像を選択</h2>
          <p className='mb-5'>画像を2枚アップロードしてください。</p>
          <div 
            {...getRootProps()} 
            className="border-2 border-dashed border-gray-300 p-5 cursor-pointer bg-gray-100"
          >
            <input {...getInputProps()} />
            <p className="text-lg text-center">クリックしてファイルを選択するか、ここにファイルをドラッグしてください（2枚）</p>

            {images.length > 0 && (
              <div className="flex justify-center mt-5">
                {images.map((file, index) => (
                  <div key={index} className="mx-2">
                    <img
                      src={file.preview}
                      className="w-36 h-36 object-cover"
                      alt={`Uploaded preview ${index}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>
          <h2 className='text-xl font-bold mb-2'>②コラージュを作成</h2>
          <p className='mb-5'>コラージュを作成できます。</p>
          <button 
            onClick={handleCreateCollage} 
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            disabled={images.length !== 2} // Disable button if not exactly 2 images are uploaded
          >
            作成
          </button>
          {collageCreated && images.length === 2 && (
            <div className="p-5 mt-10 bg-black">
              <div className="flex justify-center">
                <div className="relative w-72 h-72 p-2">
                  <canvas ref={canvasRef} width="288" height="288" className="w-full h-full"></canvas>
                </div>
              </div>
              <div className="flex justify-center mt-5">
                <button 
                  onClick={handleDownloadCollage} 
                  className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
                >
                  ダウンロード
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
