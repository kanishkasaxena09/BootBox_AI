import { useState, useCallback } from 'react';
import { useToast } from '../providers/ToastProvider';

export default function useCopy(duration = 1500) {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const copy = useCallback(async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(label ? `${label} copied!` : 'Copied to clipboard!');
      setTimeout(() => setCopied(false), duration);
    } catch {
      toast.error('Failed to copy');
    }
  }, [duration, toast]);

  return { copied, copy };
}
