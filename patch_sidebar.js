const fs = require('fs');
let content = fs.readFileSync('apps/web/src/components/layout/sidebar.tsx', 'utf8');

content = content.replace(
  'import { usePathname } from "next/navigation";',
  'import { usePathname, useRouter } from "next/navigation";\nimport { fetchApi } from "@/lib/api";'
);

content = content.replace(
  'PanelLeftClose,',
  'PanelLeftClose,\n  LogOut,'
);

const logoutLogic = `
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetchApi("/auth/logout", { method: "POST" });
    } catch (e) {
      console.error(e);
    } finally {
      window.location.href = "/login";
    }
  };
`;

content = content.replace(
  'const path = usePathname();',
  'const path = usePathname();' + logoutLogic
);

const logoutButton = `
        <button onClick={handleLogout} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-medium text-white/50 hover:text-brand-red hover:bg-white/8 transition-colors mt-2">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
`;

content = content.replace(
  '      </div>\n    </aside>',
  logoutButton
);

fs.writeFileSync('apps/web/src/components/layout/sidebar.tsx', content, 'utf8');
