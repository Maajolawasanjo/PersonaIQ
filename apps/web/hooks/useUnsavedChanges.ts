'use client';

import { useEffect } from 'react';

export function useUnsavedChanges(isDirty: boolean, message = 'You have unsaved changes. Are you sure you want to leave?') {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, message]);

  const confirmLeave = (onConfirm: () => void) => {
    if (!isDirty || window.confirm(message)) {
      onConfirm();
    }
  };

  return { confirmLeave };
}
