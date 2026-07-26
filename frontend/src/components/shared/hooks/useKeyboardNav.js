import { useEffect, useCallback } from 'react';

export default function useKeyboardNav(handlers = {}) {
  const handleKeyDown = useCallback((e) => {
    const tag = e.target.tagName;
    const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
    const key = e.key.toLowerCase();

    Object.entries(handlers).forEach(([shortcut, handler]) => {
      if (typeof handler !== 'function') return;
      const parts = shortcut.split('+');
      const mainKey = parts[parts.length - 1].toLowerCase();
      const needCtrl = parts.includes('ctrl') || parts.includes('mod');
      const needShift = parts.includes('shift');
      const needAlt = parts.includes('alt');

      if (key !== mainKey) return;
      if (needCtrl && !e.ctrlKey && !e.metaKey) return;
      if (needShift && !e.shiftKey) return;
      if (needAlt && !e.altKey) return;
      if (isInput && !needCtrl && mainKey.length === 1) return;

      e.preventDefault();
      handler(e);
    });
  }, [handlers]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
