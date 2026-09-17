"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { CreditCard, Plus, Search, Filter, X, ChevronRight, BookOpen, ChevronDown, CheckCircle2, FileText, Download, User } from "lucide-react";
import Link from "next/link";
import { fetchApi } from "@/lib/api";

interface FeeRecord {
  id: string;
  receiptNo: string;
  studentName: string;
  course: string;
  amount: number;
  date: string;
  status: "PAID" | "PENDING" | "OVERDUE";
  paymentMode: string;
}

export default function FeePage() {
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [search, setSearch] = useState("");
  const [filterCourse, setFilterCourse] = useState("All Classes");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [filterMode, setFilterMode] = useState("All Modes");
  const [showModal, setShowModal] = useState(false);
  const { role } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const fetchFees = async () => {
    setIsLoading(true);
    try {
      const data = await fetchApi<any[]>("/fee");
      const mapped = data.map((d: any) => ({
        id: d.id,
        receiptNo: d.receiptNo,
        studentName: d.student?.user?.name || "Unknown",
        course: "Student", // we can map from enrollments if available
        amount: d.amount,
        date: new Date(d.date).toLocaleDateString(),
        status: d.status,
        paymentMode: d.paymentMode || "-"
      }));
      setFees(mapped);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const filtered = fees.filter(f => {
    const matchSearch = f.studentName.toLowerCase().includes(search.toLowerCase()) || 
                        f.receiptNo.toLowerCase().includes(search.toLowerCase()) ||
                        f.course.toLowerCase().includes(search.toLowerCase());
    const matchCourse = filterCourse === "All Classes" || f.course === filterCourse;
    const matchStatus = filterStatus === "All Status" || f.status === filterStatus;
    const matchMode = filterMode === "All Modes" || f.paymentMode === filterMode;
    return matchSearch && matchCourse && matchStatus && matchMode;
  });

  return (
    <DashboardLayout title="Fee Management">
      <div className="flex flex-col h-full bg-surface">
        
        {/* Header Section */}
        <div className="bg-white border-b border-border-soft px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-brand-blue/10 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-brand-blue" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-primary">Fee Management</h1>
              <p className="text-xs text-text-muted mt-1">Track, collect, and manage student fee payments</p>
            </div>
          </div>
          {role !== 'STUDENT' && (
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-blue-dark transition-colors"
            >
              <Plus className="h-4 w-4" /> Collect Fee
            </button>
          )}
        </div>

        {/* Breadcrumb */}
        <div className="px-6 lg:px-8 py-4 flex items-center gap-2 text-xs font-medium text-text-muted">
          <Link href="/" className="flex items-center gap-1.5 hover:text-text-primary transition-colors">
            <CreditCard className="h-3.5 w-3.5" /> Finance
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-text-primary">Fees</span>
        </div>

        <div className="px-6 lg:px-8 pb-8 space-y-6 flex-1 overflow-y-auto">

          {/* Summary Cards */}
          {role !== 'STUDENT' && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Collected", value: "₹5,000",  color: "text-brand-blue bg-brand-blue/10" },
                { label: "Pending Fees",    value: "₹4,500",  color: "text-warning bg-warning/10"       },
                { label: "Overdue",         value: "₹0",      color: "text-brand-red bg-brand-red/10"   },
                { label: "This Month",      value: "₹5,000",  color: "text-success bg-success/10"       },
              ].map((c) => (
                <div key={c.label} className="bg-white rounded-2xl border border-border-soft p-6 shadow-sm">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${c.color} mb-4`}>
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <p className="text-2xl font-bold text-text-primary tracking-tight">{c.value}</p>
                  <p className="text-xs font-bold text-text-muted mt-1 uppercase tracking-wider">{c.label}</p>
                </div>
              ))}
            </div>
          )}
          
          {/* Filters Section */}
          <div className="bg-white rounded-2xl border border-border-soft shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6 text-sm font-bold text-text-primary">
              <Filter className="h-4 w-4 text-brand-blue" /> Filter Records
            </div>
            
            <div className="flex mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by Student Name, Receipt No, or Course..."
                  className="w-full h-10 rounded-l-lg border border-r-0 border-border-soft bg-surface-2 pl-10 pr-4 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>
              <button className="h-10 px-6 rounded-r-lg bg-brand-blue-dark text-white text-sm font-semibold hover:bg-brand-blue transition-colors">
                Search
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Class/Course", state: filterCourse, set: setFilterCourse, options: ["All Classes", "Class 11", "Class 12 (A)"] },
                { label: "Status", state: filterStatus, set: setFilterStatus, options: ["All Status", "Paid", "Pending", "Overdue"] },
                { label: "Payment Mode", state: filterMode, set: setFilterMode, options: ["All Modes", "Online", "-", "Cash", "Bank Transfer"] },
                { label: "Rows", options: ["10", "20", "50"] },
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
                <BookOpen className="h-4 w-4 text-brand-blue" /> Fee Records
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
                    <th className="px-4 py-4 text-left text-[11px] font-bold text-text-muted uppercase tracking-wider">Receipt No</th>
                    <th className="px-4 py-4 text-left text-[11px] font-bold text-text-muted uppercase tracking-wider">Student & Course</th>
                    <th className="px-4 py-4 text-left text-[11px] font-bold text-text-muted uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-4 text-left text-[11px] font-bold text-text-muted uppercase tracking-wider">Date & Mode</th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold text-text-muted uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-soft">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-20 text-center text-sm text-text-muted">
                        No fee records match your filters.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((f) => (
                      <tr key={f.id} className="hover:bg-surface-2/30 transition-colors">
                      {role !== 'STUDENT' && (
                        <td className="px-6 py-4">
                          <input type="checkbox" className="rounded border-border-soft text-brand-blue focus:ring-brand-blue/20" />
                        </td>
                      )}
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center justify-center px-2 py-1 rounded bg-brand-blue/10 text-brand-blue font-bold text-xs">
                          {f.receiptNo}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-bold text-text-primary">{f.studentName}</p>
                        <p className="text-[11px] text-text-muted mt-0.5">{f.course}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-bold text-text-primary">₹{f.amount}</span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-xs font-medium text-text-primary">{f.date}</p>
                        <p className="text-[11px] text-text-muted mt-0.5">{f.paymentMode}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                          f.status === "PAID" ? "bg-success/10 border-success/20 text-success" : 
                          f.status === "PENDING" ? "bg-warning/10 border-warning/20 text-warning" :
                          "bg-brand-red/10 border-brand-red/20 text-brand-red"
                        }`}>
                          {f.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {f.status === "PAID" && (
                          <button className="inline-flex items-center gap-1.5 text-brand-blue hover:text-brand-blue-dark text-xs font-bold transition-colors">
                            <Download className="h-3.5 w-3.5" /> Receipt
                          </button>
                        )}
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

      {/* Collect Fee Modal */}
      {showModal && <CollectFeeModal onClose={() => setShowModal(false)} />}
    </DashboardLayout>
  );
}

function CollectFeeModal({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState("Payment Details");

  const TABS = [
    { id: "Payment Details", icon: CreditCard },
    { id: "Student Info", icon: User },
    { id: "Remarks", icon: FileText },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-full overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-soft shrink-0">
          <h2 className="text-base font-bold text-text-primary">Collect Fee</h2>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-surface-2 flex items-center justify-center text-text-muted hover:bg-surface-3 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="px-6 border-b border-border-soft flex items-center gap-6 overflow-x-auto shrink-0 hide-scrollbar">
          {TABS.map(tab => {
            const active = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1.5 py-4 min-w-max border-b-2 transition-colors ${
                  active ? "border-brand-blue" : "border-transparent hover:border-border-soft"
                }`}
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shadow-sm ${
                  active ? "bg-brand-blue text-white" : "bg-surface-2 text-text-secondary"
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className={`text-xs font-bold ${active ? "text-brand-blue" : "text-text-secondary"}`}>
                  {tab.id}
                </span>
              </button>
            )
          })}
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-surface">
          <div className="bg-white rounded-xl border border-border-soft p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1.5">
                  Select Student <span className="text-brand-red">*</span>
                </label>
                <div className="relative">
                  <select className="w-full h-10 appearance-none rounded-lg border border-border-soft bg-surface-2 pl-3 pr-8 text-sm text-text-muted focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20">
                    <option>---Select Student---</option>
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col pointer-events-none">
                    <ChevronDown className="h-3 w-3 text-text-muted rotate-180 -mb-1" />
                    <ChevronDown className="h-3 w-3 text-text-muted" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1.5">
                  Fee Head <span className="text-brand-red">*</span>
                </label>
                <div className="relative">
                  <select className="w-full h-10 appearance-none rounded-lg border border-border-soft bg-surface-2 pl-3 pr-8 text-sm text-text-muted focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20">
                    <option>---Select Fee Head---</option>
                    <option>Tuition Fee</option>
                    <option>Admission Fee</option>
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col pointer-events-none">
                    <ChevronDown className="h-3 w-3 text-text-muted rotate-180 -mb-1" />
                    <ChevronDown className="h-3 w-3 text-text-muted" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1.5">
                  Amount (₹) <span className="text-brand-red">*</span>
                </label>
                <div className="relative">
                  <input type="number" placeholder="0" className="w-full h-10 rounded-lg border border-border-soft bg-surface-2 pl-3 pr-8 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1.5">
                  Payment Mode <span className="text-brand-red">*</span>
                </label>
                <div className="relative">
                  <select className="w-full h-10 appearance-none rounded-lg border border-border-soft bg-surface-2 pl-3 pr-8 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20">
                    <option>Cash</option>
                    <option>Online / UPI</option>
                    <option>Bank Transfer</option>
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col pointer-events-none">
                    <ChevronDown className="h-3 w-3 text-text-muted rotate-180 -mb-1" />
                    <ChevronDown className="h-3 w-3 text-text-muted" />
                  </div>
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
            <CheckCircle2 className="h-4 w-4" /> Record Payment
          </button>
        </div>

      </div>
    </div>
  );
}
