
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, X } from 'lucide-react';
import { SIDEBAR_ITEMS } from '../constants';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  // Automatically open submenu if a child is active
  useEffect(() => {
    const activeItem = SIDEBAR_ITEMS.find(item => 
      item.subItems?.some(sub => sub.path === location.pathname)
    );
    if (activeItem) {
      setOpenSubmenu(activeItem.id);
    }
  }, [location.pathname]);

  const toggleSubmenu = (id: string) => {
    setOpenSubmenu(openSubmenu === id ? null : id);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
      `}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              B
            </div>
            <div>
              <h1 className="font-bold text-slate-800 leading-tight">BenzERP</h1>
              <p className="text-xs text-slate-400">Inventory Solutions</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="md:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            const hasSubItems = !!item.subItems;
            const isSubmenuOpen = openSubmenu === item.id;

            return (
              <div key={item.id}>
                {hasSubItems ? (
                  <button
                    onClick={() => toggleSubmenu(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      isSubmenuOpen ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isSubmenuOpen ? 'text-blue-600' : 'text-slate-400'}>{item.icon}</span>
                      <span className="font-medium text-sm">{item.label}</span>
                    </div>
                    {isSubmenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                ) : (
                  <Link
                    to={item.path || '#'}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                    <span className="font-medium text-sm">{item.label}</span>
                  </Link>
                )}

                {hasSubItems && isSubmenuOpen && (
                  <div className="mt-1 ml-9 space-y-1 animate-in slide-in-from-top-1 duration-200">
                    {item.subItems?.map((sub) => (
                      <Link
                        key={sub.id}
                        to={sub.path}
                        className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                          location.pathname === sub.path 
                            ? 'text-blue-600 font-semibold bg-blue-50/50' 
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                        }`}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-100">
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2 px-3">Quick Help</div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <p className="text-xs text-slate-600 mb-2">Need assistance with your billing or stocks?</p>
            <button className="text-xs font-semibold text-blue-600 hover:underline">Support Desk</button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
