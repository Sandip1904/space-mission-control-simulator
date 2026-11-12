import React from 'react';

export function PanelHeader({ title, subtitle, icon: Icon, rightContent }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-3 border-b border-sky-500/20">
      <div className="flex items-center gap-2">
        {Icon && (
          <div className="p-1.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <div>
          <h2 className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-slate-100">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[11px] text-slate-400 font-mono">{subtitle}</p>
          )}
        </div>
      </div>
      {rightContent && <div className="flex items-center gap-2">{rightContent}</div>}
    </div>
  );
}
