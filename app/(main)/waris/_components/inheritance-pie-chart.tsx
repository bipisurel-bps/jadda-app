'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Label } from 'recharts';
import { HeirResult } from '@/lib/types';
import { formatRupiah } from '@/lib/faraidh';

const COLORS = ['#1B6B4A', '#C9A84C', '#2196F3', '#E57373', '#26A69A', '#AB47BC', '#FF8A65', '#5C6BC0', '#66BB6A', '#FFA726', '#EC407A', '#78909C'];

interface Props {
  heirs: HeirResult[];
  totalEstate?: number;
}

const RADIAN = Math.PI / 180;

function renderCustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percentage, name, value }: any) {
  const radius = innerRadius + (outerRadius - innerRadius) * 1.35;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if ((percentage ?? 0) < 5) return null;

  return (
    <text x={x} y={y} fill="currentColor" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={10} className="fill-foreground">
      <tspan fontWeight="600">{(percentage ?? 0).toFixed(1)}%</tspan>
      <tspan x={x} dy={14} fontSize={9} className="fill-muted-foreground">Rp {formatRupiah(value ?? 0)}</tspan>
    </text>
  );
}

export default function InheritancePieChart({ heirs, totalEstate }: Props) {
  const chartData = (heirs ?? [])?.map?.((h: HeirResult, idx: number) => {
    const name = (h?.name ?? '')?.split?.('(')?.[0]?.trim?.() ?? `Ahli Waris ${idx + 1}`;
    return {
      name,
      value: Math.round(h?.amount ?? 0),
      percentage: h?.percentage ?? 0,
    };
  }) ?? [];

  if ((chartData?.length ?? 0) === 0) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={45}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
          animationBegin={0}
          animationDuration={800}
          label={renderCustomLabel}
          labelLine={false}
        >
          {chartData?.map?.((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS?.[index % (COLORS?.length ?? 1)] ?? '#1B6B4A'} />
          )) ?? []}
        </Pie>
        <Tooltip
          formatter={(value: any, _name: any, props: any) => [
            `Rp ${formatRupiah(value ?? 0)} (${(props?.payload?.percentage ?? 0).toFixed(1)}%)`,
            ''
          ]}
          contentStyle={{ fontSize: 11, borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        />
        <Legend
          verticalAlign="top"
          wrapperStyle={{ fontSize: 11 }}
          formatter={(value: any, entry: any) => {
            const pct = entry?.payload?.percentage ?? 0;
            return `${value} (${pct.toFixed(1)}%)`;
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
