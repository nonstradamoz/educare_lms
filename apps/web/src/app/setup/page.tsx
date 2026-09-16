"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { 
  Building2, 
  ShieldCheck, 
  GraduationCap, 
  CreditCard, 
  MessageSquare, 
  FileText,
  Save,
  Plus,
  Trash2,
  Upload,
  Edit2
} from "lucide-react";

export default function SetupPage() {
  const [activeTab, setActiveTab] = useState("Centre Setup");

  const TABS = [
    { id: "Centre Setup", icon: Building2 },
    { id: "Roles & Permissions", icon: ShieldCheck },
    { id: "Academic Structure", icon: GraduationCap },
    { id: "Fee Structure", icon: CreditCard },
    { id: "SMS Templates", icon: MessageSquare },
    { id: "Exam Configuration", icon: FileText },
  ];

  return (
    <DashboardLayout title="System Setup">
      <div className="flex h-full bg-surface">
        
        {/* Left Nav (Tabs) */}
        <div className="w-64 bg-white border-r border-border-soft flex flex-col hidden md:flex shrink-0">
          <div className="p-6 border-b border-border-soft">
            <h2 className="text-sm font-bold text-text-primary">System Setup</h2>
            <p className="text-xs text-text-muted mt-1">Manage global configurations</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {TABS.map((tab) => {
              const active = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    active 
                      ? "bg-brand-blue/10 text-brand-blue" 
                      : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? "text-brand-blue" : "text-text-muted"}`} />
                  {tab.id}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="bg-white border-b border-border-soft px-6 lg:px-8 py-4 flex items-center justify-between shrink-0">
            <div>
              <h1 className="text-base font-bold text-text-primary">{activeTab}</h1>
              <p className="text-xs text-text-muted mt-0.5">Configure your system preferences</p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-blue-dark transition-colors">
              <Save className="h-3.5 w-3.5" /> Save Changes
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 lg:p-8">
            <div className="max-w-4xl mx-auto md:mx-0">
              {activeTab === "Centre Setup" && <CentreSetupTab />}
              {activeTab === "Roles & Permissions" && <RolesPermissionsTab />}
              {activeTab === "Academic Structure" && <AcademicStructureTab />}
              {activeTab === "Fee Structure" && <FeeStructureTab />}
              {activeTab === "SMS Templates" && <SmsTemplatesTab />}
              {activeTab === "Exam Configuration" && <ExamConfigTab />}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function CentreSetupTab() {
  const [isAdding, setIsAdding] = useState(false);
  const [centres, setCentres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: "", code: "", type: "MAIN", address: ""
  });

  useEffect(() => {
    fetchApi<any[]>('/setup/centres')
      .then(data => { setCentres(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const handleSave = async () => {
    try {
      const created = await fetchApi<any>('/setup/centres', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setCentres([...centres, created]);
      setIsAdding(false);
      setFormData({ name: "", code: "", type: "MAIN", address: "" });
    } catch (e) {
      console.error(e);
    }
  };

  if (isAdding) {
    return (
      <div className="bg-white rounded-xl border border-border-soft p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold text-text-primary">Add New Centre</h3>
          <button onClick={() => setIsAdding(false)} className="text-xs font-semibold text-text-secondary hover:text-text-primary">Cancel</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-xs font-bold text-text-secondary mb-1.5">Centre Name *</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Educare South Wing" className="w-full h-10 rounded-lg border border-border-soft bg-surface-2 px-3 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20" />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-secondary mb-1.5">Centre Code</label>
            <input type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="e.g. EDU-SW" className="w-full h-10 rounded-lg border border-border-soft bg-surface-2 px-3 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-text-secondary mb-1.5">Address</label>
            <textarea rows={3} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Full address" className="w-full rounded-lg border border-border-soft bg-surface-2 p-3 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20 resize-none" />
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-border-soft">
          <button onClick={handleSave} className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-blue-dark transition-colors">
            Save Centre
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-border-soft shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-border-soft flex items-center justify-between bg-surface-2/30">
        <div>
          <h3 className="text-sm font-bold text-text-primary">Centres & Branches</h3>
          <p className="text-xs text-text-muted mt-1">Manage multiple learning centres within your institution.</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-blue-dark transition-colors">
          <Plus className="h-3.5 w-3.5" /> Add New Centre
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white border-b border-border-soft">
              <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Centre Name</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Code</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-soft">
            {loading ? <tr><td colSpan={4} className="p-6 text-center text-text-muted">Loading...</td></tr> : 
             centres.map(c => (
              <tr key={c.id} className="hover:bg-surface-2/30">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-brand-blue/10 flex items-center justify-center font-bold text-brand-blue text-xs">
                      {c.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-text-primary text-sm flex items-center gap-2">
                        {c.name}
                        {c.type === "MAIN" && <span className="inline-flex rounded-full bg-brand-red/10 px-2 py-0.5 text-[9px] font-bold text-brand-red uppercase">Main</span>}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-text-secondary font-mono">{c.code}</td>
                <td className="px-6 py-4 text-text-secondary">{c.type}</td>
                <td className="px-6 py-4 text-right">
                  <button className="h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-surface-3 text-text-muted transition-colors">
                    <Edit2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RolesPermissionsTab() {
  const roles = ["Super Admin", "Teacher", "Coordinator", "Receptionist"];
  const modules = [
    "Student Management",
    "Staff Management",
    "Fee Collection",
    "Academics (Exams/Classes)",
    "Reports & Analytics",
    "System Settings"
  ];

  return (
    <div className="bg-white rounded-xl border border-border-soft shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-border-soft flex items-center justify-between bg-surface-2/30">
        <div>
          <h3 className="text-sm font-bold text-text-primary">Roles & Permissions Matrix</h3>
          <p className="text-xs text-text-muted mt-1">Control access to different modules based on staff roles.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-surface px-4 py-2 text-xs font-semibold text-text-primary border border-border-soft shadow-sm hover:bg-white transition-colors">
          <Plus className="h-3.5 w-3.5" /> New Role
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white border-b border-border-soft">
              <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary">Modules</th>
              {roles.map(role => (
                <th key={role} className="px-4 py-4 text-center text-xs font-bold text-text-secondary">
                  {role}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-soft">
            {modules.map(module => (
              <tr key={module} className="hover:bg-surface-2/30">
                <td className="px-6 py-4 font-semibold text-text-primary text-xs">{module}</td>
                {roles.map(role => {
                  const isChecked = role === "Super Admin" || 
                    (role === "Teacher" && (module.includes("Student") || module.includes("Academics"))) ||
                    (role === "Receptionist" && (module.includes("Student") || module.includes("Fee")));
                  return (
                    <td key={role} className="px-4 py-4 text-center">
                      <input 
                        type="checkbox" 
                        defaultChecked={isChecked}
                        disabled={role === "Super Admin"}
                        className="rounded border-border-soft text-brand-blue focus:ring-brand-blue/20 disabled:opacity-50"
                      />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AcademicStructureTab() {
  const [activeTab, setActiveTab] = useState("Years");
  const [years, setYears] = useState<any[]>([]);
  const [boards, setBoards] = useState<any[]>([]);
  const [standards, setStandards] = useState<any[]>([]);
  
  const [yearForm, setYearForm] = useState({ name: "", startDate: "", endDate: "" });
  const [boardForm, setBoardForm] = useState({ name: "", code: "" });
  const [standardForm, setStandardForm] = useState({ name: "", code: "", level: 1 });

  useEffect(() => {
    fetchApi<any[]>('/setup/academic-years').then(data => setYears(data));
    fetchApi<any[]>('/setup/boards').then(data => setBoards(data));
    fetchApi<any[]>('/setup/standards').then(data => setStandards(data));
  }, []);

  const addYear = async () => {
    if (!yearForm.name) return;
    const res = await fetchApi<any>('/setup/academic-years', { method: 'POST', body: JSON.stringify(yearForm) });
    setYears([...years, res]);
    setYearForm({ name: "", startDate: "", endDate: "" });
  };
  
  const addBoard = async () => {
    if (!boardForm.name) return;
    const res = await fetchApi<any>('/setup/boards', { method: 'POST', body: JSON.stringify(boardForm) });
    setBoards([...boards, res]);
    setBoardForm({ name: "", code: "" });
  };

  const addStandard = async () => {
    if (!standardForm.name) return;
    const res = await fetchApi<any>('/setup/standards', { method: 'POST', body: JSON.stringify(standardForm) });
    setStandards([...standards, res]);
    setStandardForm({ name: "", code: "", level: 1 });
  };

  return (
    <div className="bg-white rounded-xl border border-border-soft shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-border-soft flex items-center justify-between bg-surface-2/30">
        <div>
          <h3 className="text-sm font-bold text-text-primary">Academic Structure</h3>
          <p className="text-xs text-text-muted mt-1">Configure boards, classes, and subjects.</p>
        </div>
      </div>
      <div className="border-b border-border-soft px-6 flex items-center gap-6">
        {["Years", "Boards", "Classes"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === tab ? "border-brand-blue text-brand-blue" : "border-transparent text-text-secondary hover:text-text-primary"}`}>
            {tab}
          </button>
        ))}
      </div>
      <div className="p-6">
        {activeTab === "Years" && (
          <div>
            <div className="flex gap-4 mb-6">
              <input type="text" placeholder="e.g. 2026-2027" value={yearForm.name} onChange={e => setYearForm({...yearForm, name: e.target.value})} className="h-10 rounded-lg border border-border-soft px-3 text-sm flex-1" />
              <input type="date" value={yearForm.startDate} onChange={e => setYearForm({...yearForm, startDate: e.target.value})} className="h-10 rounded-lg border border-border-soft px-3 text-sm" />
              <input type="date" value={yearForm.endDate} onChange={e => setYearForm({...yearForm, endDate: e.target.value})} className="h-10 rounded-lg border border-border-soft px-3 text-sm" />
              <button onClick={addYear} className="h-10 bg-brand-blue text-white px-4 rounded-lg text-sm font-bold">Add Year</button>
            </div>
            <div className="space-y-3">
              {years.map(y => (
                <div key={y.id} className="p-4 rounded-lg border border-border-soft bg-surface-2 flex items-center justify-between">
                  <span className="font-bold text-sm">{y.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === "Boards" && (
          <div>
            <div className="flex gap-4 mb-6">
              <input type="text" placeholder="Board Name (e.g. CBSE)" value={boardForm.name} onChange={e => setBoardForm({...boardForm, name: e.target.value})} className="h-10 rounded-lg border border-border-soft px-3 text-sm flex-1" />
              <input type="text" placeholder="Code (e.g. CBSE)" value={boardForm.code} onChange={e => setBoardForm({...boardForm, code: e.target.value})} className="h-10 rounded-lg border border-border-soft px-3 text-sm w-48" />
              <button onClick={addBoard} className="h-10 bg-brand-blue text-white px-4 rounded-lg text-sm font-bold">Add Board</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {boards.map(b => (
                <div key={b.id} className="p-4 rounded-lg border border-border-soft bg-surface-2 flex flex-col">
                  <span className="font-bold text-sm">{b.name}</span>
                  <span className="text-xs text-text-muted mt-1">{b.code}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Classes" && (
          <div>
            <div className="flex gap-4 mb-6">
              <input type="text" placeholder="Class Name (e.g. Class 11)" value={standardForm.name} onChange={e => setStandardForm({...standardForm, name: e.target.value})} className="h-10 rounded-lg border border-border-soft px-3 text-sm flex-1" />
              <input type="text" placeholder="Code (e.g. 11)" value={standardForm.code} onChange={e => setStandardForm({...standardForm, code: e.target.value})} className="h-10 rounded-lg border border-border-soft px-3 text-sm w-32" />
              <input type="number" placeholder="Level" value={standardForm.level} onChange={e => setStandardForm({...standardForm, level: parseInt(e.target.value)})} className="h-10 rounded-lg border border-border-soft px-3 text-sm w-24" />
              <button onClick={addStandard} className="h-10 bg-brand-blue text-white px-4 rounded-lg text-sm font-bold">Add Class</button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {standards.map(s => (
                <div key={s.id} className="p-4 rounded-lg border border-border-soft bg-surface-2 flex items-center justify-between">
                  <span className="font-bold text-sm">{s.name}</span>
                  <span className="text-xs text-text-muted px-2 py-1 bg-white rounded border border-border-soft">Level {s.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
function FeeStructureTab() {
  const feeHeads = [
    { id: 1, name: "Tuition Fee", type: "Recurring (Monthly)", defaultAmount: "₹2,500" },
    { id: 2, name: "Admission Fee", type: "One-time", defaultAmount: "₹5,000" },
    { id: 3, name: "Study Material Fee", type: "Annual", defaultAmount: "₹1,500" },
  ];

  return (
    <div className="bg-white rounded-xl border border-border-soft shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-border-soft flex items-center justify-between bg-surface-2/30">
        <div>
          <h3 className="text-sm font-bold text-text-primary">Fee Heads</h3>
          <p className="text-xs text-text-muted mt-1">Define the standard fee types applicable in your institute.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-blue-dark transition-colors">
          <Plus className="h-3.5 w-3.5" /> Add Fee Head
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white border-b border-border-soft">
              <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase">Fee Name</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase">Frequency</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase">Default Amount</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-soft">
            {feeHeads.map(fee => (
              <tr key={fee.id} className="hover:bg-surface-2/30">
                <td className="px-6 py-4 font-bold text-text-primary text-sm">{fee.name}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex rounded-full bg-surface-2 border border-border-soft px-2.5 py-1 text-[10px] font-bold text-text-secondary">
                    {fee.type}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-text-primary">{fee.defaultAmount}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button className="text-text-muted hover:text-brand-blue transition-colors"><Edit2 className="h-4 w-4" /></button>
                    <button className="text-text-muted hover:text-brand-red transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SmsTemplatesTab() {
  const [activeTemplate, setActiveTemplate] = useState("Fee Reminder");
  const templates = ["Welcome Message", "Fee Reminder", "Absent Alert", "Exam Results", "General Notice"];

  return (
    <div className="bg-white rounded-xl border border-border-soft shadow-sm p-6 md:p-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        <div className="w-full md:w-64 shrink-0">
          <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4">Templates</h3>
          <div className="space-y-1">
            {templates.map(t => (
              <button 
                key={t}
                onClick={() => setActiveTemplate(t)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  activeTemplate === t ? "bg-surface text-brand-blue" : "text-text-primary hover:bg-surface-2"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-text-primary">Edit: {activeTemplate}</h3>
            <span className="text-xs font-semibold text-text-muted">160 chars = 1 SMS</span>
          </div>
          <textarea 
            rows={6}
            className="w-full rounded-xl border border-border-soft bg-surface-2 p-4 text-sm font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20 resize-none"
            defaultValue={`Dear Parent, this is a gentle reminder that the fee for {student_name} is due on {due_date}. Please clear the dues to avoid late fees. Regards, Educare.`}
          />
          <div className="mt-4">
            <p className="text-xs font-bold text-text-secondary mb-2 uppercase tracking-wider">Available Variables</p>
            <div className="flex flex-wrap gap-2">
              {["{student_name}", "{parent_name}", "{due_date}", "{amount}", "{class}"].map(v => (
                <button key={v} className="inline-flex rounded border border-border-soft bg-surface px-2 py-1 text-[11px] font-mono text-text-muted hover:bg-surface-2 transition-colors">
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function ExamConfigTab() {
  const grades = [
    { grade: "A+", min: 90, max: 100, gpa: 10.0 },
    { grade: "A", min: 80, max: 89, gpa: 9.0 },
    { grade: "B+", min: 70, max: 79, gpa: 8.0 },
    { grade: "B", min: 60, max: 69, gpa: 7.0 },
    { grade: "C", min: 50, max: 59, gpa: 6.0 },
    { grade: "F", min: 0, max: 49, gpa: 0.0 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-border-soft p-6 shadow-sm">
        <h3 className="text-sm font-bold text-text-primary mb-6">General Exam Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-text-secondary mb-1.5">Default Pass Percentage (%)</label>
            <input type="number" defaultValue={50} className="w-full h-10 rounded-lg border border-border-soft bg-surface-2 px-3 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20" />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-secondary mb-1.5">Show Rank in Results?</label>
            <select className="w-full h-10 rounded-lg border border-border-soft bg-surface-2 px-3 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20 appearance-none">
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border-soft shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-border-soft flex items-center justify-between bg-surface-2/30">
          <div>
            <h3 className="text-sm font-bold text-text-primary">Grading System</h3>
            <p className="text-xs text-text-muted mt-1">Configure grade letters and percentage thresholds.</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg bg-surface px-4 py-2 text-xs font-semibold text-text-primary border border-border-soft shadow-sm hover:bg-white transition-colors">
            <Plus className="h-3.5 w-3.5" /> Add Grade
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white border-b border-border-soft">
                <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase">Grade</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase">Min %</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase">Max %</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase">GPA / Points</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft">
              {grades.map((g, i) => (
                <tr key={i} className="hover:bg-surface-2/30">
                  <td className="px-6 py-4 font-bold text-brand-blue text-sm">{g.grade}</td>
                  <td className="px-6 py-4 font-semibold text-text-primary">{g.min}%</td>
                  <td className="px-6 py-4 font-semibold text-text-primary">{g.max}%</td>
                  <td className="px-6 py-4 font-semibold text-text-primary">{g.gpa.toFixed(1)}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-text-muted hover:text-brand-red transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
