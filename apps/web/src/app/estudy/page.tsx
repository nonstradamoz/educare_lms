"use client";

import { useEffect } from "react";
import { fetchApi } from "@/lib/api";

import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { BookOpen, Plus, Search, Filter, ChevronRight, ChevronDown, FileText, Video, Link as LinkIcon, Download, X, Upload, Play, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";

interface Material {
  id: string;
  title: string;
  type: "PDF" | "Video" | "Link";
  subject: string;
  classLevel: string;
  dateAdded: string;
  size?: string;
  url?: string;
}

export default function EStudyPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("All Classes");
  const [filterSubject, setFilterSubject] = useState("All Subjects");
  const [filterType, setFilterType] = useState("All Types");
  const [sortBy, setSortBy] = useState("Date Added (Newest First)");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { role } = useAuth();

  useEffect(() => {
    setIsLoading(true);
    fetchApi('/estudy')
      .then((data: any) => {
        const mapped = data.map((m: any) => ({
          id: m.id,
          title: m.title,
          type: m.type === 'VIDEO' ? 'Video' : m.type === 'LINK' ? 'Link' : 'PDF',
          subject: m.syllabus?.subject?.name || 'N/A',
          classLevel: m.syllabus?.standard?.name || 'N/A',
          dateAdded: new Date(m.createdAt).toLocaleDateString(),
          url: m.url
        }));
        setMaterials(mapped);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = materials.filter(m => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) || 
                        m.subject.toLowerCase().includes(search.toLowerCase());
    const matchClass = filterClass === "All Classes" || m.classLevel === filterClass;
    const matchSubject = filterSubject === "All Subjects" || m.subject === filterSubject;
    const matchType = filterType === "All Types" || m.type === filterType;
    return matchSearch && matchClass && matchSubject && matchType;
  });

  const sortedMaterials = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "Date Added (Oldest First)":
        return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
      case "Title (A-Z)":
        return a.title.localeCompare(b.title);
      case "Title (Z-A)":
        return b.title.localeCompare(a.title);
      case "Date Added (Newest First)":
      default:
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    }
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case "PDF": return <FileText className="h-4 w-4 text-brand-red" />;
      case "Video": return <Video className="h-4 w-4 text-brand-blue" />;
      case "Link": return <LinkIcon className="h-4 w-4 text-warning" />;
      default: return <BookOpen className="h-4 w-4 text-text-secondary" />;
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "PDF": return "bg-brand-red/10 text-brand-red border-brand-red/20";
      case "Video": return "bg-brand-blue/10 text-brand-blue border-brand-blue/20";
      case "Link": return "bg-warning/10 text-warning border-warning/20";
      default: return "bg-surface-2 text-text-secondary border-border-soft";
    }
  };

  return (
    <DashboardLayout title="eStudy Materials">
      <div className="flex flex-col h-full bg-surface">
        
        {/* Header Section */}
        <div className="bg-white border-b border-border-soft px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-brand-blue/10 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-brand-blue" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-primary">eStudy Materials</h1>
              <p className="text-xs text-text-muted mt-1">Manage study notes, video lessons, and reference links</p>
            </div>
          </div>
          {role !== 'STUDENT' && (
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-blue-dark transition-colors"
            >
              <Plus className="h-4 w-4" /> Add Material
            </button>
          )}
        </div>

        {/* Breadcrumb */}
        <div className="px-6 lg:px-8 py-4 flex items-center gap-2 text-xs font-medium text-text-muted">
          <Link href="/" className="flex items-center gap-1.5 hover:text-text-primary transition-colors">
            <BookOpen className="h-3.5 w-3.5" /> Academics
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-text-primary">eStudy</span>
        </div>

        <div className="px-6 lg:px-8 pb-8 space-y-6 flex-1 overflow-y-auto">
          
          {/* Filters Section */}
          <div className="bg-white rounded-2xl border border-border-soft shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6 text-sm font-bold text-text-primary">
              <Filter className="h-4 w-4 text-brand-blue" /> Filter Materials
            </div>
            
            <div className="flex mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by Title, Subject or Class..."
                  className="w-full h-10 rounded-l-lg border border-r-0 border-border-soft bg-surface-2 pl-10 pr-4 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>
              <button className="h-10 px-6 rounded-r-lg bg-brand-blue-dark text-white text-sm font-semibold hover:bg-brand-blue transition-colors">
                Search
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Class", state: filterClass, set: setFilterClass, options: ["All Classes", "Class 10", "Class 11", "Class 12"] },
                { label: "Subject", state: filterSubject, set: setFilterSubject, options: ["All Subjects", "Mathematics", "Physics", "Chemistry"] },
                { label: "Type", state: filterType, set: setFilterType, options: ["All Types", "PDF", "Video", "Link"] },
                { label: "Sort By", state: sortBy, set: setSortBy, options: ["Date Added (Newest First)", "Date Added (Oldest First)", "Title (A-Z)", "Title (Z-A)"] },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">{f.label}</label>
                  <div className="relative">
                    <select
                      value={f.state}
                      onChange={(e) => f.set && f.set(e.target.value)}
                      className="w-full h-9 appearance-none rounded-lg border border-border-soft bg-surface-2 pl-3 pr-8 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                    >
                      {f.options.map(o => <option key={o}>{o}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* List Section */}
          <div className="bg-white rounded-2xl border border-border-soft shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-border-soft flex items-center justify-between bg-surface-2/50">
              <div className="flex items-center gap-2 text-sm font-bold text-text-primary">
                <FileText className="h-4 w-4 text-brand-blue" /> Material Repository
              </div>
              
              <div className="flex items-center gap-1 text-xs font-medium">
                <button className="px-2 py-1 text-text-muted hover:text-text-primary">« Previous</button>
                <button className="h-7 w-7 rounded bg-brand-blue text-white flex items-center justify-center shadow-sm">1</button>
                <button className="px-2 py-1 text-text-muted hover:text-text-primary">Next »</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-soft bg-white">
                    {role !== 'STUDENT' && (
                      <th className="px-6 py-4 text-left">
                        <input type="checkbox" className="rounded border-border-soft text-brand-blue focus:ring-brand-blue/20" />
                      </th>
                    )}
                    <th className="px-4 py-4 text-left text-[11px] font-bold text-text-muted uppercase tracking-wider">Title</th>
                    <th className="px-4 py-4 text-left text-[11px] font-bold text-text-muted uppercase tracking-wider">Type</th>
                    <th className="px-4 py-4 text-left text-[11px] font-bold text-text-muted uppercase tracking-wider">Subject & Class</th>
                    <th className="px-4 py-4 text-left text-[11px] font-bold text-text-muted uppercase tracking-wider">Date Added</th>
                    <th className="px-6 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-soft">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="py-20 text-center text-sm text-text-muted">
                        Loading study materials...
                      </td>
                    </tr>
                  ) : sortedMaterials.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-20 text-center text-sm text-text-muted">
                        No materials match your filters.
                      </td>
                    </tr>
                  ) : (
                    sortedMaterials.map((m) => (
                      <tr key={m.id} className="hover:bg-surface-2/30 transition-colors">
                      {role !== 'STUDENT' && (
                        <td className="px-6 py-4">
                          <input type="checkbox" className="rounded border-border-soft text-brand-blue focus:ring-brand-blue/20" />
                        </td>
                      )}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 shrink-0 rounded-lg flex items-center justify-center ${getTypeStyle(m.type)}`}>
                            {getIconForType(m.type)}
                          </div>
                          <div>
                            <p className="font-bold text-text-primary">{m.title}</p>
                            <p className="text-[11px] text-text-muted mt-0.5">{m.size}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold ${getTypeStyle(m.type)}`}>
                          {m.type}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-xs font-bold text-brand-blue">{m.subject}</p>
                        <p className="text-[11px] text-text-muted mt-0.5">{m.classLevel}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-xs font-medium text-text-primary">{m.dateAdded}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => {
                            if (m.type === "Video" && m.url) {
                              window.open(`https://customer-${process.env.NEXT_PUBLIC_CLOUDFLARE_CUSTOMER_CODE || "your-code"}.cloudflarestream.com/${m.url}/iframe`, '_blank');
                            } else if (m.type === "Link" && m.url) {
                              window.open(m.url, '_blank');
                            }
                          }}
                          className="inline-flex items-center gap-1.5 text-brand-blue hover:text-brand-blue-dark text-xs font-bold transition-colors">
                          {m.type === "Video" ? <><Play className="h-3.5 w-3.5" /> Play</> : m.type === "Link" ? <><ExternalLink className="h-3.5 w-3.5" /> Open</> : <><Download className="h-3.5 w-3.5" /> Download</>}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Material Modal */}
      {showModal && <AddMaterialModal onClose={() => setShowModal(false)} onSuccess={() => window.location.reload()} />}
    </DashboardLayout>
  );
}

import { FileUploader } from "@/components/upload/file-uploader";

function AddMaterialModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"PDF" | "VIDEO" | "DOCUMENT">("PDF");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const handleUploadSuccess = async (url: string, videoId?: string) => {
    setSaving(true);
    try {
      await fetchApi('/study-materials', {
        method: 'POST',
        body: JSON.stringify({
          title,
          type: type === "VIDEO" ? "VIDEO" : type,
          url: type === "VIDEO" ? videoId : url,
          academicYearId: "dummy-academic-year", // Update when dropdowns are added
          syllabusId: "dummy-syllabus-id"
        })
      });
      onSuccess();
      onClose();
    } catch (e: any) {
      console.error(e);
      setError("Error saving material to database");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-full overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-soft shrink-0">
          <h2 className="text-base font-bold text-text-primary">Add Study Material</h2>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-surface-2 flex items-center justify-center text-text-muted hover:bg-surface-3 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 bg-surface">
          <div className="bg-white rounded-xl border border-border-soft p-6 space-y-4">
            {error && (
              <p className="text-xs text-brand-red bg-brand-red/8 border border-brand-red/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {step === 1 ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1.5">Material Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Thermodynamics Video"
                    className="w-full h-10 rounded-lg border border-border-soft bg-surface-2 pl-3 pr-8 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1.5">Material Type *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "PDF", label: "PDF Document" },
                      { value: "VIDEO", label: "Video Lesson" }
                    ].map(t => (
                      <label key={t.value} className={`flex items-center justify-center gap-2 rounded-lg border py-3 px-2 cursor-pointer transition-colors ${type === t.value ? 'border-brand-blue bg-brand-blue/5' : 'border-border-soft bg-surface-2'}`}>
                        <input type="radio" name="materialType" checked={type === t.value} onChange={() => setType(t.value as any)} className="hidden" />
                        <span className={`text-xs font-bold ${type === t.value ? 'text-brand-blue' : 'text-text-primary'}`}>{t.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => title.trim() ? setStep(2) : setError("Title is required")}
                  className="w-full py-2.5 text-sm font-bold text-white bg-brand-blue hover:bg-brand-blue-dark rounded-lg mt-2 transition-colors"
                >
                  Next: Upload File
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-text-secondary">Uploading: <strong className="text-text-primary">{title}</strong></span>
                  <button onClick={() => setStep(1)} className="text-[10px] text-brand-blue font-bold hover:underline">Edit details</button>
                </div>
                
                {saving ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin text-brand-blue" />
                    <p className="text-xs font-bold text-text-secondary">Saving to database...</p>
                  </div>
                ) : (
                  <FileUploader
                    type={type === "VIDEO" ? "VIDEO" : "FILE"}
                    onUploadSuccess={handleUploadSuccess}
                    onUploadError={setError}
                    onCancel={onClose}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}