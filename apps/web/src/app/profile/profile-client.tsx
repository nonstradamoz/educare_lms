"use client";

import { useState, useEffect } from "react";
import { User, Mail, Shield, CheckCircle2, Lock, Save, Camera, LogOut } from "lucide-react";
import { fetchApi } from "@/lib/api";

export function ProfileClient() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchApi("/users/me")
      .then(data => {
        setProfile(data);
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          password: "",
        });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const updated = await fetchApi("/users/me", {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      setProfile(updated);
      setFormData(prev => ({ ...prev, password: "" })); // clear password field
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to update profile" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="flex items-center gap-2 text-text-muted">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-blue border-r-transparent" />
          <span className="text-sm font-bold">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!profile) return <div>Failed to load profile.</div>;

  const isStudent = profile.role?.name === "STUDENT";
  const isTeacher = profile.role?.name === "TEACHER";
  
  let roleLabel = "Administrator";
  if (isStudent) roleLabel = "Student";
  if (isTeacher) roleLabel = "Teacher";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header section with Avatar */}
      <div className="bg-white rounded-xl border border-border-soft p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center">
        <div className="relative group shrink-0">
          <div className="h-24 w-24 rounded-2xl bg-brand-blue/10 flex items-center justify-center border border-brand-blue/20 overflow-hidden">
            <span className="text-3xl font-bold text-brand-blue uppercase">
              {profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}
            </span>
          </div>
          <button className="absolute -bottom-2 -right-2 h-8 w-8 bg-white border border-border-soft rounded-full flex items-center justify-center text-text-secondary shadow-sm hover:text-brand-blue transition-colors">
            <Camera className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-text-primary">
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="text-sm text-text-secondary mt-1 flex items-center gap-2">
            <Shield className="h-4 w-4 text-brand-blue" />
            {roleLabel} ({profile.role?.name})
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-100 text-xs font-bold">
              <CheckCircle2 className="h-3.5 w-3.5" /> Active Account
            </span>
            {profile.userCentres?.map((uc: any) => (
              <span key={uc.centreId} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-2 text-text-secondary border border-border-soft text-xs font-medium">
                {uc.centre?.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col - Forms */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-border-soft p-6">
            <h2 className="text-sm font-bold text-text-primary mb-5 flex items-center gap-2">
              <User className="h-4 w-4 text-brand-blue" />
              Basic Details
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1.5">First Name</label>
                <input 
                  type="text" 
                  value={formData.firstName}
                  onChange={e => setFormData({...formData, firstName: e.target.value})}
                  className="w-full h-10 rounded-lg border border-border-soft bg-surface-2 px-3 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1.5">Last Name</label>
                <input 
                  type="text" 
                  value={formData.lastName}
                  onChange={e => setFormData({...formData, lastName: e.target.value})}
                  className="w-full h-10 rounded-lg border border-border-soft bg-surface-2 px-3 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20" 
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-text-secondary mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full h-10 rounded-lg border border-border-soft bg-surface-2 pl-10 pr-3 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20" 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border-soft p-6">
            <h2 className="text-sm font-bold text-text-primary mb-5 flex items-center gap-2">
              <Lock className="h-4 w-4 text-brand-blue" />
              Security & Password
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1.5">New Password</label>
                <input 
                  type="password" 
                  placeholder="Leave blank to keep current password"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full h-10 rounded-lg border border-border-soft bg-surface-2 px-3 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20" 
                />
              </div>
              <p className="text-xs text-text-muted">
                If you change your password, you will be required to log in again on other devices.
              </p>
            </div>
          </div>

          {message.text && (
            <div className={`p-4 rounded-xl text-sm font-bold ${message.type === 'error' ? 'bg-brand-red/10 text-brand-red' : 'bg-green-50 text-green-700'}`}>
              {message.text}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button className="px-5 py-2.5 rounded-xl border border-border-soft text-text-secondary text-sm font-bold hover:bg-surface-2 transition-colors">
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-text-primary hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-sm"
            >
              {saving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" /> : <Save className="h-4 w-4" />}
              Save Changes
            </button>
          </div>
        </div>

        {/* Right Col - Read Only Info */}
        <div className="space-y-6">
          {(isStudent || isTeacher) && (
            <div className="bg-white rounded-xl border border-border-soft p-6">
              <h2 className="text-sm font-bold text-text-primary mb-4 border-b border-border-soft pb-3">
                Role Information
              </h2>
              
              <div className="space-y-4">
                {isStudent && profile.studentProfile && (
                  <>
                    <div>
                      <p className="text-xs text-text-muted mb-1">Admission Number</p>
                      <p className="text-sm font-bold text-text-primary">{profile.studentProfile.admissionNo}</p>
                    </div>
                    {profile.studentProfile.enrollments?.map((e: any) => (
                      <div key={e.id}>
                        <p className="text-xs text-text-muted mb-1">Enrolled Batch</p>
                        <p className="text-sm font-bold text-text-primary bg-surface-2 px-3 py-2 rounded-lg inline-block border border-border-soft">
                          {e.batch?.standard?.name} - {e.batch?.course?.name} ({e.batch?.name})
                        </p>
                      </div>
                    ))}
                  </>
                )}

                {isTeacher && profile.teacherProfile && (
                  <>
                    <div>
                      <p className="text-xs text-text-muted mb-1">Qualification</p>
                      <p className="text-sm font-bold text-text-primary">{profile.teacherProfile.qualification || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted mb-1">Experience</p>
                      <p className="text-sm font-bold text-text-primary">{profile.teacherProfile.experience} Years</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-border-soft p-6">
            <h2 className="text-sm font-bold text-text-primary mb-4 border-b border-border-soft pb-3">
              Device Sessions
            </h2>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">Current Session</p>
                  <p className="text-[11px] text-text-muted">Mac OS • Safari</p>
                </div>
              </div>
            </div>
            
            <button className="w-full flex items-center justify-center gap-2 text-brand-red text-sm font-bold p-2.5 rounded-lg border border-brand-red/20 bg-brand-red/5 hover:bg-brand-red/10 transition-colors mt-2">
              <LogOut className="h-4 w-4" />
              Sign out other devices
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
