import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, Check, Trash2, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { EmptyState, Button, SectionHeader } from '../../components/shared';

const iconMap = { warning: AlertTriangle, success: CheckCircle, info: Info, error: AlertTriangle };
const colorMap = { warning: 'text-amber-500 bg-amber-500/10', success: 'text-green-500 bg-green-500/10', info: 'text-blue-500 bg-blue-500/10', error: 'text-red-500 bg-red-500/10' };

const Notifications = ({ notifications, markNotificationRead, clearNotifications }) => {
  const unread = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel border border-[var(--border)] rounded-2xl p-6 space-y-4">
      <SectionHeader icon={Bell} label="Notifications">
        {notifications.length > 0 && (
          <Button variant="ghost" size="sm" icon={Trash2} onClick={clearNotifications} className="!text-red-500 hover:!text-red-400">
            Clear
          </Button>
        )}
      </SectionHeader>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {notifications.length === 0 ? (
          <EmptyState icon={BellOff} title="No notifications" description="You're all caught up!" />
        ) : (
          <AnimatePresence>
            {notifications.map(n => {
              const Icon = iconMap[n.type] || Info;
              return (
                <motion.div key={n.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all ${n.read ? 'bg-[var(--bg-secondary)]/30 border-[var(--border)] opacity-60' : 'bg-[var(--bg-secondary)]/50 border-[var(--border)]'}`}>
                  <div className={`p-1.5 rounded-lg flex-shrink-0 ${colorMap[n.type] || colorMap.info}`}>
                    <Icon className="w-3 h-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-[var(--text-primary)]">{n.title}</p>
                    <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">{n.message}</p>
                    <p className="text-[9px] text-[var(--text-secondary)] mt-1">{new Date(n.createdAt).toLocaleString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  {!n.read && (
                    <button onClick={() => markNotificationRead(n.id)} className="p-1 rounded hover:bg-green-500/10 text-[var(--text-secondary)] hover:text-green-500 flex-shrink-0">
                      <Check className="w-3 h-3" />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};

export default Notifications;
