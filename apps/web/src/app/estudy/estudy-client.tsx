"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { BookOpen, Plus, Search, Filter, ChevronRight, ChevronDown, FileText, Video, Link as LinkIcon, Download, X, Play, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { FileUploader } from "@/components/upload/file-uploader";
import { fetchApi } from "@/lib/api";

export interface Material {
  id: string;
  title: string;
  type: "PDF" | "VIDEO" | "LINK" | "DOCUMENT" | "FILE";
  url?: string;
  academicYear?: { name: string };
  syllabus?: { 
    board: { name: string },
    standard: { name: string },
    subject: { name: string }
  };
  chapter?: { name: string };
  topic?: { name: string };
  uploader?: { firstName: string, lastName: string, email: string };
  targetTrack?: string;
  createdAt: string;
}

export function EStudyClient({ initialMaterials }: { initialMaterials: Material[] }) {
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [search, setSearch] = useState("");
  
  // Hierarchy Data
  const [boards, setBoards] = useState<any[]>([]);
  const [standards, setStandards] = useState<any[]>([]);
  const [subjectsList, setSubjectsList] = useState<any[]>([]);

  // Selected Filters
  const [filterBoard, setFilterBoard] = useState("All Boards");
  const [filterClass, setFilterClass] = useState("All Classes");
  const [filterSubject, setFilterSubject] = useState("All Subjects");
  const [filterType, setFilterType] = useState("All Types");
  const [filterTrack, setFilterTrack] = useState("All Tracks");
  const [sortBy, setSortBy] = useState("Date Added (Newest First)");
  const [showModal, setShowModal] = useState(false);
  const { role } = useAuth();

  useEffect(() => {
    fetchApi('/setup/boards').then((data: any) => setBoards(data)).catch(console.error);
    fetchApi('/setup/standards').then((data: any) => setStandards(data)).catch(console.error);
    fetchApi('/setup/subjects').then((data: any) => setSubjectsList(data)).catch(console.error);
    
    // Refresh materials
    fetchApi('/study-materials').then((data: any) => setMaterials(data)).catch(console.error);
  }, []);

  const filtered = materials.filter(m => {
    const subjName = m.syllabus?.subject?.name || "";
    const className = m.syllabus?.standard?.name || "";
    const boardName = m.syllabus?.board?.name || "";

    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) || 
                        subjName.toLowerCase().includes(search.toLowerCase());
    
    const matchBoard = filterBoard === "All Boards" || boardName === filterBoard;
    const matchClass = filterClass === "All Classes" || className === filterClass;
    const matchSubject = filterSubject === "All Subjects" || subjName === filterSubject;
    const matchType = filterType === "All Types" || m.type === filterType;
    const matchTrack = filterTrack === "All Tracks" || m.targetTrack === filterTrack;
    return matchSearch && matchBoard && matchClass && matchSubject && matchType && matchTrack;
  });

  const sortedMaterials = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "Date Added (Oldest First)":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "Title (A-Z)":
        return a.title.localeCompare(b.title);
      case "Title (Z-A)":
        return b.title.localeCompare(a.title);
      case "Date Added (Newest First)":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case "PDF": 
      case "DOCUMENT":
      case "FILE": return <FileText className="h-4 w-4 text-brand-red" />;
      case "VIDEO": return <Video className="h-4 w-4 text-brand-blue" />;
      case "LINK": return <LinkIcon className="h-4 w-4 text-warning" />;
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

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              {[
                { label: "Track", state: filterTrack, set: setFilterTrack, options: ["All Tracks", "TUITION", "ENTRANCE"] },
                { label: "Board", state: filterBoard, set: setFilterBoard, options: ["All Boards", ...boards.map(b => b.name)] },
                { label: "Class", state: filterClass, set: setFilterClass, options: ["All Classes", ...standards.map(s => s.name)] },
                { label: "Subject", state: filterSubject, set: setFilterSubject, options: ["All Subjects", ...subjectsList.map(s => s.name)] },
                { label: "Type", state: filterType, set: setFilterType, options: ["All Types", "PDF", "VIDEO", "LINK", "DOCUMENT"] },
                { label: "Sort By", state: sortBy, set: setSortBy, options: ["Date Added (Newest First)", "Date Added (Oldest First)", "Title (A-Z)", "Title (Z-A)"] },
              ].map((f) => (
                <div key={f.label} className="relative">
                  <select
                    value={f.state}
                    onChange={(e) => f.set(e.target.value)}
                    className="w-full h-10 appearance-none rounded-xl border border-border-soft bg-white px-3 pr-8 text-[13px] font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                  >
                    {f.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
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
                  {sortedMaterials.length === 0 ? (
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
                          <div className={`h-10 w-10 shrink-0 rounded-lg flex items-center justify-center ${m.type === 'VIDEO' ? 'bg-brand-blue/10' : 'bg-surface-2'}`}>
                            {getIconForType(m.type)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-text-primary">{m.title}</p>
                              {m.targetTrack && m.targetTrack !== "BOTH" && (
                                <span className="shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase bg-brand-blue/10 text-brand-blue border-brand-blue/20">
                                  {m.targetTrack}
                               </span>
                              )}
                            </div>
                            <p className="text-[11px] text-text-muted mt-0.5">
                              {m.uploader ? `Uploaded by ${m.uploader.firstName} ${m.uploader.lastName}` : "System Admin"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold ${m.type === 'VIDEO' ? 'border-brand-blue bg-brand-blue/10 text-brand-blue' : 'border-border-soft bg-surface-2 text-text-secondary'}`}>
                          {m.type}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-xs font-bold text-brand-blue">{m.syllabus?.subject?.name || "N/A"}</p>
                        <p className="text-[11px] text-text-muted mt-0.5">{m.syllabus?.standard?.name || "General"} | {m.syllabus?.board?.name || "No Board"}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-xs font-medium text-text-primary">{new Date(m.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => {
                            if (!m.url) return;
                            if (m.type === "VIDEO") {
                              if (m.url.includes('http')) {
                                // Fallback if video is stored in R2 directly
                                window.open(m.url, '_blank');
                              } else {
                                // Cloudflare Stream ID
                                window.open(`https://customer-${process.env.NEXT_PUBLIC_CLOUDFLARE_CUSTOMER_CODE || "your-code"}.cloudflarestream.com/${m.url}/iframe`, '_blank');
                              }
                            } else {
                              // PDFs, Links, Documents
                              window.open(m.url, '_blank');
                            }
                          }}
                          className="inline-flex items-center gap-1.5 text-brand-blue hover:text-brand-blue-dark text-xs font-bold transition-colors">
                          {m.type === "VIDEO" ? <><Play className="h-3.5 w-3.5" /> Play</> : m.type === "LINK" ? <><ExternalLink className="h-3.5 w-3.5" /> Open</> : <><Download className="h-3.5 w-3.5" /> Download</>}
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

function AddMaterialModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"PDF" | "VIDEO" | "DOCUMENT">("PDF");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  // Hierarchy State
  const [boards, setBoards] = useState<any[]>([]);
  const [standards, setStandards] = useState<any[]>([]);
  const [subjectsList, setSubjectsList] = useState<any[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);

  const [selectedBoard, setSelectedBoard] = useState("");
  const [selectedStandard, setSelectedStandard] = useState("");
  const [subject, setSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [targetTrack, setTargetTrack] = useState("BOTH");

  // Fetch initial data
  useEffect(() => {
    fetchApi('/setup/boards').then((data: any) => setBoards(data)).catch(console.error);
    fetchApi('/setup/standards').then((data: any) => setStandards(data)).catch(console.error);
    fetchApi('/setup/subjects').then((res: any) => {
      setSubjectsList(res);
      if (res.length > 0) setSubject(res[0].id);
    }).catch(console.error);
  }, []);

  // Fetch chapters when subject changes
  useEffect(() => {
    if (subject) {
      fetchApi(`/setup/chapters?subjectId=${subject}`).then((data: any) => setChapters(data)).catch(console.error);
      setSelectedChapter("");
      setSelectedTopic("");
    } else {
      setChapters([]);
    }
  }, [subject]);

  // Fetch topics when chapter changes
  useEffect(() => {
    if (selectedChapter) {
      fetchApi(`/setup/topics?chapterId=${selectedChapter}`).then((data: any) => setTopics(data)).catch(console.error);
      setSelectedTopic("");
    } else {
      setTopics([]);
    }
  }, [selectedChapter]);

  const handleUploadSuccess = async (url: string, videoId?: string) => {
    setSaving(true);
    try {
      await fetchApi('/study-materials', {
        method: 'POST',
        body: JSON.stringify({
          title,
          type: type === "VIDEO" ? "VIDEO" : type,
          url: type === "VIDEO" ? videoId : url,
          boardId: selectedBoard || undefined,
          standardId: selectedStandard || undefined,
          subjectId: subject || undefined,
          chapterId: selectedChapter || undefined,
          topicId: selectedTopic || undefined,
          targetTrack,
          // Remove dummy syllabus/academicYear ids so backend handles fallback,
          // or ideally, these should also be selected by the user.
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

                <div className="p-4 rounded-xl border border-border-soft bg-surface-2/30 space-y-4">
                  <h4 className="text-xs font-bold text-text-primary">Target Audience</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-text-secondary mb-1.5">Board (Optional)</label>
                      <select value={selectedBoard} onChange={(e) => setSelectedBoard(e.target.value)} className="w-full h-9 rounded-lg border border-border-soft bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/25">
                        <option value="">Select Board</option>
                        {boards.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-text-secondary mb-1.5">Class (Optional)</label>
                      <select value={selectedStandard} onChange={(e) => setSelectedStandard(e.target.value)} className="w-full h-9 rounded-lg border border-border-soft bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/25">
                        <option value="">Select Class</option>
                        {standards.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-text-secondary mb-1.5">Track</label>
                      <select value={targetTrack} onChange={(e) => setTargetTrack(e.target.value)} className="w-full h-9 rounded-lg border border-border-soft bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/25">
                        <option value="BOTH">Both (General)</option>
                        <option value="TUITION">Tuition Only</option>
                        <option value="ENTRANCE">Entrance Only</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-border-soft bg-brand-blue/5 space-y-4">
                  <h4 className="text-xs font-bold text-text-primary text-brand-blue">Subject Matter</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-brand-blue/70 mb-1.5">Subject *</label>
                      <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full h-9 rounded-lg border border-border-soft bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/25">
                        {subjectsList.length === 0 ? <option value="">Loading...</option> : subjectsList.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-brand-blue/70 mb-1.5">Chapter</label>
                      <select value={selectedChapter} onChange={(e) => setSelectedChapter(e.target.value)} className="w-full h-9 rounded-lg border border-border-soft bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/25">
                        <option value="">Select Chapter</option>
                        {chapters.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-brand-blue/70 mb-1.5">Topic</label>
                      <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)} className="w-full h-9 rounded-lg border border-border-soft bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/25">
                        <option value="">Select Topic</option>
                        {topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    </div>
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
