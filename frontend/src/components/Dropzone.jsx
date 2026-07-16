import React, { useState, useRef } from 'react';
import { UploadCloud, File, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dropzone = ({
  onFilesSelected,
  accept = '*',
  multiple = false,
  maxSizeMB = 10,
  label = "Drag & drop your file here, or click to browse",
  value = null,
  onClear = null
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    setError('');
    
    // Check size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      setError(`File is too large. Max size is ${maxSizeMB}MB.`);
      return false;
    }

    // Check extension
    if (accept !== '*') {
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      const acceptedExtensions = accept.split(',').map(e => e.trim().toLowerCase());
      
      const isAccepted = acceptedExtensions.some(item => {
        if (item.startsWith('.')) {
          return ext === item;
        }
        if (item.includes('/*')) {
          const mimeGroup = item.split('/')[0];
          return file.type.startsWith(mimeGroup);
        }
        return file.type === item;
      });

      if (!isAccepted) {
        setError(`Invalid file type. Supported extensions: ${accept}`);
        return false;
      }
    }

    return true;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFiles = Array.from(e.dataTransfer.files);
      processFiles(selectedFiles);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFiles = Array.from(e.target.files);
      processFiles(selectedFiles);
    }
  };

  const processFiles = (filesList) => {
    const validFiles = [];
    for (const file of filesList) {
      if (validateFile(file)) {
        validFiles.push(file);
      } else {
        return; // Stop on first validation error
      }
    }

    if (validFiles.length > 0) {
      if (multiple) {
        onFilesSelected(validFiles);
      } else {
        onFilesSelected(validFiles[0]);
      }
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Render file items
  const renderFilesList = () => {
    if (!value) return null;
    const filesArray = Array.isArray(value) ? value : [value];

    return (
      <div className="mt-4 space-y-2">
        {filesArray.map((file, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            key={idx}
            className="flex items-center justify-between p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              <File className="h-5 w-5 flex-shrink-0 text-indigo-500" />
              <div className="text-left overflow-hidden">
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-neutral-500">
                  {formatBytes(file.size)}
                </p>
              </div>
            </div>
            {onClear && (
              <button
                type="button"
                onClick={() => {
                  if (multiple) {
                    const copy = [...value];
                    copy.splice(idx, 1);
                    onFilesSelected(copy.length > 0 ? copy : null);
                  } else {
                    onClear();
                  }
                }}
                className="p-1 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-indigo-500 bg-indigo-500/5 dark:bg-indigo-500/10'
            : 'border-neutral-300 dark:border-neutral-700 hover:border-indigo-400 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
        />

        <div className="flex flex-col items-center justify-center space-y-3 text-center">
          <div className="p-3 bg-indigo-500/10 rounded-full text-indigo-500 dark:text-indigo-400">
            <UploadCloud className="h-8 w-8 animate-pulse" />
          </div>
          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {label}
          </p>
          <p className="text-xs text-neutral-400">
            Supported types: {accept === '*' ? 'Any File' : accept.replace(/\./g, ' ').toUpperCase()} (Max {maxSizeMB}MB)
          </p>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center space-x-2 mt-2 text-red-500 text-sm font-medium"
          >
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {renderFilesList()}
    </div>
  );
};

export default Dropzone;
