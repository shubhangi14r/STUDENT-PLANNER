@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
}

@layer base {
  body {
    @apply bg-[#051937] text-[#37352F] selection:bg-blue-900;
  }
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(150px, auto);
  gap: 1.5rem;
}

.bento-card {
  @apply rounded-[40px] p-8 flex flex-col justify-between relative overflow-hidden transition-transform duration-300 hover:scale-[1.02] cursor-pointer;
}

.bento-card-pink { @apply bg-[#FF6B9B] text-white; }
.bento-card-blue { @apply bg-[#87CEEB] text-white; }
.bento-card-white { @apply bg-white text-[#FF6B9B]; }

.bento-arrow {
  @apply absolute bottom-6 right-6 w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center;
}

.bento-card-white .bento-arrow {
  @apply border-[#FF6B9B]/30;
}

.notion-shadow {
  box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px;
}

.fun-gradient {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
}

.glass-card {
  @apply bg-white/80 backdrop-blur-md border border-white/20 shadow-xl;
}

.markdown-body h1 { @apply text-3xl font-extrabold mt-8 mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600; }
.markdown-body h2 { @apply text-2xl font-bold mt-6 mb-4 text-indigo-500; }
.markdown-body h3 { @apply text-xl font-bold mt-5 mb-3 text-purple-500; }
.markdown-body p { @apply mb-4 leading-relaxed text-lg; }
.markdown-body ul { @apply list-disc ml-6 mb-4 space-y-2; }
.markdown-body ol { @apply list-decimal ml-6 mb-4 space-y-2; }
.markdown-body code { @apply bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-mono text-sm; }
.markdown-body pre { @apply bg-slate-900 text-slate-100 p-6 rounded-2xl font-mono text-sm overflow-x-auto mb-6 shadow-lg; }
.markdown-body blockquote { @apply border-l-4 border-purple-400 pl-6 italic mb-6 text-slate-600 bg-purple-50/50 py-2 rounded-r-lg; }

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  @apply bg-transparent;
}
::-webkit-scrollbar-thumb {
  @apply bg-slate-200 rounded-full hover:bg-slate-300 transition-colors;
}

