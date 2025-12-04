import React from 'react';
import { UserState } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sun, Battery, Activity, Flame } from 'lucide-react';

interface DashboardProps {
  userState: UserState;
}

const Dashboard: React.FC<DashboardProps> = ({ userState }) => {
  const progressPercentage = Math.min(100, (userState.currentXp / userState.nextLevelXp) * 100);

  // Mock data for the chart if history is empty
  const chartData = userState.moodHistory.length > 0 
    ? userState.moodHistory 
    : [
        { date: '월', score: 3 },
        { date: '화', score: 4 },
        { date: '수', score: 2 },
        { date: '목', score: 5 },
        { date: '금', score: 6 },
        { date: '토', score: 5 },
        { date: '일', score: 7 },
      ];

  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">나의 성장 일지</h1>
        <p className="text-slate-500 text-sm">천천히, 조금씩 나아가고 있어요.</p>
      </header>

      {/* Level Card */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="inline-block px-2 py-1 bg-white/20 rounded-md text-xs font-medium mb-1 backdrop-blur-sm">
              Level {userState.level}
            </span>
            <h2 className="text-xl font-bold">새싹 여행자</h2>
          </div>
          <Sun className="w-8 h-8 text-yellow-300 opacity-80" />
        </div>
        
        <div className="mb-2 flex justify-between text-xs text-indigo-100">
          <span>XP {userState.currentXp}</span>
          <span>Next {userState.nextLevelXp}</span>
        </div>
        <div className="w-full bg-black/20 rounded-full h-2.5">
          <div 
            className="bg-white h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-2 text-slate-500 text-xs font-medium">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>연속 달성</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{userState.streak}일</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-2 text-slate-500 text-xs font-medium">
            <Battery className="w-4 h-4 text-green-500" />
            <span>오늘 에너지</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">충전 중</p>
        </div>
      </div>

      {/* Mood Chart */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex-1 min-h-[300px]">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-indigo-500" />
          <h3 className="font-bold text-slate-800">마음 날씨 기록</h3>
        </div>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12}} 
                dy={10}
              />
              <YAxis 
                hide 
                domain={[0, 10]} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#6366f1" 
                strokeWidth={3} 
                dot={{ fill: '#fff', stroke: '#6366f1', strokeWidth: 2, r: 4 }} 
                activeDot={{ r: 6, fill: '#6366f1' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center text-xs text-slate-400 mt-4">
          그래프가 낮아도 괜찮아요. 계속 기록하는 것이 중요해요.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;