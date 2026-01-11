'use client';

import { useEffect, useCallback, useRef } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useResumeStore } from '@/store/useResumeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { debounce } from '@/lib/utils';

const AUTOSAVE_DELAY = 2000;

export function useAutoSave() {
  const { user } = useAuthStore();
  const {
    resumeId,
    title,
    template,
    content,
    isDirty,
    markSaving,
    markSaved,
  } = useResumeStore();

  const saveRef = useRef<(() => void) | null>(null);

  const saveToFirestore = useCallback(async () => {
    if (!user || !resumeId || !db) return;

    try {
      markSaving(true);
      await setDoc(
        doc(db, 'resumes', resumeId),
        {
          userId: user.uid,
          title,
          template,
          content,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      markSaved();
    } catch (error) {
      console.error('Auto-save failed:', error);
      markSaving(false);
    }
  }, [user, resumeId, title, template, content, markSaving, markSaved]);

  useEffect(() => {
    saveRef.current = debounce(saveToFirestore, AUTOSAVE_DELAY);
  }, [saveToFirestore]);

  useEffect(() => {
    if (isDirty && user && resumeId && saveRef.current) {
      saveRef.current();
    }
  }, [isDirty, user, resumeId, content, title, template]);

  const forceSave = useCallback(async () => {
    if (isDirty) {
      await saveToFirestore();
    }
  }, [isDirty, saveToFirestore]);

  return { forceSave };
}
