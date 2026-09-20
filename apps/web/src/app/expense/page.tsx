"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageShell } from "@/components/layout/page-shell";
import { DollarSign, Plus, ArrowUpRight, ArrowDownRight, TrendingUp, Loader2, Calendar, FileText, IndianRupee, X } from "lucide-react";
import { fetchApi } from "@/lib/api";

type Transaction = {
  id: string;
  type: "INCOME" | "EXPENSE";
  category: string;
  amount: number;
  date: string;
  reference?: string;
  description?: string;
  paymentMode?: string;
  recordedBy: { firstName: string; lastName: string };
};

export default function ExpenseIncomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, profit: 0, totalFees: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const loadData = async () => {
    try {
      const [txData, sumData] = await Promise.all([
        fetchApi("/finance/transactions"),
        fetchApi("/finance/summary")
      ]);
      setTransactions(Array.isArray(txData) ? txData : []);
      setSummary(sumData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <DashboardLayout title="Expense & Income">
      <PageShell
        title="Finance Dashboard"
        subtitle="Track institutional expenses, ad-hoc income, and fee collections"
        icon={DollarSign}
        accentColor="green"
        actions={
          <button 
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-green-700 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Record Transaction
          </button>
        }
      >
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-border-soft p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Total Income</p>
                <p className="text-2xl font-black mt-1 text-green-600 flex items-center"><IndianRupee className="h-5 w-5" /> {summary.totalIncome.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg text-green-600"><ArrowUpRight className="h-5 w-5" /></div>
            </div>
            <p className="text-[10px] text-text-muted mt-2">Includes ₹{summary.totalFees.toLocaleString('en-IN')} in student fees</p>
          </div>

          <div className="bg-white rounded-xl border border-border-soft p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Total Expense</p>
                <p className="text-2xl font-black mt-1 text-red-600 flex items-center"><IndianRupee className="h-5 w-5" /> {summary.totalExpense.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg text-red-600"><ArrowDownRight className="h-5 w-5" /></div>
            </div>
            <p className="text-[10px] text-text-muted mt-2">Operational costs & salaries</p>
          </div>

          <div className="bg-white rounded-xl border border-border-soft p-5 shadow-sm md:col-span-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <TrendingUp className="h-24 w-24 text-brand-blue" />
            </div>
            <div className="relative z-10">
              <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Net Profit / Balance</p>
              <p className={`text-3xl font-black mt-1 flex items-center ${summary.profit >= 0 ? "text-brand-blue" : "text-red-600"}`}>
                <IndianRupee className="h-6 w-6" /> {summary.profit.toLocaleString('en-IN')}
              </p>
              <p className="text-xs font-semibold text-text-secondary mt-2">Overall financial health</p>
            </div>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="bg-white rounded-xl border border-border-soft shadow-sm overflow-hidden flex flex-col h-[400px]">
          <div className="px-5 py-4 border-b border-border-soft bg-surface-2">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <FileText className="h-4 w-4 text-text-muted" /> Recent Transactions (Ad-hoc)
            </h3>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white border-b border-border-soft shadow-sm z-10">
                <tr>
                  <th className="text-left px-5 py-3 text-[11px] font-bold text-text-muted uppercase tracking-wider">Date</th>
                  <th className="text-left px-5 py-3 text-[11px] font-bold text-text-muted uppercase tracking-wider">Type</th>
                  <th className="text-left px-5 py-3 text-[11px] font-bold text-text-muted uppercase tracking-wider">Category & Desc</th>
                  <th className="text-left px-5 py-3 text-[11px] font-bold text-text-muted uppercase tracking-wider">Reference</th>
                  <th className="text-right px-5 py-3 text-[11px] font-bold text-text-muted uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <Loader2 className="h-6 w-6 animate-spin text-brand-blue mx-auto" />
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr><td colSpan={5} className="py-16 text-center text-sm text-text-muted">No transactions recorded.</td></tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-surface-2/30 transition-colors">
                      <td className="px-5 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-text-secondary">
                          <Calendar className="h-3.5 w-3.5" /> {new Date(t.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${t.type === 'INCOME' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-xs font-bold text-text-primary">{t.category}</p>
                        {t.description && <p className="text-[10px] text-text-muted mt-0.5">{t.description}</p>}
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-[11px] font-medium text-text-secondary">{t.reference || "-"}</p>
                        {t.paymentMode && <p className="text-[9px] text-text-muted uppercase mt-0.5">{t.paymentMode}</p>}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <p className={`text-sm font-black flex items-center justify-end ${t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                          {t.type === 'INCOME' ? '+' : '-'}<IndianRupee className="h-3.5 w-3.5" />{t.amount.toLocaleString('en-IN')}
                        </p>
                        <p className="text-[9px] text-text-muted mt-0.5">By {t.recordedBy.firstName}</p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </PageShell>

      {/* Add Transaction Modal */}
      {showModal && (
        <TransactionModal 
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); loadData(); }}
        />
      )}
    </DashboardLayout>
  );
}

function TransactionModal({ onClose, onSuccess }: any) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    type: "EXPENSE",
    category: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    reference: "",
    description: "",
    paymentMode: "CASH",
  });

  const categories = formData.type === "EXPENSE" 
    ? ["Salary", "Rent", "Marketing", "Utilities", "Maintenance", "Software/IT", "Other Expense"]
    : ["Donation", "Sale of Material", "Event Ticket", "Other Income"]; // Note: Fees are handled elsewhere

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetchApi(`/finance/transaction`, {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      onSuccess();
    } catch (e) {
      console.error(e);
      alert("Error saving transaction");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-soft">
          <h2 className="text-sm font-bold text-text-primary">Record New Transaction</h2>
          <button onClick={onClose} className="h-8 w-8 rounded-full hover:bg-surface flex items-center justify-center"><X className="h-4 w-4 text-text-muted" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <div className="flex gap-4 p-1 bg-surface rounded-lg">
            <button type="button" onClick={() => setFormData({...formData, type: "EXPENSE", category: ""})} className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors ${formData.type === "EXPENSE" ? "bg-white shadow-sm text-red-600" : "text-text-muted hover:text-text-primary"}`}>
              Record Expense
            </button>
            <button type="button" onClick={() => setFormData({...formData, type: "INCOME", category: ""})} className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors ${formData.type === "INCOME" ? "bg-white shadow-sm text-green-600" : "text-text-muted hover:text-text-primary"}`}>
              Record Ad-hoc Income
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1.5">Amount (₹) *</label>
              <input required type="number" min="0" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full h-10 rounded-lg border border-border-soft bg-surface pl-3 text-sm font-black focus:bg-white focus:ring-2 focus:ring-brand-blue/20" />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1.5">Date *</label>
              <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full h-10 rounded-lg border border-border-soft bg-surface pl-3 text-sm focus:bg-white focus:ring-2 focus:ring-brand-blue/20" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1.5">Category *</label>
              <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full h-10 rounded-lg border border-border-soft bg-surface pl-3 text-sm focus:bg-white focus:ring-2 focus:ring-brand-blue/20">
                <option value="">Select...</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1.5">Payment Mode</label>
              <select value={formData.paymentMode} onChange={e => setFormData({...formData, paymentMode: e.target.value})} className="w-full h-10 rounded-lg border border-border-soft bg-surface pl-3 text-sm focus:bg-white focus:ring-2 focus:ring-brand-blue/20">
                <option value="CASH">Cash</option>
                <option value="BANK_TRANSFER">Bank Transfer (NEFT/IMPS)</option>
                <option value="UPI">UPI</option>
                <option value="CHEQUE">Cheque</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-secondary mb-1.5">Reference / Bill No.</label>
            <input value={formData.reference} onChange={e => setFormData({...formData, reference: e.target.value})} className="w-full h-10 rounded-lg border border-border-soft bg-surface pl-3 text-sm focus:bg-white focus:ring-2 focus:ring-brand-blue/20" />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-secondary mb-1.5">Description (Optional)</label>
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={2} className="w-full rounded-lg border border-border-soft bg-surface p-3 text-sm focus:bg-white focus:ring-2 focus:ring-brand-blue/20 resize-none" />
          </div>

        </form>
        <div className="p-4 border-t border-border-soft bg-surface-2 flex justify-end gap-3 rounded-b-2xl">
          <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-bold text-text-secondary hover:text-text-primary">Cancel</button>
          <button onClick={handleSubmit} disabled={saving} className={`flex items-center justify-center min-w-[120px] rounded-lg px-5 py-2 text-sm font-bold text-white shadow-sm disabled:opacity-50 ${formData.type === "INCOME" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : `Save ${formData.type === "INCOME" ? "Income" : "Expense"}`}
          </button>
        </div>
      </div>
    </div>
  );
}
