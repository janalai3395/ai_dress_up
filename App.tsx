
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { PersonIcon, ClothingIcon, SparklesIcon, BackIcon } from './components/icons';
import { Spinner } from './components/Spinner';
import { performVirtualTryOn } from './services/geminiService';
import { fileToGenerativePart } from './utils/fileUtils';
import type { FileData } from './types';

const App: React.FC = () => {
  const [personFileData, setPersonFileData] = useState<FileData | null>(null);
  const [clothingFileData, setClothingFileData] = useState<FileData | null>(null);

  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (file: File, type: 'person' | 'clothing') => {
    try {
      const fileData = await fileToGenerativePart(file);
      if (type === 'person') {
        setPersonFileData(fileData);
      } else {
        setClothingFileData(fileData);
      }
    } catch (err) {
      setError('Error processing file. Please try another image.');
      console.error(err);
    }
  }, []);

  const handleGenerate = async () => {
    if (!personFileData || !clothingFileData) {
      setError('Please upload both a person and a clothing item.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const generatedImageBase64 = await performVirtualTryOn(personFileData, clothingFileData);
      setResultImage(`data:image/png;base64,${generatedImageBase64}`);
    } catch (err) {
      console.error(err);
      setError('Failed to generate the try-on image. The AI model may not be able to process these images. Please try again with different photos.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setPersonFileData(null);
    setClothingFileData(null);
    setResultImage(null);
    setError(null);
    setIsLoading(false);
  };


  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                <SparklesIcon className="w-8 h-8 text-indigo-600" />
                <span>Virtual Try-On</span>
            </h1>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        {!resultImage && !isLoading && (
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <p className="text-lg text-gray-600">Upload a photo of a person and an item of clothing to see the magic happen!</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <ImageUploader 
                        id="person-uploader"
                        label="Upload Person"
                        icon={<PersonIcon className="w-12 h-12 text-gray-400" />}
                        onFileSelect={(file) => handleFileSelect(file, 'person')}
                        previewUrl={personFileData?.previewUrl || null}
                    />
                    <ImageUploader 
                        id="clothing-uploader"
                        label="Upload Clothing"
                        icon={<ClothingIcon className="w-12 h-12 text-gray-400" />}
                        onFileSelect={(file) => handleFileSelect(file, 'clothing')}
                        previewUrl={clothingFileData?.previewUrl || null}
                    />
                </div>
                
                {error && <div className="text-center text-red-500 bg-red-100 p-3 rounded-lg mb-6">{error}</div>}

                <div className="flex justify-center">
                    <button
                        onClick={handleGenerate}
                        disabled={!personFileData || !clothingFileData || isLoading}
                        className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                    >
                        <SparklesIcon className="w-6 h-6" />
                        Generate Style
                    </button>
                </div>
            </div>
        )}

        {isLoading && (
            <div className="text-center flex flex-col items-center justify-center h-96">
                <Spinner />
                <p className="text-indigo-600 font-semibold mt-4 text-lg">Styling your new look...</p>
                <p className="text-gray-500 mt-2">This may take a moment.</p>
            </div>
        )}

        {resultImage && !isLoading && (
            <div className="max-w-2xl mx-auto text-center">
                 <h2 className="text-3xl font-bold mb-6 text-gray-900">Your Virtual Try-On!</h2>
                <div className="bg-white p-4 rounded-xl shadow-2xl mb-8 border border-gray-200">
                    <img src={resultImage} alt="Virtual try-on result" className="rounded-lg w-full h-auto" />
                </div>
                <button
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-300"
                >
                   <BackIcon className="w-5 h-5"/>
                    Try Another Style
                </button>
            </div>
        )}
      </main>
    </div>
  );
};

export default App;
