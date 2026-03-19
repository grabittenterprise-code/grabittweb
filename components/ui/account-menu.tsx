"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/context/auth-context";

type AccountMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function AccountMenu({ open, onClose }: AccountMenuProps) {
  const router = useRouter();
  const { logout } = useAuth();

  const menuVariants = {
    hidden: { opacity: 0, y: -8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.22, ease: "easeOut", staggerChildren: 0.05 }
    },
    exit: { opacity: 0, y: -6, transition: { duration: 0.16, ease: "easeIn" } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -4 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.16, ease: "easeOut" } }
  };

  const handleLogout = () => {
    logout();
    onClose();
    router.push("/");
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          variants={menuVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute right-0 top-[3.1rem] z-50 w-56 rounded-2xl border border-white/8 bg-black/60 p-2.5 backdrop-blur-2xl shadow-[0_18px_55px_rgba(0,0,0,0.55)]"
        >
          <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2.5 text-[0.6rem] uppercase tracking-[0.36em] text-white/45">
            Account
          </div>
          <motion.div
            variants={itemVariants}
            className="mt-2 rounded-xl border border-white/5 bg-white/[0.015] px-1.5 py-1.5"
          >
            <motion.div variants={itemVariants} className="space-y-0.5">
              <Link
                href="/dashboard"
                className="block rounded-lg px-3.5 py-2.5 text-sm text-white/78 transition hover:bg-white/[0.05] hover:text-white"
                onClick={onClose}
              >
                Dashboard
              </Link>
              <Link
                href="/contact"
                className="block rounded-lg px-3.5 py-2.5 text-sm text-white/78 transition hover:bg-white/[0.05] hover:text-white"
                onClick={onClose}
              >
                Contact Us
              </Link>
              <Link
                href="/help"
                className="block rounded-lg px-3.5 py-2.5 text-sm text-white/78 transition hover:bg-white/[0.05] hover:text-white"
                onClick={onClose}
              >
                Help
              </Link>
              <div className="my-1 h-px bg-white/10" />
              <button
                type="button"
                onClick={handleLogout}
                className="block w-full rounded-lg px-3.5 py-2.5 text-left text-sm text-white/78 transition hover:bg-white/[0.05] hover:text-white"
              >
                Log Out
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
