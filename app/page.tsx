'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Text } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

const EmployeeOrb = ({
  name,
  status,
  x,
  z,
}: {
  name: string;
  status: 'critical' | 'warning' | 'healthy';
  x: number;
  z: number;
}) => {
  const color =
    status === 'critical' ? '#ef4444' : status === 'warning' ? '#f59e0b' : '#22c55e';

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
      <mesh position={[x, 0, z]}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} />
        <Text
          position={[0, -1.4, 0]}
          fontSize={0.22}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {name}
        </Text>
      </mesh>
    </Float>
  );
};

export default function Home() {
  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) throw error;
      return data ?? [];
    },
  });

  const stats = useMemo(() => {
    let critical = 0,
      warning = 0,
      healthy = 0;
    for (const emp of employees as any[]) {
      if (emp.status === 'critical') critical++;
      else if (emp.status === 'warning') warning++;
      else healthy++;
    }
    return { critical, warning, healthy };
  }, [employees]);

  return (
    <main className="min-h-screen flex flex-col gap-8 p-6 md:p-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-semibold tracking-tight"
          >
            Eman HR Unified Workforce OS
          </motion.h1>
          <p className="text-slate-400 text-sm md:text-base mt-1">
            Single source of truth for Muqeem, Qiwa, GOSI, and Mudad compliance.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-medium text-slate-950 shadow-lg shadow-emerald-500/30"
        >
          One-Click Sync
        </motion.button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-xs uppercase tracking-wide text-slate-400">Critical</div>
          <div className="mt-2 flex items-baseline gap-2">
            <div className="text-3xl font-semibold text-critical">{stats.critical}</div>
            <span className="text-xs text-slate-500">employees</span>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-xs uppercase tracking-wide text-slate-400">Warning</div>
          <div className="mt-2 flex items-baseline gap-2">
            <div className="text-3xl font-semibold text-warning">{stats.warning}</div>
            <span className="text-xs text-slate-500">employees</span>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-xs uppercase tracking-wide text-slate-400">Healthy</div>
          <div className="mt-2 flex items-baseline gap-2">
            <div className="text-3xl font-semibold text-healthy">{stats.healthy}</div>
            <span className="text-xs text-slate-500">employees</span>
          </div>
        </div>
      </section>

      <section className="relative w-full flex-1 rounded-3xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-[0_0_80px_-40px_rgba(15,23,42,1)]">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.7} />
          <pointLight position={[10, 10, 10]} intensity={1.4} />
          <OrbitControls enablePan={false} />
          {(employees as any[]).map((emp, index) => {
            const row = Math.floor(index / 5);
            const col = index % 5;
            const x = (col - 2) * 2.4;
            const z = -row * 2.4;
            return (
              <EmployeeOrb
                key={emp.id}
                name={emp.name}
                status={emp.status ?? 'healthy'}
                x={x}
                z={z}
              />
            );
          })}
        </Canvas>
      </section>
    </main>
  );
}
