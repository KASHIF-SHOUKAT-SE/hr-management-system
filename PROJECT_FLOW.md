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

Typing ke waqt ye values browser ke current React component memory mein hoti hain. Submit hone par email/password `POST /api/auth/login` ko JSON body mein bheje jate hain; password browser ya localStorage mein save nahi hota.

### Login button press karne par kya hota hai?

Form `handleLogin` function chalata hai:

1. Browser ka default form submit roka jata hai.
2. Check hota hai ke email aur password empty to nahi.
3. Agar empty hon to form ke upar error message dikhaya jata hai.
4. Filled form `fetch("/api/auth/login")` se backend ko bheja jata hai.
5. Success par backend JWT ko `HttpOnly` `token` cookie mein set karta hai aur browser `/dashboard` par redirect hota hai.
6. Ghalat credentials ya server error par screen par error message dikhata hai.

Backend email ko lowercase karke MongoDB ke `User` collection mein dhoondta hai. `bcrypt.compare` hashed password verify karta hai; successful login ke baad token 7 din ke liye cookie mein rehta hai.

### Login se related backend file

### [app/api/auth/login/route.ts](app/api/auth/login/route.ts)

Ye browser screen nahi hai. Is ka URL `POST /api/auth/login` hai. Ye MongoDB connect karta hai, credentials verify karta hai, JWT banata hai aur `token` cookie response ke saath browser ko bhejta hai.

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

Typing ke waqt ye current page state hoti hai. Submit ke baad password `bcrypt.hash` se hash hokar MongoDB ke `User` document mein save hota hai; plain password save nahi hota.

### Create Account press karne par kya hota hai?

1. Default browser submit roka jata hai.
2. Name, email aur password validate hote hain; password kam az kam 6 characters ka hota hai.
3. `fetch("/api/auth/register")` name, email aur password backend ko bhejta hai.
4. Backend duplicate email check karke hashed password ke saath User document create karta hai.
5. Success par `/login?registered=1` open hota hai aur login screen success message dikhati hai.

Duplicate email par HTTP `409`, invalid input par `400`, aur unexpected server/database problem par `500` response milta hai. Screen in messages ko form ke andar dikhati hai.

### Register se related backend file

### [app/api/auth/register/route.ts](app/api/auth/register/route.ts)

Is ka URL `POST /api/auth/register` hai. Ye `connectDatabase()` ke zariye MongoDB se connect hota hai, `User` model se duplicate email check karta hai, password hash karta hai aur naya record create karta hai.

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

`/employees` par MongoDB se employee records load hote hain. Search, office, job title aur status filters ke saath AG Grid table show hoti hai. Employee row click karne se selected employee ka detail page open hota hai.

### Add New button ka real flow (sidebar open hona)

Employee list page par Add New button as a real UI action work karta hai. Is flow ka code exact yahan hai:

1. [components/employees/EmployeePageHeader.tsx](components/employees/EmployeePageHeader.tsx) ke Button par `onClick={onAddNew}` laga huwa hai.
2. [app/(dashboard)/employees/page.tsx](app/(dashboard)/employees/page.tsx) mein state `isEmployeeFormOpen` rakha gaya hai.
3. `EmployeePageHeader` ko `onAddNew={() => setIsEmployeeFormOpen(true)}` pass kiya jata hai.
4. Jis waqt state true hota hai, page ke end par [components/forms/EmployeeForm.tsx](components/forms/EmployeeForm.tsx) render hota hai.
5. EmployeeForm ka UI ek fixed overlay + right-side `aside` hota hai, jo modern drawer/sidebar style mein open hota hai.

Ye code ka summary is tarah hai:

```tsx
const [isEmployeeFormOpen, setIsEmployeeFormOpen] = useState(false);

<EmployeePageHeader onAddNew={() => setIsEmployeeFormOpen(true)} />

<EmployeeForm
  isOpen={isEmployeeFormOpen}
  onClose={() => setIsEmployeeFormOpen(false)}
/>
```

Aisa matlab hai ke Add New button click karne se browser URL change nahi hota. Sirf local component state true ho jata hai aur sidebar open ho jata hai. Ye route change nahi, UI state toggle hai.

### [components/forms/EmployeeForm.tsx](components/forms/EmployeeForm.tsx)

Ye actual sidebar card hai. Is file mein:

- `isOpen` prop check karta hai ke form open hai ya nahi.
- Agar `false` ho to `return null;` hota hai, matlab component render hi nahi hota.
- Agar `true` ho to fixed background overlay aur right-side `aside` render hota hai.
- `onClose` button ya backdrop click par form close hota hai.
- Form ke data ko `createEmployee` mutation submit karta hai.

Important: Ye form actual `Drawer`/`Sidebar` form hai, not a page route like `/employees/create`.

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
- [app/(dashboard)/employees/[id]/page.tsx](app/(dashboard)/employees/[id]/page.tsx): `/employees/123`, selected employee ka General, Job, Payroll, Documents aur Setting detail page.
- [app/(dashboard)/employees/[id]/edit/page.tsx](app/(dashboard)/employees/[id]/edit/page.tsx): separate edit route placeholder; current editing detail page ke cards ke andar hoti hai.

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

- [app/api/auth/register/route.ts](app/api/auth/register/route.ts): name/email/password validate karke hashed User document create karta hai.
- [app/api/auth/login/route.ts](app/api/auth/login/route.ts): bcrypt password check karke JWT ko HttpOnly cookie mein set karta hai.
- [app/api/employees/route.ts](app/api/employees/route.ts): employees list aur Add New create API boundary.
- [app/api/employees/[id]/route.ts](app/api/employees/[id]/route.ts): employee detail, General, Job, Payroll, Settings aur Documents read/update API boundary.
- [app/api/departments/route.ts](app/api/departments/route.ts): departments API boundary.
- [app/api/attendance/route.ts](app/api/attendance/route.ts): attendance API boundary.
- [app/api/leaves/route.ts](app/api/leaves/route.ts): leaves API boundary.

### Server files

- [server/auth.ts](server/auth.ts): JWT sign aur verify helper; secret `.env.local` se aata hai.
- [server/db.ts](server/db.ts): cached Mongoose connection; `MONGODB_URI` se local MongoDB connect karta hai.
- [server/models/User.ts](server/models/User.ts): Mongoose User schema with name, unique lowercase email, hashed password aur timestamps.
- [server/models/Employee.ts](server/models/Employee.ts): employee model boundary.
- [server/models/Department.ts](server/models/Department.ts): department model boundary.
- [server/models/Attendance.ts](server/models/Attendance.ts): attendance model boundary.
- [server/models/Leave.ts](server/models/Leave.ts): leave model boundary.

### Services

- [services/api/apiClient.ts](services/api/apiClient.ts): API requests ke liye client boundary.
- [services/api/employeeService.ts](services/api/employeeService.ts): employees fetch karne ka service; `apiRequest` ko `/employees` call karta hai.
- [services/auth/authService.ts](services/auth/authService.ts): authentication service ke liye reserved boundary.

## 16. Current project mein asal mein kya ho raha hai?

Authentication ka current actual behavior ye hai:

```text
User /
  -> /login
  -> email/password fill karta hai
  -> POST /api/auth/login
  -> MongoDB User lookup + bcrypt.compare
  -> JWT HttpOnly token cookie
  -> /dashboard
```

Register flow:

```text
/register
  -> name/email/password fill
  -> POST /api/auth/register
  -> bcrypt hash + MongoDB User.create
  -> /login?registered=1
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

Middleware dashboard URLs ko match karta hai. Agar `token` cookie nahi ho to request `/login` par redirect hoti hai; cookie ho to request dashboard screen tak jati hai. Cookie `HttpOnly` hai, is liye JavaScript uska token read nahi kar sakti.

### [app/(dashboard)/layout.tsx](app/(dashboard)/layout.tsx)

Ye Sidebar aur Navbar lagata hai, lekin authentication guard nahi lagata.

Is liye bina login ke direct `/dashboard` access nahi hota. Middleware JWT signature aur expiry bhi verify karta hai; invalid ya expired token par cookie delete karke `/login` redirect hota hai.

## 18. Authentication flow ab implemented hai

User ka current authentication flow ye hai:

```text
1. User /login dekhe
2. Unregistered credentials se login fail ho

3. User /register par jaye
4. Name, email, password submit kare
5. Account database mein save ho
6. User /login par aaye
7. Wahi registered email/password dale
8. Login successful ho
9. User dashboard screen dekhe
10. Logout endpoint/UI abhi next auth task hai
```

Implemented points: login/register pages API se connected hain, User MongoDB mein save hota hai, password bcrypt se hash hota hai, JWT cookie set hoti hai aur middleware protected routes ko guard karta hai. Onboarding persistence aur logout abhi separate work hai.

## 19. Employee detail tabs: Job, Payroll aur Documents

### Detail page

[app/(dashboard)/employees/[id]/page.tsx](app/(dashboard)/employees/[id]/page.tsx) par employee row click karne se selected employee ka detail page open hota hai:

```text
/employees/{employeeId}
  -> GET /api/employees/{employeeId}
  -> MongoDB employees collection
  -> selected employee ka profile
```

General tab ke baad ab teen tabs available hain:

### Job tab

Job tab mein Employment Information aur Contract Timeline sections hain. Employee ID, service year, position type, employment type, contract details, effective date aur work schedule edit kiye ja sakte hain.

Save Changes par `PUT /api/employees/{employeeId}` ko `job` object bheja jata hai. API existing job data ke saath merge karke same employee document mein save karti hai.

### Payroll tab

Payroll tab mein Payroll Information aur Compensation Breakdown sections hain. Employment type, job title, dates, geofencing, total compensation, salary, recurring, one-off aur offset fields available hain.

Payroll values `PUT /api/employees/{employeeId}` ke `payroll` object mein save hoti hain.

### Documents tab

Documents tab reference design ke mutabiq Personal Documents aur Payslips lists show karta hai. Har file ke saamne:

- Blue open button file ko new browser tab mein kholta hai.
- Red delete button file ko current UI list se remove karta hai.
- Upload File se personal document select karke list mein add hoti hai.
- Upload Payslip se payslip select karke Payslips list mein add hoti hai.
- Upload ke baad file ka data employee ke `documents` field mein save hota hai, isliye page refresh ke baad bhi file list mein rehti hai.
- Blue open button saved file ko new browser tab mein kholta hai.
- Delete button employee ke saved document list se file remove karta hai.

Current implementation selected files ko data URL ke roop mein MongoDB ke employee document mein save karti hai. Production ke liye large files ko object storage, jaise S3 ya Cloudinary, mein rakhna behtar hoga.

### Setting tab

Setting tab mein do independent cards hain:

- Account Settings: timezone edit aur save.
- Privacy: calendar birthday visibility (`Everyone` ya `Only me`) edit aur save.

Dono cards ki edit state alag hai, is liye ek card edit karne par doosra card open nahi hota. Timezone employee ke top-level `timezone` field mein aur privacy `calendarVisibility` field mein save hoti hai.

### Independent card editing

Job aur Payroll ke har card ki apni edit state hai:

```text
Employment Information -> jobInfoEditing
Contract Timeline      -> contractEditing
Payroll Information    -> payrollInfoEditing
Compensation Breakdown -> compensationEditing
Account Settings       -> accountSettingsEditing
Privacy                -> privacyEditing
```

Isliye ek card ka Edit icon click karne par sirf wahi card inputs aur Save Changes dikhata hai.

### Employee document structure

```text
employees/{employeeId}
  profile   -> personal, address aur emergency information
  job       -> employment aur contract information
  payroll   -> compensation information
  documents -> uploaded personal documents aur payslips
```

Job aur Payroll ke liye Edit icon sirf draft state open karta hai. Data persist karne ke liye Save Changes click karna zaroori hai.

## 20. Error aur loading screens

- [app/loading.tsx](app/loading.tsx): page loading ke waqt `Loading HRMS...` dikhata hai.
- [app/error.tsx](app/error.tsx): error hone par message aur `Try again` button dikhata hai.
- [app/not-found.tsx](app/not-found.tsx): wrong URL par `Page not found` aur dashboard link dikhata hai.

## 21. Final short summary

```text
page.tsx    = screen
layout.tsx  = common wrapper
route.ts    = backend API
component   = reusable UI piece
slice.ts    = Redux state aur actions
service     = API call ka helper
server      = database/auth ke server-side boundaries
```

Login, register, MongoDB database connection, password hashing, JWT session cookie aur dashboard route guard implemented hain. Onboarding data persistence, social login aur logout abhi separate modules hain. Ye documentation file project flow samjhati hai; screen behavior code files control karti hain.
