import React, { useState } from 'react';
import { Upload, X, Check } from 'lucide-react';

interface SignatureUploadProps {
  label: string;
  currentSignature?: string;
  onUpload: (base64: string) => void;
  readOnly: boolean;
}

export const SignatureUpload: React.FC<SignatureUploadProps> = ({ label, currentSignature, onUpload, readOnly }) => {
  const [preview, setPreview] = useState<string | undefined>(currentSignature);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        onUpload(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center min-h-[160px] bg-slate-50 relative">
      <h4 className="absolute top-2 left-2 text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</h4>
      
      {preview ? (
        <div className="w-full flex flex-col items-center">
          <img src={preview} alt="Signature" className="max-h-24 object-contain mb-2" />
          {!readOnly && (
             <button 
             onClick={() => { setPreview(undefined); onUpload(''); }}
             className="text-red-500 text-xs hover:underline flex items-center gap-1"
           >
             <X size={12} /> Remove
           </button>
          )}
        </div>
      ) : (
        <div className="text-center">
          {readOnly ? (
             <span className="text-slate-400 italic text-sm">No Signature</span>
          ) : (
            <>
                <label className="cursor-pointer flex flex-col items-center gap-2 group">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Upload size={20} />
                    </div>
                    <span className="text-sm text-blue-600 font-medium">Upload Signature</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
            </>
          )}
        </div>
      )}
    </div>
  );
};