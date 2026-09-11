# HRMS Project Flow - Roman Urdu Guide

Ye file sirf samajhne ke liye documentation hai. Is file ko add karne se project ke code, screen design, routing ya database behavior par koi asar nahi parta.

Is guide mein har jagah file path clickable hai. Path par click karne se VS Code mein woh file open ho jayegi.

## Sab se pehle: Next.js ka simple rule

Is project mein `app` folder ke andar `page.tsx` screen hoti hai.

```text
app/(auth)/login/page.tsx          -> browser mein /login
app/(dashboard)/employees/page.tsx -> browser mein /employees
```

`(auth)`, `(dashboard)` aur `(onboarding)` ko **route group** kehte hain. Parentheses wali folder URL mein nazar nahi aati. Ye sirf files ko organize karne ke liye hoti hai.

`page.tsx` screen banati hai. `layout.tsx` us folder ke andar aane wali multiple screens ke around common wrapper lagati hai. `route.ts` browser ki screen nahi hoti; ye backend API endpoint hoti hai.

## 1. User project open karta hai

```text
Browser: /
  -> [app/page.tsx](app/page.tsx)
  -> redirect('/login')
  -> [app/(auth)/login/page.tsx](app/(auth)/login/page.tsx)
```

### [app/page.tsx](app/page.tsx)

Is file mein koi visible dashboard ya form nahi hai. Is ka ek hi kaam hai:

```ts
redirect("/login");
```

Yani user agar website ka root address `/` kholta hai to us ko seedha login screen par bhej diya jata hai.

## 2. Root layout: har page ka outer wrapper

### [app/layout.tsx](app/layout.tsx)

Ye poori application ka root layout hai. Is mein:

- `globals.css` import hoti hai, is liye global CSS poori app par apply hoti hai.
- Page ka title `HR Management System` set hota hai.
- Page ka description set hota hai.
- `<html lang="en">` aur `<body>` create hote hain.
- `{children}` ki jagah current URL wali screen render hoti hai.

Is file mein authentication check nahi hai. Is file ka kaam sirf global wrapper aur metadata hai.

## 3. Login screen ka complete flow

### Screen file: [app/(auth)/login/page.tsx](app/(auth)/login/page.tsx)

Ye `/login` URL ki visible screen hai.

### Is screen par kya nazar aata hai?

- Desktop par left side team image.
- HRDashboard branding.
- Email Address input.
- Password input.
- Password show/hide button.
- Remember Me checkbox.
- Login button.
- Google aur Apple buttons.
- Register page ka `Create Account` link.

### Is file mein imports kya kar rahe hain?

```ts
import Link from 'next/link';
import { useState } from 'react';
```

- `next/link` ka `Link` internal navigation ke liye hai. `Create Account` par click karne se user `/register` par jata hai.
- React ka `useState` form ki temporary values rakhta hai.

### Login ke fields kahan save hote hain?

```text
email         -> email input ki current value
password      -> password input ki current value
showPassword  -> password text dikhe ya dots, ye control karta hai
```

Ye values sirf browser ke current React component memory mein hoti hain. Abhi ye Redux, database, API, cookie ya localStorage mein save nahi hotin.

### Login button press karne par kya hota hai?

Form `handleLogin` function chalata hai:

1. Browser ka default form submit roka jata hai.
2. Check hota hai ke email aur password empty to nahi.
3. Agar empty hon to alert aata hai: `Please enter your email and password.`
4. Agar dono filled hon to form fields clear ho jate hain.
5. `Login successfully!` alert show hota hai.

Important baat: current code mein login button API ko call nahi karta. Email registered hai ya nahi, password sahi hai ya nahi, ye check abhi nahi hota. Successful alert ke baad bhi current code dashboard ya company-info par redirect nahi karta.

### Login se related backend file

### [app/api/auth/login/route.ts](app/api/auth/login/route.ts)

Ye browser screen nahi hai. Is ka intended URL `/api/auth/login` hai. Future mein login page yahan email/password bhej sakti hai.

Abhi is file ka POST function sirf HTTP `501` response deta hai:

```text
Login endpoint ready for implementation.
```

Yani login page aur login API abhi connected nahi hain.

## 4. Register screen ka complete flow

### Screen file: [app/(auth)/register/page.tsx](app/(auth)/register/page.tsx)

Ye `/register` URL ki visible screen hai.

### Is screen par kya nazar aata hai?

- Full name input.
- Work email input.
- Password input.
- Password show/hide button.
- Create Account button.
- Google aur Apple buttons.
- Login page ka `Login Here` link.
- Right side dashboard preview image.

### Imports kya kar rahe hain?

```ts
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
```

- `Link` `/login` par internal navigation ke liye hai.
- `Image` register banner ko Next.js optimized image ki tarah render karta hai.
- `useState` name, email, password aur show/hide state rakhta hai.

### Register ke fields kahan save hote hain?

```text
name          -> user ka naam
email         -> user ka email
password      -> user ka password
showPassword  -> password visible hai ya hidden
```

Ye bhi sirf current page ki temporary React state hai. Abhi user database mein save nahi hota.

### Create Account press karne par kya hota hai?

1. Default browser submit roka jata hai.
2. Name, email aur password empty hain ya nahi check hota hai.
3. Empty field par validation alert aata hai.
4. Filled fields par values clear hoti hain.
5. `Account created successfully!` alert aata hai.

Current code account create nahi karta aur login page ko actual registered credentials nahi deta.

### Register se related backend file

### [app/api/auth/register/route.ts](app/api/auth/register/route.ts)

Is ka intended kaam name, email aur password receive karke user banana hai. Abhi POST function HTTP `501` placeholder response deta hai. Is liye register page bhi is API ko call nahi kar rahi.

## 5. Onboarding ka matlab kya hai?

Onboarding ka matlab hai: naya user account banane ke baad apni company aur workspace ki basic information dena, taake system us ka HR workspace tayyar kar sake.

Is project mein onboarding ko 4 steps mein divide kiya gaya hai:

```text
Step 1: /company-info
Step 2: /workspace-setup
Step 3: /role-info
Step 4: /use-case
              -> /dashboard
```

Lekin current code mein secure `register -> login -> onboarding` flow abhi complete nahi hai. Pages manually URL se khul sakte hain aur kuch steps ka data sirf memory mein rakha ja raha hai.

## 6. Onboarding Step 1: Company Info

### Screen file: [app/(onboarding)/company-info/page.tsx](app/(onboarding)/company-info/page.tsx)

Browser URL: `/company-info`

### Is screen ka matlab

Ye user se company ki basic information mangti hai:

- Company Name
- Company Domain name
- Company size

Company domain se future mein company ka unique URL banane ka idea hai, jaise `yourcompany.hrline.com`.

### Is file mein state

```text
selectedSize  -> default "1-10"
companyName   -> company name input
 domain        -> domain input
```

Ye values abhi local `useState` mein hain. Screen par Continue button form ko submit karne ki koshish karta hai, lekin form par `onSubmit` handler nahi laga. Is liye current code mein Continue press karne par:

- Redux action dispatch nahi hota.
- Next route par navigation nahi hoti.
- API call nahi hoti.
- Database mein save nahi hota.

Is wajah se Step 1 se Step 2 ka actual working connection abhi missing hai.

### Progress bar

Company-info page mein progress bars manually bani hui hain. Baqi onboarding pages reusable component use karti hain:

### [components/common/StepProgress.tsx](components/common/StepProgress.tsx)

Ye component `current` aur `total` leta hai aur green/gray progress bars render karta hai. Is ka matlab sirf visual progress dikhana hai; ye data save nahi karta aur navigation nahi karta.

## 7. Onboarding Step 2: Workspace Setup

### Screen file: [app/(onboarding)/workspace-setup/page.tsx](app/(onboarding)/workspace-setup/page.tsx)

Browser URL: `/workspace-setup`

### Workspace setup ka matlab

Workspace ka matlab HR system ke andar company ka working area. Is step mein user apni company ki industry select karta hai, jaise Crypto, E-Commerce, Fintech, Health Tech, Service ya Product.

Domain upar read-only form mein show hota hai. Read-only ka matlab user us field ko is screen par edit nahi kar sakta.

### Imports ka role

```ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setIndustry } from "@/features/onboarding/onboardingSlice";
import StepProgress from "@/components/common/StepProgress";
```

- `useState`: selected industry ko current screen par rakhta hai.
- `useRouter`: Go Back aur Continue par URL change karta hai.
- `useAppSelector`: Redux se `companyName` aur `domain` read karta hai.
- `useAppDispatch`: Redux action bhejne ke liye hai.
- `setIndustry`: selected industry ko Redux state mein set karta hai.
- `StepProgress`: Step 2 ka progress indicator dikhata hai.

### Continue press karne par data kahan jata hai?

```text
selectedIndustry
  -> dispatch(setIndustry(selectedIndustry))
  -> Redux onboarding.industry
  -> router.push('/role-info')
```

Yahan selected industry Redux ke `onboarding` state mein save hoti hai. Ye database mein save nahi hoti. Browser refresh hone par Redux state reset ho sakti hai.

Go Back button:

```text
/workspace-setup -> /company-info
```

### Note: companyName

File Redux se `companyName` read karti hai, lekin current JSX mein us value ko visible jagah use nahi kar rahi. Isi wajah se lint warning aa sakti hai. Ye design ya runtime flow ko currently break nahi karti.

## 8. Onboarding Step 3: Role Info

### Screen file: [app/(onboarding)/role-info/page.tsx](app/(onboarding)/role-info/page.tsx)

Browser URL: `/role-info`

### Is screen ka matlab

User batata hai ke company mein us ka role kya hai: CEO/Owner, HR Manager, HR Staff, IT/Tech Manager, IT/Tech Staff ya Other. `Other` select karne par extra custom role input show hota hai.

### Imports aur un ka kaam

```text
useState       -> selectedRole aur customRole ki temporary values
useRouter      -> back/next URL navigation
useAppSelector -> Redux se domain read karna
useAppDispatch -> Redux mein role bhejna
setRole        -> role aur customRole save karna
StepProgress   -> Step 3 visual progress
```

### Continue ka data flow

```text
selectedRole + customRole
  -> dispatch(setRole({ role, customRole }))
  -> Redux onboarding.role/customRole
  -> router.push('/use-case')
```

Go Back `/workspace-setup` par jata hai. Role abhi backend mein save nahi hota.

## 9. Onboarding Step 4: Use Case

### Screen file: [app/(onboarding)/use-case/page.tsx](app/(onboarding)/use-case/page.tsx)

Browser URL: `/use-case`

### Use case ka matlab

Use case ka matlab hai user HRDashboard ko kis main purpose ke liye use karega. Options mein employee onboarding, time tracking, performance management, employee engagement aur recruitment hain.

### Continue ka data flow

```text
selected use case
  -> dispatch(setUseCase(selected))
  -> Redux onboarding.useCase
  -> router.push('/dashboard')
```

Yahan navigation dashboard par hoti hai, lekin company ka complete onboarding data backend ko nahi bheja jata. Is liye current project mein dashboard par jana login ya completed onboarding ka proof nahi hai.

## 10. Redux: data asal mein kahan save hota hai?

### [store/provider.tsx](store/provider.tsx)

Ye React ko Redux store se connect karta hai. Is ke baghair onboarding pages `useAppSelector` aur `useAppDispatch` se Redux state use nahi kar sakti.

### [store/index.ts](store/index.ts)

Ye Redux store banata hai. Current store mein sirf ek reducer registered hai:

```text
onboarding -> onboardingReducer
```

### [features/onboarding/onboardingSlice.ts](features/onboarding/onboardingSlice.ts)

Ye onboarding ka state structure aur actions define karta hai.

State fields:

```text
companyName  -> company ka naam
domain       -> company ka short domain
companySize  -> company ke employees ka size
industry     -> company ki industry
role         -> user ka role
customRole   -> Other role ka custom text
useCase      -> system use karne ka main purpose
```

Actions:

```text
setCompanyInfo -> companyName, domain, companySize set karna
setIndustry    -> industry set karna
setRole        -> role aur customRole set karna
setUseCase     -> useCase set karna
```

Important: Redux memory/database nahi hai. Current setup mein state browser refresh ke baad persist nahi hoti aur server/database ko nahi jati.

## 11. Onboarding layout

### [app/(onboarding)/layout.tsx](app/(onboarding)/layout.tsx)

Ye onboarding group ke pages ko wrap karta hai aur `ReduxProvider` render karta hai. Is wajah se onboarding pages Redux state access kar pa rahe hain.

Is file mein abhi:

- Login check nahi.
- User session check nahi.
- Onboarding header active nahi.
- Company data save karne ka code nahi.

## 12. Dashboard ka common flow

### Layout file: [app/(dashboard)/layout.tsx](app/(dashboard)/layout.tsx)

Dashboard group ki har screen ke around ye layout render hota hai:

```text
[components/layout/Sidebar.tsx](components/layout/Sidebar.tsx)
  + [components/layout/Navbar.tsx](components/layout/Navbar.tsx)
  + current page
```

Is ka matlab `/employees`, `/leaves`, `/settings` aur baqi dashboard URLs par Sidebar aur Navbar common nazar aayenge.

### [components/layout/Sidebar.tsx](components/layout/Sidebar.tsx)

Sidebar mein brand `People / Ops` aur navigation links hain:

```text
Dashboard   -> /dashboard
Employees   -> /employees
Departments -> /departments
Attendance  -> /attendance
Leaves      -> /leaves
Payroll     -> /payroll
Settings    -> /settings
```

Ye links `next/link` ke zariye pages change karte hain. Sidebar data fetch nahi karta aur login user verify nahi karta.

### [components/layout/Navbar.tsx](components/layout/Navbar.tsx)

Navbar `Workspace` aur `Signed-in user placeholder` text show karta hai. Ye abhi real logged-in user, email ya logout button se connected nahi hai.

## 13. Dashboard ki har screen

### [app/(dashboard)/dashboard/page.tsx](app/(dashboard)/dashboard/page.tsx)

`/dashboard` par `PageHeader` ke zariye Dashboard title aur description show hoti hai. Phir static stats show hoti hain:

```text
Employees       248
Present today   231
Pending leave    12
Departments       8
```

Ye numbers current code mein hard-coded hain. API ya database se nahi aa rahe.

### [app/(dashboard)/employees/page.tsx](app/(dashboard)/employees/page.tsx)

`/employees` par employee records ka future module placeholder hai. Ye `ModulePage` import karta hai.

### [app/(dashboard)/departments/page.tsx](app/(dashboard)/departments/page.tsx)

`/departments` par departments manage karne ka future module placeholder hai.

### [app/(dashboard)/attendance/page.tsx](app/(dashboard)/attendance/page.tsx)

`/attendance` par attendance track karne ka future module placeholder hai.

### [app/(dashboard)/leaves/page.tsx](app/(dashboard)/leaves/page.tsx)

`/leaves` par leave requests aur balances ka future module placeholder hai.

### [app/(dashboard)/payroll/page.tsx](app/(dashboard)/payroll/page.tsx)

`/payroll` par payroll workspace ka placeholder hai.

### [app/(dashboard)/settings/page.tsx](app/(dashboard)/settings/page.tsx)

`/settings` par workspace aur account settings ka placeholder hai.

### Employee ke extra routes

- [app/(dashboard)/employees/create/page.tsx](app/(dashboard)/employees/create/page.tsx): `/employees/create`, employee create placeholder.
- [app/(dashboard)/employees/[id]/page.tsx](app/(dashboard)/employees/[id]/page.tsx): `/employees/123`, employee profile placeholder. Current code `id` use nahi karta.
- [app/(dashboard)/employees/[id]/edit/page.tsx](app/(dashboard)/employees/[id]/edit/page.tsx): `/employees/123/edit`, employee edit placeholder. Current code `id` use nahi karta.

## 14. Common components ka connection

### [components/common/PageHeader.tsx](components/common/PageHeader.tsx)

Title aur optional description render karta hai. Dashboard page aur `ModulePage` is ko use karte hain.

### [components/common/ModulePage.tsx](components/common/ModulePage.tsx)

Ye do components ko jorta hai:

```text
ModulePage
  -> PageHeader
  -> EmptyState
```

Is se Employees, Departments, Attendance, Leaves, Payroll aur Settings pages same simple structure use karte hain.

### [components/common/EmptyState.tsx](components/common/EmptyState.tsx)

Jab actual records ya table abhi available na ho to ye placeholder message show karta hai, jaise `Employees records will appear here.`.

### UI components

Ye reusable files available hain, lekin current placeholder screens mein mostly direct HTML inputs/buttons use ho rahe hain:

- [components/ui/Button.tsx](components/ui/Button.tsx): common button.
- [components/ui/Input.tsx](components/ui/Input.tsx): common input.
- [components/ui/Select.tsx](components/ui/Select.tsx): common select.
- [components/ui/Modal.tsx](components/ui/Modal.tsx): modal dialog.
- [components/ui/Spinner.tsx](components/ui/Spinner.tsx): loading spinner.
- [components/ui/Table.tsx](components/ui/Table.tsx): table structure.

## 15. API, services aur server files

Ye files directly screen nahi dikhati. In ka kaam future mein screen aur database ke darmiyan data bhejna hai.

### API routes

- [app/api/auth/register/route.ts](app/api/auth/register/route.ts): registration API, abhi `501` placeholder.
- [app/api/auth/login/route.ts](app/api/auth/login/route.ts): login API, abhi `501` placeholder.
- [app/api/employees/route.ts](app/api/employees/route.ts): employees collection API boundary.
- [app/api/employees/[id]/route.ts](app/api/employees/[id]/route.ts): ek employee ki API boundary.
- [app/api/departments/route.ts](app/api/departments/route.ts): departments API boundary.
- [app/api/attendance/route.ts](app/api/attendance/route.ts): attendance API boundary.
- [app/api/leaves/route.ts](app/api/leaves/route.ts): leaves API boundary.

### Server files

- [server/auth.ts](server/auth.ts): token verify karne ke liye intended, abhi error throw karta hai.
- [server/db.ts](server/db.ts): database connect karne ke liye intended, abhi error throw karta hai.
- [server/models/User.ts](server/models/User.ts): current simple `User` TypeScript type.
- [server/models/Employee.ts](server/models/Employee.ts): employee model boundary.
- [server/models/Department.ts](server/models/Department.ts): department model boundary.
- [server/models/Attendance.ts](server/models/Attendance.ts): attendance model boundary.
- [server/models/Leave.ts](server/models/Leave.ts): leave model boundary.

### Services

- [services/api/apiClient.ts](services/api/apiClient.ts): API requests ke liye client boundary.
- [services/api/employeeService.ts](services/api/employeeService.ts): employees fetch karne ka service; `apiRequest` ko `/employees` call karta hai.
- [services/auth/authService.ts](services/auth/authService.ts): authentication service ke liye reserved boundary.

## 16. Current project mein asal mein kya ho raha hai?

Current actual behavior ye hai:

```text
User /
  -> /login
  -> fields fill karta hai
  -> sirf empty-field validation hoti hai
  -> fake success alert aata hai
  -> real login nahi hota
```

Aur onboarding ka current behavior:

```text
/company-info
  -> form visible, Continue ka submit handler missing

/workspace-setup
  -> industry Redux memory mein save
  -> /role-info

/role-info
  -> role Redux memory mein save
  -> /use-case

/use-case
  -> use case Redux memory mein save
  -> /dashboard
```

## 17. Access protection ki current situation

### [middleware.ts](middleware.ts)

Middleware dashboard URLs ko match karta hai, lekin function hamesha `NextResponse.next()` return karta hai. Is ka matlab koi token, cookie ya login session check nahi hota.

### [app/(dashboard)/layout.tsx](app/(dashboard)/layout.tsx)

Ye Sidebar aur Navbar lagata hai, lekin authentication guard nahi lagata.

Is liye current project mein user direct `/dashboard` URL bhi open kar sakta hai.

## 18. Desired future flow

User ka desired secure flow ye hai:

```text
1. User /login dekhe
2. Unregistered credentials se login fail ho
3. User /register par jaye
4. Name, email, password submit kare
5. Account database mein save ho
6. User /login par aaye
7. Wahi registered email/password dale
8. Login successful ho
9. User /company-info par jaye
10. Onboarding ke 4 steps complete kare
11. Onboarding data save ho
12. User /dashboard par jaye
```

Is future flow ko implement karne ke main points hain:

- Login/register pages ko auth API se connect karna.
- User ko database mein save karna.
- Password ko secure hash ke saath store karna.
- Login ke baad cookie/session/token banana.
- Middleware mein session check karna.
- Company-info ka submit handler banana.
- Onboarding state ko backend par save karna.
- Final step ke baad dashboard redirect karna.

## 19. Error aur loading screens

- [app/loading.tsx](app/loading.tsx): page loading ke waqt `Loading HRMS...` dikhata hai.
- [app/error.tsx](app/error.tsx): error hone par message aur `Try again` button dikhata hai.
- [app/not-found.tsx](app/not-found.tsx): wrong URL par `Page not found` aur dashboard link dikhata hai.

## 20. Final short summary

```text
page.tsx    = screen
layout.tsx  = common wrapper
route.ts    = backend API
component   = reusable UI piece
slice.ts    = Redux state aur actions
service     = API call ka helper
server      = database/auth ke server-side boundaries
```

Abhi UI screens mostly design/placeholders hain. Login, register, database, session aur secure access implementation pending hai. Ye documentation file sirf project ko samajhne ke liye hai aur application ke design/code ko change nahi karti.
