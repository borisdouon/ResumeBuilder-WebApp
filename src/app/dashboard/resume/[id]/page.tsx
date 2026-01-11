'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileText, ArrowLeft, Cloud, CloudOff } from 'lucide-react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { EditorPanel } from '@/components/editor';
import { PreviewPanel } from '@/components/preview';
import { Button } from '@/components/ui';
import { useResumeStore } from '@/store/useResumeStore';
import { useAuth } from '@/hooks/useAuth';
import { useAutoSave } from '@/hooks/useAutoSave';
import { ResumeContent, defaultResumeContent } from '@/types/resume';
import toast from 'react-hot-toast';

export default function ResumeEditorPage() {
  const params = useParams();
  const router = useRouter();
  const resumeId = params.id as string;
  
  const { user, loading: authLoading } = useAuth();
  const { 
    title, 
    setTitle, 
    loadResume, 
    isDirty, 
    isSaving,
    lastSaved 
  } = useResumeStore();
  const { forceSave } = useAutoSave();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (!user || !resumeId || !db) return;

    const firestore = db;
    const loadResumeData = async () => {
      try {
        const docRef = doc(firestore, 'resumes', resumeId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setError('Resume not found');
          return;
        }

        const data = docSnap.data();
        
        if (data.userId !== user.uid) {
          setError('You do not have permission to view this resume');
          return;
        }

        loadResume({
          id: resumeId,
          title: data.title || 'Untitled Resume',
          template: data.template || 'classic',
          content: data.content || defaultResumeContent,
        });
      } catch (err) {
        console.error('Error loading resume:', err);
        setError('Failed to load resume');
      } finally {
        setLoading(false);
      }
    };

    loadResumeData();
  }, [user, authLoading, resumeId, router, loadResume]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleSave = async () => {
    await forceSave();
    toast.success('Resume saved');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your resume...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{error}</h2>
          <Link href="/dashboard">
            <Button variant="primary">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <div className="h-6 w-px bg-gray-200" />

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-medium text-gray-900 bg-transparent border-none outline-none focus:ring-0 max-w-[200px] sm:max-w-none"
              placeholder="Untitled Resume"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Save Status */}
          <div className="hidden sm:flex items-center gap-2 text-sm">
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                <span className="text-gray-500">Saving...</span>
              </>
            ) : isDirty ? (
              <>
                <CloudOff className="w-4 h-4 text-yellow-500" />
                <span className="text-yellow-600">Unsaved changes</span>
              </>
            ) : lastSaved ? (
              <>
                <Cloud className="w-4 h-4 text-green-500" />
                <span className="text-gray-500">Saved</span>
              </>
            ) : null}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={!isDirty || isSaving}
          >
            Save
          </Button>
        </div>
      </header>

      {/* Main Content - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Panel - Left Side */}
        <div className="w-full lg:w-1/2 xl:w-2/5 border-r border-gray-200 overflow-hidden">
          <EditorPanel />
        </div>

        {/* Preview Panel - Right Side */}
        <div className="hidden lg:block lg:w-1/2 xl:w-3/5 overflow-hidden">
          <PreviewPanel />
        </div>
      </div>

      {/* Mobile Preview Toggle */}
      <div className="lg:hidden fixed bottom-4 right-4">
        <Button variant="primary" size="lg" className="shadow-lg">
          Preview
        </Button>
      </div>
    </div>
  );
}
