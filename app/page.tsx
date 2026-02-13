'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Text } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

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

  const stats = {
    critical: employees.filter((emp: any) => emp.status === 'critical').length,
    warning: employees.filter((emp: any) => emp.status === 'warning').length,
    healthy: employees.filter((emp: any) => emp.status === 'healthy').length,
  };

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
          className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-medium text-slate-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-600"
        >
          One-Click Sync
        </motion.button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-800/50 bg-slate-900/60 backdrop-blur-sm p-6 shadow-xl">
          <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">Critical</div>
          <div className="text-3xl font-bold text-red-400 mb-1">{stats.critical}</div>
          <div className="text-slate-500 text-sm">Iqama/Contract &lt;30 days</div>
        </div>
        <div className="rounded-2xl border border-slate-800/50 bg-slate-900/60 backdrop-blur-sm p-6 shadow-xl">
          <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">Warning</div>
          <div className="text-3xl font-bold text-amber-400 mb-1">{stats.warning}</div>
          <div className="text-slate-500 text-sm">&lt;60 days expiry</div>
        </div>
        <div className="rounded-2xl border border-slate-800/50 bg-slate-900/60 backdrop-blur-sm p-6 shadow-xl">
          <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">Healthy</div>
          <div className="text-3xl font-bold text-emerald-400 mb-1">{stats.healthy}</div>
          <div className="text-slate-500 text-sm">All compliant</div>
        </div>
      </section>

      <section className="flex-1 min-h-[600px] rounded-3xl border border-slate-800/50 bg-slate-900/30 backdrop-blur-xl shadow-2xl overflow-hidden">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <color attach="background" args={['#020617']} />
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1.2} />
          <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.5} />
          {employees.map((emp: any, index: number) => {
            const row = Math.floor(index / 5);
            const col = index % 5;
            const x = (col - 2) * 2.4;
            const z = -row * 2.4;
            return (
              <EmployeeOrb
                key={emp.id}
                name={emp.name}
                status={emp.status as 'critical' | 'warning' | 'healthy'}
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
