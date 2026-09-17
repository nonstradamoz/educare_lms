const fs = require('fs');
const file = 'apps/web/src/app/students/page.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Fix the onSave logic in StudentsPage
code = code.replace(
  `                const created = await fetchApi<any>('/students', {
                  method: 'POST',
                  body: JSON.stringify(savedStudent)
                });
                setStudents([savedStudent, ...students]);`,
  `                const created = await fetchApi<any>('/students', {
                  method: 'POST',
                  body: JSON.stringify(savedStudent)
                });
                // Map the created backend student back to frontend format
                const newProfile = created.profile;
                const newUser = created.user;
                const newBatch = created.batch;
                const newStudentFromDb = {
                  ...savedStudent,
                  id: newProfile.id,
                  admissionNo: newProfile.admissionNo,
                  name: newUser.firstName + " " + newUser.lastName,
                  email: newUser.email,
                };
                setStudents([newStudentFromDb, ...students]);`
);

// 2. Fix AddStudentModal inputs
// Add missing state for first/last name
code = code.replace(
  `  const [name, setName] = useState(student?.name || "");`,
  `  const [firstName, setFirstName] = useState(student?.name?.split(" ")[0] || "");
  const [lastName, setLastName] = useState(student?.name?.split(" ").slice(1).join(" ") || "");`
);

// Fix the newStudentData in onSave
code = code.replace(
  `                    name: student?.name || "New Student",`,
  `                    name: \`\${firstName} \${lastName}\`.trim() || "New Student",`
);

// Fix the inputs in Basic Information tab
code = code.replace(
  `defaultValue={student?.name.split(" ")[0] || ""} className="w-full h-10 rounded-lg border border-border-soft bg-surface-2 px-3 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20" />`,
  `value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full h-10 rounded-lg border border-border-soft bg-surface-2 px-3 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20" />`
);

code = code.replace(
  `defaultValue={student?.name.split(" ").slice(1).join(" ") || ""} className="w-full h-10 rounded-lg border border-border-soft bg-surface-2 px-3 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20" />`,
  `value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full h-10 rounded-lg border border-border-soft bg-surface-2 px-3 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20" />`
);

code = code.replace(
  `placeholder="+91 XXXXX XXXXX" className="w-full h-10 rounded-lg border border-border-soft bg-surface-2 px-3 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20" />`,
  `value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" className="w-full h-10 rounded-lg border border-border-soft bg-surface-2 px-3 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20" />`
);

code = code.replace(
  `placeholder="student@example.com" className="w-full h-10 rounded-lg border border-border-soft bg-surface-2 px-3 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20" />`,
  `value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@example.com" className="w-full h-10 rounded-lg border border-border-soft bg-surface-2 px-3 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20" />`
);

// Parents Login Details Tab
code = code.replace(
  `placeholder="Name" className="w-full h-10 rounded-lg border border-border-soft bg-surface-2 px-3 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20" />`,
  `value={parentName} onChange={(e) => setParentName(e.target.value)} placeholder="Name" className="w-full h-10 rounded-lg border border-border-soft bg-surface-2 px-3 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20" />`
);

// Actually, parent email and parent phone also need fixing. Since there are multiple inputs that share the same class and structure, it's safer to target the exact labels.
// Let's do it via regex
code = code.replace(/<label[^>]*>Parent's Primary Phone.*?<\/label>\s*<input[^>]*className="(.*?)" \/>/g, '<label className="block text-xs font-bold text-text-secondary mb-1.5">Parent\\'s Primary Phone (Login ID) <span className="text-brand-red">*</span></label>\n                  <input type="tel" value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" className="$1" />');

code = code.replace(/<label[^>]*>Parent's Email<\/label>\s*<input[^>]*className="(.*?)" \/>/g, '<label className="block text-xs font-bold text-text-secondary mb-1.5">Parent\\'s Email</label>\n                  <input type="email" value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} placeholder="parent@example.com" className="$1" />');

code = code.replace(/<label[^>]*>Admission No.*?<\/label>\s*<div className="relative">\s*<input type="text" defaultValue=\{student\?.admissionNo \|\| "74"\} className="(.*?)" \/>/g, '<label className="block text-xs font-bold text-text-secondary mb-1.5">\n                  Admission No <span className="text-brand-red">*</span>\n                </label>\n                <div className="relative">\n                  <input type="text" value={admissionNo} onChange={(e) => setAdmissionNo(e.target.value)} className="$1" />');

fs.writeFileSync(file, code);
