const fs = require('fs');
const path = 'apps/web/src/app/estudy/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add Play and ExternalLink to imports
content = content.replace(
  /Upload } from "lucide-react";/,
  'Upload, Play, ExternalLink } from "lucide-react";'
);

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

fs.writeFileSync(path, content, 'utf8');
