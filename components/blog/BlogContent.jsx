// Reusable components for blog post content

export function Section({ id, children }) {
  return (
    <section id={id} className="scroll-mt-24">
      {children}
    </section>
  );
}

export function Heading2({ id, children }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 pb-3 border-b-2 border-blue-500">
      {children}
    </h2>
  );
}

export function Heading3({ id, children }) {
  return (
    <h3 id={id} className="scroll-mt-24 text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
      {children}
    </h3>
  );
}

export function Paragraph({ children }) {
  return (
    <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-6">
      {children}
    </p>
  );
}

export function IntroBox({ children }) {
  return (
    <div className="my-8 p-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg">
      <div className="text-gray-900 dark:text-white font-medium">
        {children}
      </div>
    </div>
  );
}

export function WarningBox({ title, children }) {
  return (
    <div className="my-8 p-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg">
      {title && (
        <h4 className="text-red-900 dark:text-red-400 font-bold text-lg mb-3 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {title}
        </h4>
      )}
      <div className="text-red-900 dark:text-red-300">
        {children}
      </div>
    </div>
  );
}

export function TipBox({ title, children }) {
  return (
    <div className="my-8 p-6 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-r-lg">
      {title && (
        <h4 className="text-green-900 dark:text-green-400 font-bold text-lg mb-3 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {title}
        </h4>
      )}
      <div className="text-green-900 dark:text-green-300">
        {children}
      </div>
    </div>
  );
}

export function BulletList({ children }) {
  return (
    <ul className="my-6 space-y-3 list-disc list-inside text-gray-700 dark:text-slate-300">
      {children}
    </ul>
  );
}

export function NumberedList({ children }) {
  return (
    <ol className="my-6 space-y-3 list-decimal list-inside text-gray-700 dark:text-slate-300">
      {children}
    </ol>
  );
}

export function ListItem({ children }) {
  return (
    <li className="leading-relaxed">
      {children}
    </li>
  );
}

export function Highlight({ children }) {
  return (
    <span className="bg-yellow-200 dark:bg-yellow-900/40 px-1 py-0.5 rounded font-medium">
      {children}
    </span>
  );
}

export function Strong({ children }) {
  return (
    <strong className="font-bold text-gray-900 dark:text-white">
      {children}
    </strong>
  );
}
