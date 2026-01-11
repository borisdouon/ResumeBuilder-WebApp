'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  Plus, 
  MoreVertical, 
  Trash2, 
  Edit, 
  Copy,
  Clock,
  Search
} from 'lucide-react';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button, Input } from '@/components/ui';
import { Header } from '@/components/layout';
import { useAuth } from '@/hooks/useAuth';
import { Resume, defaultResumeContent } from '@/types/resume';
import toast from 'react-hot-toast';

interface ResumeCard {
  id: string;
  title: string;
  template: string;
  updatedAt: Date;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [resumes, setResumes] = useState<ResumeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchResumes = async () => {
      if (!user || !db) return;

      try {
        const q = query(
          collection(db, 'resumes'),
          where('userId', '==', user.uid),
          orderBy('updatedAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const resumeList: ResumeCard[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title || 'Untitled Resume',
          template: doc.data().template || 'classic',
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        }));
        setResumes(resumeList);
      } catch (error) {
        console.error('Error fetching resumes:', error);
        toast.error('Failed to load resumes');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchResumes();
    }
  }, [user]);

  const createNewResume = async () => {
    if (!user || !db) return;

    try {
      const docRef = await addDoc(collection(db, 'resumes'), {
        userId: user.uid,
        title: 'Untitled Resume',
        template: 'classic',
        content: defaultResumeContent,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      router.push(`/dashboard/resume/${docRef.id}`);
    } catch (error) {
      console.error('Error creating resume:', error);
      toast.error('Failed to create resume');
    }
  };

  const deleteResume = async (id: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'resumes', id));
      setResumes((prev) => prev.filter((r) => r.id !== id));
      toast.success('Resume deleted');
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast.error('Failed to delete resume');
    }
    setMenuOpen(null);
  };

  const duplicateResume = async (id: string) => {
    if (!user || !db) return;

    const original = resumes.find((r) => r.id === id);
    if (!original) return;

    try {
      const docRef = await addDoc(collection(db, 'resumes'), {
        userId: user.uid,
        title: `${original.title} (Copy)`,
        template: original.template,
        content: defaultResumeContent,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      setResumes((prev) => [
        {
          id: docRef.id,
          title: `${original.title} (Copy)`,
          template: original.template,
          updatedAt: new Date(),
        },
        ...prev,
      ]);
      toast.success('Resume duplicated');
    } catch (error) {
      console.error('Error duplicating resume:', error);
      toast.error('Failed to duplicate resume');
    }
    setMenuOpen(null);
  };

  const filteredResumes = resumes.filter((resume) =>
    resume.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.round((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Resumes</h1>
            <p className="text-gray-600 mt-1">
              Create and manage your professional resumes
            </p>
          </div>
          <Button variant="primary" onClick={createNewResume}>
            <Plus className="w-4 h-4 mr-2" />
            New Resume
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search resumes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Resumes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse"
              >
                <div className="h-32 bg-gray-100 rounded-lg mb-4" />
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredResumes.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No resumes found' : 'No resumes yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? 'Try a different search term'
                : 'Create your first resume to get started'}
            </p>
            {!searchQuery && (
              <Button variant="primary" onClick={createNewResume}>
                <Plus className="w-4 h-4 mr-2" />
                Create Resume
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* New Resume Card */}
            <button
              onClick={createNewResume}
              className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-6 hover:border-blue-400 hover:bg-blue-50/50 transition-all group flex flex-col items-center justify-center min-h-[200px]"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <span className="font-medium text-gray-900">New Resume</span>
              <span className="text-sm text-gray-500 mt-1">Start from scratch</span>
            </button>

            {/* Resume Cards */}
            {filteredResumes.map((resume) => (
              <div
                key={resume.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group relative"
              >
                {/* Preview */}
                <Link href={`/dashboard/resume/${resume.id}`}>
                  <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 p-4 border-b border-gray-100">
                    <div className="w-full h-full bg-white rounded shadow-sm p-2">
                      <div className="h-2 w-16 bg-gray-200 rounded mb-2" />
                      <div className="h-1 w-12 bg-gray-100 rounded mb-3" />
                      <div className="space-y-1">
                        <div className="h-1 w-full bg-gray-100 rounded" />
                        <div className="h-1 w-5/6 bg-gray-100 rounded" />
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <Link href={`/dashboard/resume/${resume.id}`} className="flex-1">
                      <h3 className="font-medium text-gray-900 truncate hover:text-blue-600">
                        {resume.title}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(resume.updatedAt)}
                      </p>
                    </Link>

                    {/* Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === resume.id ? null : resume.id)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {menuOpen === resume.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setMenuOpen(null)}
                          />
                          <div className="absolute right-0 top-8 z-20 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                            <Link
                              href={`/dashboard/resume/${resume.id}`}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </Link>
                            <button
                              onClick={() => duplicateResume(resume.id)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Copy className="w-4 h-4" />
                              Duplicate
                            </button>
                            <button
                              onClick={() => deleteResume(resume.id)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
