"use client";

import { useState } from "react";
import { fetchApi } from "@/lib/api";
import { Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function PublicEnquiryForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    studentName: "",
    parentName: "",
    contactNumber: "",
    email: "",
    targetBoard: "",
    targetStandard: "",
    targetCourse: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetchApi("/enquiry/public", {
        method: "POST",
        body: JSON.stringify(formData)
      });
      setSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Failed to submit enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (success) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-border-soft p-10 max-w-md w-full text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Request Submitted!</h1>
          <p className="text-text-secondary mb-8">Thank you for your interest. Our team will get back to you shortly.</p>
          <button 
            onClick={() => {
              setSuccess(false);
              setFormData({ studentName: "", parentName: "", contactNumber: "", email: "", targetBoard: "", targetStandard: "", targetCourse: "" });
            }}
            className="w-full bg-brand-blue text-white rounded-xl h-12 font-bold hover:bg-brand-blue-dark transition-colors"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-border-soft p-8 max-w-lg w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary mb-2">Admission Enquiry</h1>
          <p className="text-sm text-text-secondary">Please fill out the form below and we will contact you soon.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1">Student Name *</label>
              <input required name="studentName" value={formData.studentName} onChange={handleChange} className="w-full h-11 rounded-lg border border-border-soft px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue/20" />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1">Parent/Guardian Name</label>
              <input name="parentName" value={formData.parentName} onChange={handleChange} className="w-full h-11 rounded-lg border border-border-soft px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue/20" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1">Contact Number *</label>
              <input required type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className="w-full h-11 rounded-lg border border-border-soft px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue/20" />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full h-11 rounded-lg border border-border-soft px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue/20" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1">Board</label>
              <select name="targetBoard" value={formData.targetBoard} onChange={handleChange} className="w-full h-11 rounded-lg border border-border-soft px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 bg-white">
                <option value="">Select...</option>
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
                <option value="State Board">State Board</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1">Class/Standard</label>
              <select name="targetStandard" value={formData.targetStandard} onChange={handleChange} className="w-full h-11 rounded-lg border border-border-soft px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 bg-white">
                <option value="">Select...</option>
                <option value="Class 11">Class 11</option>
                <option value="Class 12">Class 12</option>
                <option value="Dropper">Dropper</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1">Course Type</label>
              <select name="targetCourse" value={formData.targetCourse} onChange={handleChange} className="w-full h-11 rounded-lg border border-border-soft px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 bg-white">
                <option value="">Select...</option>
                <option value="Entrance (NEET/JEE)">Entrance</option>
                <option value="Tuition">Tuition</option>
                <option value="Foundation">Foundation</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-6 h-12 bg-brand-blue text-white rounded-xl font-bold flex items-center justify-center hover:bg-brand-blue-dark transition-colors disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Submit Enquiry"}
          </button>
        </form>
      </div>
    </div>
  );
}
