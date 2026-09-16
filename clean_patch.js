const fs = require('fs');
const path = 'apps/web/src/app/estudy/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Imports
content = content.replace(/"use client";\n/, `"use client";\n\nimport { useEffect } from "react";\nimport { fetchApi } from "@/lib/api";\n`);
content = content.replace(/Upload \} from "lucide-react";/, `Upload, Play, ExternalLink } from "lucide-react";`);

// 2. State & effect
const effectCode = `  useEffect(() => {
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
        setMaterials(mapped.length > 0 ? mapped : SAMPLE_MATERIALS);
      })
      .catch(console.error);
  }, []);
`;
content = content.replace(/  const \[showModal, setShowModal\] = useState\(false\);\n/, `  const [showModal, setShowModal] = useState(false);\n\n${effectCode}`);

// 3. Update table play button
const oldButton = `<button className="inline-flex items-center gap-1.5 text-brand-blue hover:text-brand-blue-dark text-xs font-bold transition-colors">
                          <Download className="h-3.5 w-3.5" /> {m.type === "Link" ? "Open" : "Download"}
                        </button>`;
const newButton = `<button 
                          onClick={() => {
                            if (m.type === "Video" && m.url) {
                              window.open(\`https://customer-\${process.env.NEXT_PUBLIC_CLOUDFLARE_CUSTOMER_CODE || "your-code"}.cloudflarestream.com/\${m.url}/iframe\`, '_blank');
                            } else if (m.type === "Link" && m.url) {
                              window.open(m.url, '_blank');
                            }
                          }}
                          className="inline-flex items-center gap-1.5 text-brand-blue hover:text-brand-blue-dark text-xs font-bold transition-colors">
                          {m.type === "Video" ? <><Play className="h-3.5 w-3.5" /> Play</> : m.type === "Link" ? <><ExternalLink className="h-3.5 w-3.5" /> Open</> : <><Download className="h-3.5 w-3.5" /> Download</>}
                        </button>`;
content = content.replace(oldButton, newButton);

// 4. Update modal instantiation
content = content.replace(/\{showModal && <AddMaterialModal onClose=\{\(\) => setShowModal\(false\)\} \/>\}/, `{showModal && <AddMaterialModal onClose={() => setShowModal(false)} onSuccess={() => window.location.reload()} />}`);

// 5. Replace AddMaterialModal entirely
const newModalCode = `function AddMaterialModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Video Lesson");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSave = async () => {
    if (!title) return alert("Please enter a title");
    
    setUploading(true);
    let finalUrl = "";

    try {
      if (type === "Video Lesson" && file) {
        const { uploadURL, uid } = await fetchApi<any>('/cloudflare/upload-url', { method: 'POST' });
        
        const formData = new FormData();
        formData.append("file", file);
        
        await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", uploadURL, true);
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              setProgress(Math.round((e.loaded / e.total) * 100));
            }
          };
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.responseText);
            else reject(new Error("Upload failed"));
          };
          xhr.onerror = () => reject(new Error("Network error"));
          xhr.send(formData);
        });

        finalUrl = uid;
      }

      await fetchApi('/estudy', {
        method: 'POST',
        body: JSON.stringify({
          title,
          type: type === "Video Lesson" ? "VIDEO" : "PDF",
          url: finalUrl
        })
      });

      onSuccess();
      onClose();
    } catch (e: any) {
      console.error(e);
      alert("Error uploading material");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-full overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-soft shrink-0">
          <h2 className="text-base font-bold text-text-primary">Add Study Material</h2>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-surface-2 flex items-center justify-center text-text-muted hover:bg-surface-3 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 bg-surface">
          <div className="bg-white rounded-xl border border-border-soft p-6 space-y-6">
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1.5">Material Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Thermodynamics Video" className="w-full h-10 rounded-lg border border-border-soft bg-surface-2 pl-3 pr-8 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20" />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1.5">Material Type</label>
              <div className="grid grid-cols-3 gap-3">
                {["PDF Document", "Video Lesson", "External Link"].map(t => (
                  <label key={t} className={\`flex items-center justify-center gap-2 rounded-lg border py-3 px-2 cursor-pointer transition-colors \${type === t ? 'border-brand-blue bg-brand-blue/5' : 'border-border-soft bg-surface-2'}\`}>
                    <input type="radio" name="materialType" checked={type === t} onChange={() => setType(t)} className="hidden" />
                    <span className={\`text-xs font-bold \${type === t ? 'text-brand-blue' : 'text-text-primary'}\`}>{t}</span>
                  </label>
                ))}
              </div>
            </div>
            {type === "Video Lesson" && (
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1.5">Upload Video</label>
                <div className="border-2 border-dashed border-border-soft rounded-xl p-8 flex flex-col items-center justify-center bg-surface-2/50 relative">
                  <input type="file" accept="video/*" onChange={(e) => e.target.files && setFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <Upload className="h-6 w-6 text-brand-blue mb-2" />
                  <p className="text-sm font-bold text-text-primary">{file ? file.name : "Click to select video"}</p>
                </div>
              </div>
            )}
            {uploading && (
              <div className="w-full bg-surface-2 rounded-full h-2.5 mt-2 overflow-hidden">
                <div className="bg-brand-blue h-2.5 rounded-full transition-all duration-300" style={{ width: \`\${progress}%\` }}></div>
              </div>
            )}
          </div>
        </div>
        <div className="px-6 py-4 border-t border-border-soft flex items-center justify-end gap-4 shrink-0 bg-white">
          <button onClick={onClose} disabled={uploading} className="text-sm font-bold text-text-secondary">Cancel</button>
          <button onClick={handleSave} disabled={uploading} className="inline-flex items-center gap-2 rounded-lg bg-text-primary px-6 py-2.5 text-sm font-bold text-white">
            {uploading ? \`Uploading \${progress}%\` : "Save Material"}
          </button>
        </div>
      </div>
    </div>
  );
}`;

const idx = content.indexOf('function AddMaterialModal');
content = content.substring(0, idx) + newModalCode;

fs.writeFileSync(path, content, 'utf8');
