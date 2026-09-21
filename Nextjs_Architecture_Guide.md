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

---

## 7. `proxy.ts` - Complete Explanation

### 7.1 `proxy.ts` kya hoti hai?

`proxy.ts` Next.js ki request interception file hai. Browser ki request protected page tak pohanchne se pehle Next.js is function ko chala sakta hai. Is project mein iska main kaam authentication aur route protection hai.

Is file ka kaam hai:

1. Protected page par jane wale user ki `auth-token` cookie check karna.
2. Cookie missing ho to user ko `/login` par bhejna.
3. Cookie mein JWT token ki signature aur expiry verify karna.
4. Valid token mein `companyId` missing ho to user ko `/company-info` onboarding page par bhejna.
5. Sab checks pass hon to requested page ko continue karne dena.

Next.js 16 mein is project ke setup ke mutabiq file ka naam `proxy.ts` aur exported function ka naam `proxy` hai. Purane Next.js versions mein isi concept ke liye aksar `middleware.ts` aur `middleware` function use hota tha. Is project mein dono files rakhne ki zaroorat nahi hai. Active implementation `proxy.ts` hai aur purani `middleware.ts` remove ki ja chuki hai.

### 7.2 Imports ka matlab

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
```

`NextResponse` Next.js ka response helper hai. `NextResponse.redirect(...)` user ko doosre URL par bhejta hai aur `NextResponse.next()` request ko allow karta hai.

`NextRequest` current request ka TypeScript type hai. Is se `request.cookies` aur `request.url` type-safe tareeqe se access hote hain. `import type` ka matlab hai ke yeh sirf type checking ke liye hai.

`jwtVerify` `jose` library ka function hai. Yeh token ka format, signature aur expiry check karta hai. Valid token hone par iska `payload` return hota hai.

### 7.3 `JWT_SECRET` kyun hota hai?

```ts
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_change_in_production";
```

JWT secret private value hoti hai jo token sign aur verify karne ke liye use hoti hai. Login/register APIs token banate waqt isi secret se sign karti hain aur `proxy.ts` isi secret se verify karta hai. Dono jagah secret same hona zaroori hai.

Project ke `.env.local` mein value define hai:

```env
JWT_SECRET=hrms_super_secret_key_2026_change_this_later
```

Fallback development ko crash se bachata hai, lekin production mein unsafe hai. Production deployment mein strong random `JWT_SECRET` set karein aur real secret ko source control mein commit na karein.

### 7.4 Function ka line-by-line flow

```ts
export async function proxy(request: NextRequest) {
```

`export` se Next.js function ko discover karta hai. `async` is liye hai kyunke JWT verification asynchronous hai. `request` current browser request hoti hai.

#### Cookie se token read karna

```ts
const token = request.cookies.get("auth-token")?.value;
```

Login aur register APIs `auth-token` naam ki HTTP-only cookie set karti hain. Cookie missing ho to optional chaining ki wajah se crash nahi hota, `undefined` milta hai.

#### Token missing ho

```ts
if (!token) {
  return NextResponse.redirect(new URL("/login", request.url));
}
```

User protected URL direct open kare aur login cookie na ho, to request `/login` par redirect hoti hai. `request.url` current host ko preserve karta hai.

#### JWT verify karna

```ts
const secret = new TextEncoder().encode(JWT_SECRET);
const { payload } = await jwtVerify(token, secret);
```

`TextEncoder` secret string ko bytes mein convert karta hai. `jwtVerify` invalid signature, expired token, malformed token ya wrong secret par error throw karta hai. Successful verification par `payload` mein `userId`, `email`, `role` aur optional `companyId` mil sakti hain.

#### Company onboarding check

```ts
if (!payload.companyId) {
  return NextResponse.redirect(new URL("/company-info", request.url));
}
```

Register ke baad token mein company nahi hoti. Company setup complete hone par `app/api/company/route.ts` naya token banata hai jisme `companyId` add hoti hai. Matcher sirf dashboard routes par apply hota hai, is liye `/company-info` par proxy dobara nahi chalta aur redirect loop nahi banta.

#### Request allow karna

```ts
return NextResponse.next();
```

Iska matlab hai cookie present hai, JWT valid hai, onboarding complete hai aur requested protected page render ho sakta hai.

#### Invalid token ka error

```ts
} catch (error) {
  console.error("JWT Verification failed in proxy:", error);
  return NextResponse.redirect(new URL("/login", request.url));
}
```

Expired ya tampered token login page par redirect hota hai. Current code invalid cookie delete nahi karta; future improvement ke taur par response cookie delete ki ja sakti hai.

### 7.5 `config.matcher` ka matlab

```ts
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/employees/:path*",
    "/departments/:path*",
    "/attendance/:path*",
    "/leaves/:path*",
    "/payroll/:path*",
    "/settings/:path*",
  ],
};
```

`matcher` batata hai ke proxy kin URLs par execute hoga. `:path*` route aur uske tamam nested paths ko match karta hai.

- `/dashboard` aur `/dashboard/reports` match hote hain.
- `/employees/123` match hota hai.
- `/login`, `/register`, `/company-info` aur `/api/company` match nahi hote.

Naya protected module banate waqt uska route matcher mein add karna zaroori hai. Matcher mein route na ho to us route par proxy authentication apply nahi hogi.

### 7.6 Complete request flow

```text
Browser protected URL request karta hai
        |
        v
Next.js matcher URL check karta hai
        |
        +-- match nahi karta --> request normal continue
        |
        +-- match karta hai --> auth-token cookie read
                                  |
                                  +-- missing --> /login
                                  |
                                  +-- present --> JWT verify
                                                  |
                                                  +-- invalid/expired --> /login
                                                  |
                                                  +-- valid, companyId missing --> /company-info
                                                  |
                                                  +-- valid, companyId present --> requested page
```

### 7.7 Auth files ke saath relation

1. `app/api/auth/register/route.ts` user create karke `auth-token` cookie set karta hai.
2. New user ke token mein `userId`, `email` aur `role` hota hai, lekin `companyId` nahi hoti.
3. Proxy protected route par user ko `/company-info` par bhejta hai.
4. Onboarding pages company ka data collect karti hain.
5. `app/api/company/route.ts` company create karta hai, user ko link karta hai aur `companyId` ke saath naya token set karta hai.
6. Ab proxy user ko dashboard routes allow karta hai.
7. `app/api/auth/login/route.ts` existing user ke `companyId` ke mutabiq token banata hai.

### 7.8 `proxy.ts` kya nahi karta?

Proxy page access protect karta hai, lekin complete authorization system nahi hai. Yeh database se permissions load nahi karta, admin/HR/employee ke granular permissions check nahi karta, har API route ko automatically protect nahi karta, request body validate nahi karta aur MongoDB connection nahi banata.

Sensitive API routes ko apni server-side authentication aur authorization check bhi karni chahiye. Sirf page hide karna security nahi hoti, kyunke user API URL ko direct call kar sakta hai.

### 7.9 Security rules

1. `JWT_SECRET` strong aur private rakhein.
2. Production mein fallback secret par depend na karein.
3. JWT mein password ya sensitive personal data store na karein.
4. Cookie `httpOnly` honi chahiye taa ke browser JavaScript token read na kar sake.
5. Production mein cookie `secure: true` honi chahiye taa ke woh sirf HTTPS par send ho.
6. Har sensitive API route par server-side user aur role check karein.
7. Invalid token ke case mein stale cookie delete karna useful hai.
8. Login aur onboarding URLs ko matcher se bahar rakhein taa ke redirect loop na bane.
9. `console.error` mein JWT token ya secret kabhi print na karein.

### 7.10 Common mistakes

#### Cookie name mismatch

Auth route agar `token` cookie set kare aur proxy `auth-token` read kare, to har user unauthorized ho jayega. Dono jagah exact same name hona chahiye.

#### Secret mismatch

Register/login aur proxy ke `JWT_SECRET` different hon to har token invalid hoga.

#### Matcher mein route missing

Naya protected route matcher mein add na karne par user bina proxy check ke page open kar sakta hai.

#### Onboarding route matcher mein add karna

`/company-info` ko matcher mein add karne se `companyId` missing user ko baar baar wahi route redirect ho sakta hai.

#### Sirf proxy par API security depend karna

Current matcher `/api/company` ya doosre APIs ko cover nahi karta. API handlers ko khud token verify aur authorization check karni chahiye.

### 7.11 Testing checklist

1. New browser mein `/dashboard` open karein: `/login` par jana chahiye.
2. Valid login ke baad dashboard open karein: page load hona chahiye.
3. Company setup incomplete user dashboard open kare: `/company-info` par jana chahiye.
4. Company onboarding complete karein: dashboard access milna chahiye.
5. Expired JWT ke saath protected route open karein: `/login` par redirect hona chahiye.
6. JWT ko manually change karke request karein: `/login` par redirect hona chahiye.
7. `/login`, `/register` aur `/company-info` open karein: redirect loop nahi hona chahiye.
8. Naye protected module ko matcher mein add karke nested URL bhi test karein.

### 7.12 Short summary

`proxy.ts` application ka gatekeeper hai. Yeh protected pages ke liye pehle cookie dekhta hai, phir JWT verify karta hai, phir onboarding status check karta hai. Valid authenticated company user ko request allow hoti hai; baqi users ko login ya onboarding par redirect kiya jata hai. Is file ka scope page routing hai, is liye database APIs ko apni independent security checks phir bhi rakhni chahiye.

---

## 8. Screenshot Mein Dikhne Wali Root Files

Yeh section project ke root folder mein dikhne wali har file ka simple aur project-specific meaning batata hai. Root folder woh main folder hai jahan se `npm install`, `npm run dev`, `npm run build` aur `npm run lint` commands chalti hain.

### 8.1 `.env.example`

Yeh environment variables ka sample/template file hai. Ismein real password ya secret nahi hona chahiye. New developer is file ko copy karke apni local config banata hai:

```powershell
copy .env.example .env.local
```

Current values ka meaning:

- `NEXT_PUBLIC_API_URL=/api`: frontend API ka base path.
- `MONGODB_URI=mongodb://127.0.0.1:27017/hr_management`: local MongoDB database address.
- `JWT_SECRET=replace_with_a_long_random_secret`: JWT signing ke liye placeholder secret.

Is file ko Git mein rakhna theek hai, kyunke ismein sirf example values honi chahiye.

### 8.2 `.env.local`

Yeh machine-specific local environment file hai. Next.js is file ki values ko `process.env` ke through server code mein provide karta hai. Is project mein MongoDB address aur JWT secret yahan se aate hain.

`.env.local` ko share, screenshot, GitHub ya public repository mein upload nahi karna chahiye. `.gitignore` mein `.env*` ignore hai, lekin `.env.example` ko intentionally allow kiya gaya hai. Agar `.env.local` missing ho to database connection ya JWT authentication fail ho sakti hai.

### 8.3 `.gitignore`

`.gitignore` Git ko batati hai ke kaunse files/folders version control mein add nahi karne. Is project mein yeh important cheezein ignore hoti hain:

- `node_modules`: installed packages; bahut bada hota hai.
- `.next`, `out`, `build`: generated Next.js output.
- `.env*`: local secrets aur environment values.
- `*.tsbuildinfo`: TypeScript build cache.
- logs, coverage aur Vercel local files.

Iska purpose repository ko clean, secure aur small rakhna hai.

### 8.4 `AGENTS.md`

Yeh developer/AI agent instructions file hai, application runtime ka part nahi. Is repo mein yeh Next.js 16 ke special rules batati hai, khaas taur par `proxy.ts` convention aur installed Next.js documentation ko code likhne se pehle check karne ka rule.

Iska content browser user ko nahi dikhai deta aur production bundle mein app feature ke taur par use nahi hota.

### 8.5 `CLAUDE.md`

Current file mein sirf:

```text
@AGENTS.md
```

Iska matlab hai ke Claude/AI tooling ke liye bhi `AGENTS.md` ki instructions apply hoti hain. Yeh bhi developer guidance hai, HRMS application logic nahi.

### 8.6 `eslint.config.mjs`

ESLint code quality aur common mistakes check karne ka configuration file hai. Is project mein Next.js Core Web Vitals aur TypeScript rules load ho rahe hain.

Command:

```bash
npm run lint
```

Ismein `.next`, `out`, `build` aur `next-env.d.ts` ko lint se ignore kiya gaya hai. ESLint errors code ko automatically fix nahi karta jab tak fix command explicitly na chalai jaye.

`.mjs` ka matlab modern JavaScript module file hai. Ismein `import`/`export` syntax use hota hai.

### 8.7 `next-env.d.ts`

Yeh Next.js ki generated TypeScript declaration file hai. Ismein Next.js ke types TypeScript project ke liye available hote hain. Is file ko normally manually edit nahi karna chahiye; Next.js isey generate/update karta hai.

Yeh `.gitignore` mein listed hai, is liye har machine par `next dev` ya build ke waqt regenerate ho sakti hai.

### 8.8 `next.config.ts`

Yeh Next.js framework configuration file hai. Current project mein iska main visible kaam external images ke domains allow karna hai:

- `i.pravatar.cc`: avatar images.
- `images.unsplash.com`: login/team image.

Next.js ka `<Image>` component security aur optimization ke liye har external host ko automatically allow nahi karta. Isliye host ko `remotePatterns` mein define karna padta hai. Agar naya external image domain use karein to yahan add karna hoga.

### 8.9 `Nextjs_Architecture_Guide.md`

Yeh project ki architecture documentation hai. Ismein App Router, route groups, server/client components, API routes, Redux, `proxy.ts` aur root files ka explanation hai.

`.md` Markdown documentation file hoti hai. Iska code execution par direct effect nahi hota, lekin new developer ko project samajhne mein help milti hai.

### 8.10 `package.json`

Yeh Node.js project ka central manifest hai. Ismein project name, scripts aur packages define hote hain.

#### Scripts

- `npm run dev`: development server start karta hai.
- `npm run build`: production build aur TypeScript checks chalata hai.
- `npm run start`: already-built production app start karta hai.
- `npm run lint`: ESLint checks chalata hai.

#### Dependencies

Runtime packages app ko chalane ke liye chahiye, jaise Next.js, React, Mongoose, Jose, Redux, AG Grid, Recharts aur Zod.

#### Dev dependencies

Development/build tools hain, jaise TypeScript, ESLint, Next ESLint config aur React/Node type packages.

### 8.11 `package-lock.json`

Yeh npm ka exact dependency lock file hai. `package.json` broad version range batata hai, jabke `package-lock.json` exact installed versions aur dependency tree record karta hai.

Iski wajah se team members aur deployment server par same package versions install hote hain. Is file ko manually edit nahi karna chahiye. Package change karne ke liye `npm install package-name` use karein, jo lock file automatically update karega.

### 8.12 `postcss.config.mjs`

PostCSS CSS processing pipeline ka configuration hai. Current project mein Tailwind CSS v4 ka PostCSS plugin enabled hai:

```js
plugins: {
  "@tailwindcss/postcss": {},
}
```

Jab CSS build hoti hai to Next.js PostCSS ke through Tailwind classes/processors apply karta hai. Is file ko tab change karein jab PostCSS plugin ya CSS processing setup change karna ho.

### 8.13 `PROJECT_FLOW.md`

Yeh project ka functional/business flow document hai. Ismein login, register, onboarding, dashboard aur modules ka user journey describe hota hai.

Architecture guide technical structure explain karti hai; `PROJECT_FLOW.md` application user ka workflow explain karti hai. Dono documentation files hain aur browser bundle ka hissa nahi.

### 8.14 `proxy.ts`

Yeh active request protection file hai. Is project mein yeh:

1. Protected routes par `auth-token` cookie read karti hai.
2. Missing cookie ko `/login` redirect karti hai.
3. JWT signature/expiry verify karti hai.
4. Missing `companyId` ko `/company-info` redirect karti hai.
5. Valid company user ko protected page allow karti hai.

Iski complete line-by-line explanation is guide ke Section 7 mein hai. `middleware.ts` ka old duplicate version remove kar diya gaya hai, isliye authentication ka active source `proxy.ts` hai.

### 8.15 `README.md`

Yeh project ka first-entry documentation file hai. Ismein quick start, folder structure, common commands aur Next.js learning/deployment links hain.

New developer ko sabse pehle README read karni chahiye, phir detailed technical understanding ke liye `Nextjs_Architecture_Guide.md` aur business flow ke liye `PROJECT_FLOW.md` read karni chahiye.

### 8.16 `tsconfig.json`

Yeh TypeScript compiler configuration hai. Current important settings:

- `strict: true`: strong type checking.
- `noEmit: true`: TypeScript JavaScript files generate nahi karta; Next.js bundling karta hai.
- `jsx: react-jsx`: React JSX transform.
- `moduleResolution: bundler`: modern package resolution.
- `incremental: true`: faster repeated type checks.
- `paths: { "@/*": ["./*"] }`: `@/components/...` jaise absolute imports.
- `plugins: [{ "name": "next" }]`: Next.js TypeScript integration.

`include` batata hai ke kaunse `.ts`/`.tsx` files check honge aur `exclude` `node_modules` ko bahar rakhta hai.

### 8.17 `tsconfig.tsbuildinfo`

Yeh TypeScript ka generated incremental build cache hai. Ismein previous type-check information hoti hai taa ke next check faster chale.

Is file ko manually edit ya explain karne ki zaroorat nahi hoti. Yeh source code nahi hai, isliye `.gitignore` mein `*.tsbuildinfo` ke through ignore ki jati hai. Delete hone par TypeScript/Next.js isey dobara bana dete hain.

### 8.18 Files ka simple relationship

```text
.env.example  -->  template
                     |
                     v
.env.local    -->  local database/JWT settings

package.json  -->  commands and packages
package-lock.json --> exact package versions

next.config.ts   --> Next.js settings
tsconfig.json    --> TypeScript settings
eslint.config.mjs --> code quality checks
postcss.config.mjs --> CSS/Tailwind processing

proxy.ts        --> protected page access
app/            --> pages, layouts and API routes
components/     --> reusable UI
features/       --> domain state and API logic
server/         --> database, models and server auth

README.md / Nextjs_Architecture_Guide.md / PROJECT_FLOW.md
                --> project documentation
```

### 8.19 Kaunsi files manually edit karni chahiye?

Normally manually edit karein:

- `package.json` jab scripts/packages change karne hon.
- `next.config.ts` jab Next.js settings change karni hon.
- `tsconfig.json` jab TypeScript rules/aliases change karne hon.
- `eslint.config.mjs` jab lint rules change karne hon.
- `postcss.config.mjs` jab CSS plugins change karne hon.
- `proxy.ts` jab route protection logic change karni ho.
- Documentation files jab project knowledge update karni ho.

Normally manually edit na karein:

- `package-lock.json`: npm automatically update karta hai.
- `next-env.d.ts`: Next.js generate karta hai.
- `tsconfig.tsbuildinfo`: TypeScript generate karta hai.
- `.env.local`: edit kar sakte hain, lekin secret public/share nahi karna.

### 8.20 Root folder ka short summary

Root files application ke foundation aur rules define karti hain. `package.json` batata hai app kaise run hogi, config files tools ko batati hain ke code/CSS/images kaise process karne hain, `.env.local` private runtime settings deta hai, `proxy.ts` protected routes guard karta hai, aur Markdown files developer ko project samjhati hain. Actual screens aur business features `app/`, `components/`, `features/`, `server/` aur related folders ke andar hain.

---

## 9. Directory Section - Screenshot Implementation

### 9.1 Kya banaya gaya hai?

Employees module ko do separate views mein divide kiya gaya hai. `/employees` Manage Employees table hai aur `/employees/directory` screenshot-style Directory cards hain.

Directory route par:

- `Directory` heading aur short description show hoti hai.
- Search input employee name, job title ya email se filter karta hai.
- Employees responsive cards mein show hote hain.
- Desktop par 4 cards per row hain.
- Tablet par 2 cards per row aur mobile par 1 card per row hota hai.
- Har card mein avatar, employee name, job title, email aur phone hota hai.
- Search result na mile to `No employees found.` message show hota hai.

### 9.2 Kaunsi files create hui hain?

#### `features/employees/directoryData.ts`

Yeh temporary hardcoded data file hai. Ismein `DirectoryEmployee` interface aur `directoryEmployees` array defined hai. Har employee object mein yeh fields hain:

- `id`
- `name`
- `jobTitle`
- `email`
- `phone`
- `avatarUrl`

Filhal data MongoDB/API se nahi aa raha. Screenshot-style preview ke liye 12 sample employees manually rakhe gaye hain. Baad mein isi file ko API response se replace kiya ja sakta hai.

#### `components/employees/EmployeeDirectory.tsx`

Yeh reusable card-grid component hai. Iska kaam sirf employees receive karke cards render karna hai. Ismein:

- responsive Tailwind grid;
- existing `Avatar` component;
- Lucide `Mail` aur `Phone` icons;
- card borders, spacing, hover shadow;
- truncated long email handling;
- typed `DirectoryEmployee[]` props

use hote hain.

### 9.3 Kaunsi existing file change hui hai?

#### `app/(dashboard)/employees/page.tsx`

Yeh Manage Employees ka detailed API-backed AG Grid table render karta hai. Ab page:

1. Employees API se data fetch karta hai.
2. Search, office, job title aur status filters provide karta hai.
3. Detailed employee columns aur account/status badges show karta hai.
4. Pagination provide karta hai.
5. Existing `EmployeeForm` ko preserve karta hai taa ke Add New flow connect rahe.

#### `app/(dashboard)/employees/directory/page.tsx`

Yeh Sidebar ke `Directory` link `/employees/directory` ka dedicated route hai. Is file ki zaroorat isliye hai kyunke agar yeh route file na ho to Next.js is URL ko dynamic `[id]` route samajh sakta hai aur `directory` ko employee ID samajh kar detail page show kar sakta hai. Ab yeh page directly Directory card grid render karta hai.

### 9.4 Filhal data hardcoded hai?

Haan. Filhal Directory cards ka data hardcoded hai aur `features/employees/directoryData.ts` mein rakha gaya hai. Iska faida yeh hai ke UI/API ke bina bhi complete design visible aur testable hai.

Current hardcoded data production data nahi hai. Real employees show karne ke liye baad mein:

1. `directoryData.ts` ki jagah `useGetEmployeesQuery` ya server-side fetch use hoga.
2. API response ko `DirectoryEmployee` shape mein map kiya jayega.
3. `avatarUrl`, `name`, `jobTitle`, `email` aur `phone` database fields se aayenge.
4. Search filtering server-side ya RTK Query parameters ke through move ki ja sakti hai.

Card component ko API se direct couple nahi kiya gaya, isliye future data source change mein `EmployeeDirectory.tsx` ko change karne ki zaroorat nahi honi chahiye.

### 9.5 Existing files jo abhi use nahi ho rahi hain

Directory ke saath detailed table flow in files mein use ho raha hai:

- `components/employees/EmployeeDataGrid.tsx`
- `components/employees/EmployeeFilterBar.tsx`
- `components/employees/EmployeePageHeader.tsx`
- `features/employees/employeesApi.ts`
- `app/api/employees/route.ts`

In files ko delete nahi kiya gaya. Directory card view aur existing data-table view alag UI modes ban sakte hain. Abhi `/employees` page card view render kar raha hai.

### 9.6 File relationship

```text
app/(dashboard)/employees/page.tsx
        |
        +--> features/employees/directoryData.ts
        |       |
        |       +--> hardcoded DirectoryEmployee[]
        |
        +--> components/employees/EmployeeDirectory.tsx
          |
          +--> components/ui/Avatar.tsx
          +--> lucide-react Mail/Phone icons

      app/(dashboard)/employees/directory/page.tsx
              |
              +--> same Directory card view for the Sidebar Directory link
```

### 9.7 Future real-data change

Jab backend connect karna ho to main change `app/(dashboard)/employees/page.tsx` mein hoga: hardcoded `directoryEmployees` import ki jagah API query use hogi. `EmployeeDirectory.tsx` same reh sakta hai jab tak API data ko required fields mein map kar diya jaye.
