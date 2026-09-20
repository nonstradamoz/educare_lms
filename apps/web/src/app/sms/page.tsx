"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageShell } from "@/components/layout/page-shell";
import { MessageSquare, Send, CheckCircle2, AlertCircle, Clock, Loader2, Users } from "lucide-react";
import { fetchApi } from "@/lib/api";

type Log = {
  id: string;
  recipientName: string;
  phoneNumber: string;
  message: string;
  status: "PENDING" | "SENT" | "DELIVERED" | "FAILED";
  createdAt: string;
  sentBy?: { firstName: string; lastName: string };
};

export default function SmsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [targetType, setTargetType] = useState<"SINGLE" | "CLASS" | "BOARD" | "CENTRE" | "ALL">("SINGLE");
  const [phone, setPhone] = useState("");
  const [targetId, setTargetId] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  // Hierarchy Data
  const [boards, setBoards] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [centres, setCentres] = useState<any[]>([]);

  const loadData = async () => {
    try {
      const data = await fetchApi("/sms/logs");
      setLogs(Array.isArray(data) ? data : []);
      
      const [b, c, ctr] = await Promise.all([
        fetchApi("/setup/boards").catch(() => []),
        fetchApi("/setup/standards").catch(() => []),
        fetchApi("/setup/centres").catch(() => [])
      ]);
      setBoards(b as any[]);
      setClasses(c as any[]);
      setCentres(ctr as any[]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);
    try {
      if (targetType === "SINGLE") {
        await fetchApi("/sms/send", {
          method: "POST",
          body: JSON.stringify({ to: phone, message })
        });
      } else {
        await fetchApi("/sms/bulk", {
          method: "POST",
          body: JSON.stringify({ type: targetType, targetId, message })
        });
      }
      
      setMessage("");
      setPhone("");
      await loadData();
      alert("SMS Queued successfully!");
    } catch (e) {
      alert("Failed to send SMS.");
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DELIVERED": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "SENT": return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
      case "FAILED": return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-amber-500" />;
    }
  };

  return (
    <DashboardLayout title="SMS & Communications">
      <PageShell
        title="SMS & Communications"
        subtitle="Send broadcast messages and view delivery logs (Powered by Twilio)"
        icon={MessageSquare}
        accentColor="blue"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          
          {/* Left Column: Send SMS Form */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-border-soft shadow-sm p-6 flex flex-col h-full overflow-y-auto">
            <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
              <Send className="h-4 w-4 text-brand-blue" /> Compose Message
            </h3>
            
            <form onSubmit={handleSend} className="space-y-5 flex-1 flex flex-col">
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1.5">Target Audience</label>
                <select
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value as any)}
                  className="w-full h-10 rounded-lg border border-border-soft bg-surface pl-3 text-sm focus:bg-white focus:ring-2 focus:ring-brand-blue/20"
                >
                  <option value="SINGLE">Single Student (Phone Number)</option>
                  <option value="CLASS">By Class / Standard</option>
                  <option value="BOARD">By Board</option>
                  <option value="CENTRE">By Centre</option>
                  <option value="ALL">All Active Students</option>
                </select>
              </div>

              {targetType === "SINGLE" && (
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1.5">Phone Number (with Country Code)</label>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+919876543210"
                    className="w-full h-10 rounded-lg border border-border-soft bg-surface pl-3 text-sm focus:bg-white focus:ring-2 focus:ring-brand-blue/20"
                  />
                </div>
              )}

              {targetType === "CLASS" && (
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1.5">Select Class</label>
                  <select required value={targetId} onChange={e => setTargetId(e.target.value)} className="w-full h-10 rounded-lg border border-border-soft bg-surface pl-3 text-sm focus:bg-white focus:ring-2 focus:ring-brand-blue/20">
                    <option value="">Select a class...</option>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              )}

              {targetType === "BOARD" && (
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1.5">Select Board</label>
                  <select required value={targetId} onChange={e => setTargetId(e.target.value)} className="w-full h-10 rounded-lg border border-border-soft bg-surface pl-3 text-sm focus:bg-white focus:ring-2 focus:ring-brand-blue/20">
                    <option value="">Select a board...</option>
                    {boards.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              )}

              {targetType === "CENTRE" && (
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1.5">Select Centre</label>
                  <select required value={targetId} onChange={e => setTargetId(e.target.value)} className="w-full h-10 rounded-lg border border-border-soft bg-surface pl-3 text-sm focus:bg-white focus:ring-2 focus:ring-brand-blue/20">
                    <option value="">Select a centre...</option>
                    {centres.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              )}

              <div className="flex-1 flex flex-col min-h-[150px]">
                <div className="flex justify-between mb-1.5">
                  <label className="block text-xs font-bold text-text-secondary">Message Content</label>
                  <span className="text-[10px] text-text-muted">{message.length}/160 chars</span>
                </div>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full flex-1 rounded-lg border border-border-soft bg-surface p-3 text-sm focus:bg-white focus:ring-2 focus:ring-brand-blue/20 resize-none"
                />
              </div>

              <button
                disabled={sending}
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-brand-blue py-3 text-sm font-bold text-white shadow-sm hover:bg-brand-blue-dark transition-colors disabled:opacity-50"
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4" /> Send Message</>}
              </button>
            </form>
          </div>

          {/* Right Column: SMS Logs */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-border-soft shadow-sm overflow-hidden flex flex-col h-full">
            <div className="px-6 py-4 border-b border-border-soft flex items-center justify-between bg-surface-2">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Clock className="h-4 w-4 text-text-muted" /> Message History
              </h3>
              <div className="text-[11px] text-text-muted">Last 50 messages</div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white border-b border-border-soft shadow-sm z-10">
                  <tr>
                    <th className="text-left px-5 py-3 text-[11px] font-bold text-text-muted uppercase tracking-wider">Date & Time</th>
                    <th className="text-left px-5 py-3 text-[11px] font-bold text-text-muted uppercase tracking-wider">Recipient</th>
                    <th className="text-left px-5 py-3 text-[11px] font-bold text-text-muted uppercase tracking-wider">Message</th>
                    <th className="text-left px-5 py-3 text-[11px] font-bold text-text-muted uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-soft">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-20 text-center">
                        <Loader2 className="h-6 w-6 animate-spin text-brand-blue mx-auto" />
                      </td>
                    </tr>
                  ) : logs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-16 text-center text-sm text-text-muted">
                        No SMS logs found.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="hover:bg-surface-2/30 transition-colors">
                        <td className="px-5 py-4 whitespace-nowrap">
                          <p className="text-xs font-bold text-text-primary" suppressHydrationWarning>
                            {new Date(log.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-[10px] text-text-muted" suppressHydrationWarning>
                            {new Date(log.createdAt).toLocaleTimeString()}
                          </p>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <p className="font-bold text-text-primary text-xs">{log.phoneNumber}</p>
                          {log.sentBy && (
                            <p className="text-[10px] text-text-muted mt-0.5 flex items-center gap-1">
                              <Users className="h-3 w-3" /> By {log.sentBy.firstName}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-4 min-w-[200px]">
                          <p className="text-xs text-text-secondary line-clamp-2">{log.message}</p>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            {getStatusIcon(log.status)}
                            <span className="text-[11px] font-bold text-text-secondary">{log.status}</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </PageShell>
    </DashboardLayout>
  );
}
