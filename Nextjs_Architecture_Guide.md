# Next.js Architecture in HR Management System

Yeh guide aapko detail mein samjhayegi ke is HR Management System mein Next.js (App Router) kaise kaam kar raha hai aur kaunsi techniques kahan aur kyun use ki gayi hain.

---

## 1. App Router (The `app/` Directory)

Is project mein Next.js ka latest **App Router** use kiya gaya hai. Isme file-system based routing hoti hai, jiska matlab hai ke folders aapke URLs define karte hain.

### Key Files in App Router:
- `page.tsx`: Yeh actual UI hoti hai jo screen par render hoti hai.
- `layout.tsx`: Yeh ek wrapper hota hai jo multiple pages ke darmiyan share hota hai (jaise Header, Sidebar).
- `loading.tsx`: Yeh suspense fallback hota hai jo loading ke waqt dikhta hai.
- `error.tsx`: Agar kisi page mein crash aaye, toh yeh UI show hoti hai.

**Code Example (`app/layout.tsx`):**
```tsx
import { StoreProvider } from "@/store/provider";
import "./globals.css";

// Yeh main layout hai jo puri app ke gird lapeta gaya hai
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Redux Provider ko yahan rakha gaya hai taa k puri app mein state access ho sake */}
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
```

---

## 2. Route Groups: `(auth)`, `(dashboard)`, `(onboarding)`

Aapne note kiya hoga ke `app` folder ke andar kuch folders ke naam brackets `()` mein hain (e.g., `(auth)`). Isey **Route Groups** kehte hain.

**Kyun use hote hain?**
Agar aap folder ko `(auth)` naam dete hain, toh yeh URL mein shamil nahi hota. 
Misal ke tor par: `app/(auth)/login/page.tsx` ka URL `localhost:3000/login` hoga, **na ke** `localhost:3000/(auth)/login`.

**Is project mein implementation:**
- **`(auth)`**: Isme Login aur Register pages hain. Inka apna alag layout hai jisme sidebar nahi hota.
- **`(dashboard)`**: Isme andar ke saare pages hain (Employees, Payroll, Time Off). In sab pages ke liye ek common `layout.tsx` hai jisme Sidebar aur Top Navbar maujood hain.
- **`(onboarding)`**: Isme company setup ke 4 steps hain (`/company-info`, `/workspace-setup` etc).

---

## 3. Server Components vs Client Components

Next.js App Router mein by default har component **Server Component** hota hai. Lekin jahan user interaction zaroori ho (onClick, hooks, states), wahan humein **Client Component** banana parta hai.

### Server Components (Default)
Inme `console.log` terminal (backend) par print hota hai browser mein nahi. Yeh SEO ke liye best hote hain.
**Example:** `app/(dashboard)/dashboard/page.tsx` ek Server Component hai jo initial layout jaldi load karta hai.

### Client Components (`"use client"`)
Jab humein React ke hooks (jaise `useState`, `useRouter`, `useMemo`) ya third-party interactive libraries (jaise AG Grid ya Redux) use karni hoti hain toh file ke top par `"use client"` likhna parta hai.

**Code Example (`app/(auth)/login/page.tsx`):**
```tsx
"use client"; // Is directive se Next.js ko pata chalta hai ke yeh browser par chalega

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    router.push("/dashboard"); // Client-side routing ke liye useRouter use kiya hai
  };

  // ... form UI
}
```

---

## 4. API Routes (`app/api/`)

Next.js full-stack framework hai, isliye hum isme backend (Node.js) bhi likh sakte hain. Is project mein aapke paas `app/api/` ka folder hai jisme backend ki routes hain.

**Implementation:**
- `app/api/employees/route.ts`
- `app/api/dashboard/route.ts`

Agar aap yahan `export async function GET(request) { ... }` likhte hain, toh frontend se hum `/api/employees` par `fetch` ya `RTK Query` maar kar data MongoDB se la sakte hain.

---

## 5. Middleware (`proxy.ts` / `middleware.ts`)

Middleware Next.js ki ek bohot powerfull feature hai jo request server tak pohnchne se pehle hi usay intercept kar leti hai. Is project mein humne iska naam `proxy.ts` rakha hai (kyunke latest canary build mein yeh update aayi thi).

**Kyun use hota hai?**
Route Protection ke liye! Agar user logged in nahi hai aur wo `/dashboard` likh kar jana chahta hai, toh middleware usey wapis `/login` par bhej dega.

**Code Example (`proxy.ts`):**
```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(_request: NextRequest) { 
    // Yahan hum check karte hain ke user ke paas token hai ya nahi
    // Agar token na ho toh: return NextResponse.redirect(new URL('/login', request.url))
    return NextResponse.next(); 
}

// Matcher batata hai ke kaun kaunse URLs par yeh middleware chalna chahiye
export const config = { 
    matcher: ["/dashboard/:path*", "/employees/:path*", "/settings/:path*"] 
};
```

---

## 6. Redux ToolKit & RTK Query (Data Fetching)

Next.js mein data fetch karne ke 2 tareeqay hotay hain: Server-side `fetch` aur Client-side. 
Kyunke HR system mein charts aur table (AG Grid) directly frontend interact karte hain, isliye is project mein **Redux RTK Query** use ki gayi hai Client-side data fetching ke liye.

**Implementation:**
1. `features/dashboard/dashboardApi.ts` mein humne API endpoints define kiye hain.
2. `components/dashboard/EmployeeTableCard.tsx` mein humne us API ka hook use kiya hai:
   ```tsx
   "use client";
   import { useGetEmployeeSummaryQuery } from "@/features/dashboard/dashboardApi";

   export function EmployeeTableCard() {
     // Yeh hook automatic /api/dashboard se data layega, caching karega, aur loading state handle karega
     const { data: apiData, isLoading } = useGetEmployeeSummaryQuery({});
     
     // ... render UI
   }
   ```

---

## Overall Flow of the Project:

1. **Visit App:** User jab app kholta hai toh URL ke hisab se `app/` folder mein route match hota hai.
2. **Auth Check:** Middleware (`proxy.ts`) check karta hai user logged in hai ya nahi. Agar protected page hai toh authentication hoti hai.
3. **Layout Rendering:** Agar `/dashboard` hai toh `(dashboard)/layout.tsx` chalega, jisme Sidebar components load honge.
4. **Page Rendering:** Phir `(dashboard)/dashboard/page.tsx` Server par render hoga.
5. **Data Fetching:** Page ke andar Client Components (`EmployeeTableCard`) load honge jo Redux (`useGetEmployeeSummaryQuery`) use kar ke `app/api/...` se data MongoDB se le kar aayenge.
6. **Interaction:** User jo bhi clicks karega (e.g. Next page in AG Grid), wo Next.js ke client components aur Redux ke through state update karega bina page reload kiye (Single Page App experience).
