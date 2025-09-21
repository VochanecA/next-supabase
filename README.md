<a href="https://demo-nextjs-with-supabase.vercel.app/">
  <img alt="Next.js and Supabase Starter Kit - the fastest way to build apps with Next.js and Supabase" src="https://demo-nextjs-with-supabase.vercel.app/opengraph-image.png">
  <h1 align="center">Next.js and Supabase Starter Kit</h1>
</a>

<p align="center">
 The fastest way to build apps with Next.js and Supabase
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#deploy-to-vercel"><strong>Deploy to Vercel</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> ·
  <a href="#feedback-and-issues"><strong>Feedback and issues</strong></a>
  <a href="#more-supabase-examples"><strong>More Examples</strong></a>
</p>
<br/>

## Features

- Works across the entire [Next.js](https://nextjs.org) stack
  - App Router
  - Pages Router
  - Middleware
  - Client
  - Server
  - It just works!
- supabase-ssr. A package to configure Supabase Auth to use cookies
- Password-based authentication block installed via the [Supabase UI Library](https://supabase.com/ui/docs/nextjs/password-based-auth)
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Components with [shadcn/ui](https://ui.shadcn.com/)
- Optional deployment with [Supabase Vercel Integration and Vercel deploy](#deploy-your-own)
  - Environment variables automatically assigned to Vercel project

## Demo

You can view a fully working demo at [demo-nextjs-with-supabase.vercel.app](https://demo-nextjs-with-supabase.vercel.app/).

## Deploy to Vercel

Vercel deployment will guide you through creating a Supabase account and project.

After installation of the Supabase integration, all relevant environment variables will be assigned to the project so the deployment is fully functioning.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&project-name=nextjs-with-supabase&repository-name=nextjs-with-supabase&demo-title=nextjs-with-supabase&demo-description=This+starter+configures+Supabase+Auth+to+use+cookies%2C+making+the+user%27s+session+available+throughout+the+entire+Next.js+app+-+Client+Components%2C+Server+Components%2C+Route+Handlers%2C+Server+Actions+and+Middleware.&demo-url=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2F&external-id=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&demo-image=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2Fopengraph-image.png)

The above will also clone the Starter kit to your GitHub, you can clone that locally and develop locally.

If you wish to just develop locally and not deploy to Vercel, [follow the steps below](#clone-and-run-locally).

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Create a Next.js app using the Supabase Starter template npx command

   ```bash
   npx create-next-app --example with-supabase with-supabase-app
   ```

   ```bash
   yarn create next-app --example with-supabase with-supabase-app
   ```

   ```bash
   pnpm create next-app --example with-supabase with-supabase-app
   ```

3. Use `cd` to change into the app's directory

   ```bash
   cd with-supabase-app
   ```

4. Rename `.env.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://supabase.com/dashboard/project/_?showConnect=true)

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

6. This template comes with the default shadcn/ui style initialized. If you instead want other ui.shadcn styles, delete `components.json` and [re-install shadcn/ui](https://ui.shadcn.com/docs/installation/next)

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

## Feedback and issues

Please file feedback and issues over on the [Supabase GitHub org](https://github.com/supabase/supabase/issues/new/choose).

## More Supabase examples

- [Next.js Subscription Payments Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Cookie-based Auth and the Next.js 13 App Router (free course)](https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF)
- [Supabase Auth and the Next.js App Router](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)
# AI Notify - Next.js Web App

**AI Notify** is a modern web application delivering AI-powered, context-aware notifications to help users reduce noise and improve productivity. Built with Next.js, React, and Supabase for authentication, it focuses on performance, SEO, and modern best practices.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Optimizations](#optimizations)  
- [Getting Started](#getting-started)  
- [Project Structure](#project-structure)  
- [License](#license)

---

## Features

- **LCP-Optimized Hero Section** – Critical-path CSS, minimal JS bundle, smooth CSS animations  
- **Features Section** – Key features displayed with icons and fade-in-up animation  
- **Dark/Light Mode** – Theme toggle with `next-themes`  
- **Auth Integration** – Supabase authentication with subscription checks  
- **Service Worker** – Offline support via `public/sw.js`  
- **SEO-Friendly** – Metadata, Open Graph, Twitter cards, canonical URL  
- **Performance-Focused** – Modern JS, preloaded fonts, minimized bundle sizes  

---

## Tech Stack

- [Next.js](https://nextjs.org/) (v14+) – React framework  
- [React](https://reactjs.org/) – UI library  
- [Supabase](https://supabase.com/) – Authentication & database  
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework  
- [Lucide Icons](https://lucide.dev/) – SVG icons  
- [Framer Motion](https://www.framer.com/motion/) – Animations  
- [react-hot-toast](https://react-hot-toast.com/) – Toast notifications  

---

## Optimizations Implemented

### 1. Performance Optimizations

- **Inline Critical CSS** – Prevents FOUC and reduces LCP  
- **Preload Fonts** – Only the necessary `Inter` font loaded for hero section  
- **Minimal JS Bundle** – Hero + Features bundled under 50KB for first paint  
- **Modern JS Only** – Removed legacy transpilation for modern browsers  
- **Defer Non-Critical Requests** – No render-blocking scripts for first paint  
- **Service Worker** – Caches static assets and improves offline performance  

### 2. SEO & Accessibility

- **Metadata** – Title, description, keywords, canonical, Open Graph & Twitter cards  
- **Semantic HTML** – Single `<h1>` for Hero, proper `<h2>` for Features section  
- **Accessibility** – Focus outlines, reduced motion for animations, color contrast  
- **Lighthouse Scores** – Optimized for FCP, LCP, SEO, and accessibility  

### 3. Next.js Config Optimizations

- **`esmExternals: true`** – Prefer ESM modules for smaller bundle sizes  
- **`productionBrowserSourceMaps: true`** – Enables source maps for easier debugging  
- **`compress: true`** – Enable gzip/BR compression for JS/CSS  
- **`reactStrictMode: true`** – React strict mode enabled  
- **Standalone Build** – Optional smaller container builds (`output: "standalone"`)  

### 4. Components Optimized

- **Hero Component** – Optimized for LCP, minimal CSS animations, inline styles  
- **Features Component** – Fade-in animations, minimal render-blocking JS  
- **Header Component** – Mobile & desktop navigation optimized, theme toggle, subscription-aware user dropdown  

---
