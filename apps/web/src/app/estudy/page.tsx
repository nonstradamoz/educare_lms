"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { BookOpen, Plus, Search, Filter, ChevronRight, ChevronDown, FileText, Video, Link as LinkIcon, Download, X, Upload } from "lucide-react";
import Link from "next/link";

interface Material {
  id: string;
  title: string;
  type: "PDF" | "Video" | "Link";
  subject: string;
  classLevel: string;
  dateAdded: string;
  size?: string;
}

const SAMPLE_MATERIALS: Material[] = [
  {
    id: "1",
    title: "Thermodynamics Chapter Notes",
    type: "PDF",
    subject: "Physics",
    classLevel: "Class 11",
    dateAdded: "Sep 14, 2026",
    size: "2.4 MB",
  },
  {
    id: "2",
    title: "Algebra Crash Course Video",
    type: "Video",
    subject: "Mathematics",
    classLevel: "Class 10",
    dateAdded: "Sep 15, 2026",
    size: "45 mins",
  },
  {
    id: "3",
    title: "Previous Year Question Paper 2025",
    type: "PDF",
    subject: "Chemistry",
    classLevel: "Class 12",
    dateAdded: "Sep 10, 2026",
    size: "1.1 MB",
  }
];

export default function EStudyPage() {
  const [materials, setMaterials] = useState<Material[]>(SAMPLE_MATERIALS);
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("All Classes");
  const [filterSubject, setFilterSubject] = useState("All Subjects");
  const [filterType, setFilterType] = useState("All Types");
  const [sortBy, setSortBy] = useState("Date Added (Newest First)");
  const [showModal, setShowModal] = useState(false);

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
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-blue-dark transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Material
          </button>
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
                    <th className="px-6 py-4 text-left">
                      <input type="checkbox" className="rounded border-border-soft text-brand-blue focus:ring-brand-blue/20" />
                    </th>
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
                      <td className="px-6 py-4">
                        <input type="checkbox" className="rounded border-border-soft text-brand-blue focus:ring-brand-blue/20" />
                      </td>
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
                        <button className="inline-flex items-center gap-1.5 text-brand-blue hover:text-brand-blue-dark text-xs font-bold transition-colors">
                          <Download className="h-3.5 w-3.5" /> {m.type === "Link" ? "Open" : "Download"}
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
      {showModal && <AddMaterialModal onClose={() => setShowModal(false)} />}
    </DashboardLayout>
  );
}

function AddMaterialModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-full overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-soft shrink-0">
          <h2 className="text-base font-bold text-text-primary">Add Study Material</h2>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-surface-2 flex items-center justify-center text-text-muted hover:bg-surface-3 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-surface">
          <div className="bg-white rounded-xl border border-border-soft p-6">
            <div className="space-y-6">
              
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1.5">
                  Material Title <span className="text-brand-red">*</span>
                </label>
                <div className="relative">
                  <input type="text" placeholder="e.g. Thermodynamics Chapter Notes" className="w-full h-10 rounded-lg border border-border-soft bg-surface-2 pl-3 pr-8 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1.5">
                    Class <span className="text-brand-red">*</span>
                  </label>
                  <div className="relative">
                    <select className="w-full h-10 appearance-none rounded-lg border border-border-soft bg-surface-2 pl-3 pr-8 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20">
                      <option>---Select Class---</option>
                      <option>Class 10</option>
                      <option>Class 11</option>
                      <option>Class 12</option>
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col pointer-events-none">
                      <ChevronDown className="h-3 w-3 text-text-muted rotate-180 -mb-1" />
                      <ChevronDown className="h-3 w-3 text-text-muted" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1.5">
                    Subject <span className="text-brand-red">*</span>
                  </label>
                  <div className="relative">
                    <select className="w-full h-10 appearance-none rounded-lg border border-border-soft bg-surface-2 pl-3 pr-8 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20">
                      <option>---Select Subject---</option>
                      <option>Mathematics</option>
                      <option>Physics</option>
                      <option>Chemistry</option>
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col pointer-events-none">
                      <ChevronDown className="h-3 w-3 text-text-muted rotate-180 -mb-1" />
                      <ChevronDown className="h-3 w-3 text-text-muted" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1.5">
                  Material Type <span className="text-brand-red">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["PDF Document", "Video Lesson", "External Link"].map(type => (
                    <label key={type} className="flex items-center justify-center gap-2 rounded-lg border border-border-soft bg-surface-2 py-3 px-2 cursor-pointer hover:border-brand-blue/50 transition-colors">
                      <input type="radio" name="materialType" className="text-brand-blue focus:ring-brand-blue/20" />
                      <span className="text-xs font-bold text-text-primary">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1.5">
                  Upload File <span className="text-brand-red">*</span>
                </label>
                <div className="border-2 border-dashed border-border-soft rounded-xl p-8 flex flex-col items-center justify-center bg-surface-2/50 hover:bg-surface-2 transition-colors cursor-pointer text-center group">
                  <div className="h-12 w-12 rounded-full bg-brand-blue/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="h-6 w-6 text-brand-blue" />
                  </div>
                  <p className="text-sm font-bold text-text-primary mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-text-muted">PDF, MP4, or external URL links</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-border-soft flex items-center justify-end gap-4 shrink-0 bg-white">
          <button onClick={onClose} className="text-sm font-bold text-text-secondary hover:text-text-primary transition-colors">
            Cancel
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-text-primary px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-black transition-colors">
            <ChevronRight className="h-4 w-4" /> Save Material
          </button>
        </div>

      </div>
    </div>
  );
}
