import React, { useState } from 'react';
import { FileDown, Image, CheckCircle, Info, File } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Dropzone from '../../components/Dropzone';
import Loader from '../../components/Loader';

const Compressors = () => {
  const [activeSubTab, setActiveSubTab] = useState('pdf'); // 'pdf' or 'image'
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  // Common Compressor Settings
  const [compressLevel, setCompressLevel] = useState('medium'); // low, medium, high
  const [selectedFile, setSelectedFile] = useState(null);

  // Result metrics
  const [result, setResult] = useState(null);

  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  };

  const handleCompression = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setLoadingMessage(`Compressing ${activeSubTab.toUpperCase()} document...`);
    setResult(null);

    try {
      const fd = new FormData();
      fd.append('level', compressLevel);

      let endpoint = '';
      let filename = '';

      if (activeSubTab === 'pdf') {
        fd.append('pdfFile', selectedFile);
        endpoint = '/api/pdf/compress';
        filename = `compressed-${selectedFile.name}`;
      } else {
        fd.append('imageFile', selectedFile);
        endpoint = '/api/compress/image';
        filename = `compressed-${selectedFile.name}`;
      }

      const response = await fetch(endpoint, { method: 'POST', body: fd });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Compression failed.');
      }

      const blob = await response.blob();
      
      // Calculate compression statistics
      const originalSize = selectedFile.size;
      const compressedSize = blob.size;
      const savedBytes = originalSize - compressedSize;
      const percentReduction = Math.max(0, (savedBytes / originalSize) * 100);

      setResult({
        original: formatBytes(originalSize),
        compressed: formatBytes(compressedSize),
        reduction: percentReduction.toFixed(1),
        qualityRetained: compressLevel === 'low' ? '85%' : compressLevel === 'medium' ? '60%' : '30%'
      });

      downloadBlob(blob, filename);
    } catch (e) {
      alert(e.message || 'An error occurred during compression.');
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const sizes = ['Bytes', 'KB', 'MB'];
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-left">
      
      {/* Sub Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-white/5 pb-1">
        <button
          onClick={() => {
            setActiveSubTab('pdf');
            setSelectedFile(null);
            setResult(null);
          }}
          className={`px-4 py-2 font-bold text-sm border-b-2 transition-all ${
            activeSubTab === 'pdf'
              ? 'border-indigo-500 text-indigo-500'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          PDF Compressor
        </button>
        <button
          onClick={() => {
            setActiveSubTab('image');
            setSelectedFile(null);
            setResult(null);
          }}
          className={`px-4 py-2 font-bold text-sm border-b-2 transition-all ${
            activeSubTab === 'image'
              ? 'border-indigo-500 text-indigo-500'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Image Compressor
        </button>
      </div>

      {loading && <Loader message={loadingMessage} />}

      {/* Main Compressor Panel */}
      <div className="glass-panel p-6 rounded-2xl space-y-6">
        <div className="flex items-center space-x-2">
          {activeSubTab === 'pdf' ? <FileDown className="h-5 w-5 text-indigo-500" /> : <Image className="h-5 w-5 text-indigo-500" />}
          <h3 className="text-md font-bold text-neutral-800 dark:text-neutral-200">
            {activeSubTab === 'pdf' ? 'PDF Optimization & Shrinking' : 'Image Files Compression'}
          </h3>
        </div>

        {/* Upload zone */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-400">Upload Source File</label>
          <Dropzone
            onFilesSelected={setSelectedFile}
            accept={activeSubTab === 'pdf' ? '.pdf' : '.jpg,.jpeg,.png,.webp'}
            maxSizeMB={activeSubTab === 'pdf' ? 12 : 6}
            value={selectedFile}
            onClear={() => {
              setSelectedFile(null);
              setResult(null);
            }}
            label={`Drag & drop your ${activeSubTab.toUpperCase()} file here`}
          />
        </div>

        {/* Level configuration */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-neutral-400 block">Select Target Level</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'low', label: 'Low Compression', desc: 'Maximum quality retained' },
              { id: 'medium', label: 'Balanced', desc: 'Recommended file size/quality mix' },
              { id: 'high', label: 'High Compression', desc: 'Max size reduction' }
            ].map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => setCompressLevel(lvl.id)}
                className={`p-3 rounded-xl border flex flex-col text-left space-y-1 transition-all ${
                  compressLevel === lvl.id
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400'
                    : 'border-neutral-300 dark:border-neutral-700 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <span className="text-xs font-bold">{lvl.label}</span>
                <span className="text-[10px] text-neutral-500 leading-tight">{lvl.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleCompression}
          disabled={!selectedFile}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-50 shadow-md shadow-indigo-600/10"
        >
          Compress File
        </button>

        {/* Compression Statistics Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-5 rounded-xl bg-green-500/5 border border-green-500/15 space-y-4"
            >
              <div className="flex items-center space-x-2 text-green-500 font-bold text-sm">
                <CheckCircle className="h-4.5 w-4.5" />
                <span>Compression Successful! Download initiated.</span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-neutral-100 dark:bg-white/5 rounded-lg space-y-0.5">
                  <span className="text-[10px] text-neutral-500 block">Original Size</span>
                  <span className="text-sm font-black text-neutral-700 dark:text-neutral-300">{result.original}</span>
                </div>
                <div className="p-3 bg-neutral-100 dark:bg-white/5 rounded-lg space-y-0.5">
                  <span className="text-[10px] text-neutral-500 block">Compressed Size</span>
                  <span className="text-sm font-black text-indigo-500">{result.compressed}</span>
                </div>
                <div className="p-3 bg-neutral-100 dark:bg-white/5 rounded-lg space-y-0.5">
                  <span className="text-[10px] text-neutral-500 block">Size Reduced By</span>
                  <span className="text-sm font-black text-green-500">{result.reduction}%</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-[10px] text-neutral-400 italic">
                <Info className="h-3.5 w-3.5" />
                <span>Estimated retention factor: ~{result.qualityRetained} structural elements.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default Compressors;
