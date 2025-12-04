import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, RefreshCw, Trophy } from 'lucide-react';
import { Quest, GeneratedQuest } from '../types';
import { generateQuests } from '../services/geminiService';

interface QuestBoardProps {
  onCompleteQuest: (xp: number) => void;
  energyLevel: number;
}

const QuestBoard: React.FC<QuestBoardProps> = ({ onCompleteQuest, energyLevel }) => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMood, setSelectedMood] = useState('보통');

  const loadDailyQuests = async () => {
    setLoading(true);
    try {
      const generated: GeneratedQuest[] = await generateQuests(selectedMood, energyLevel);
      const newQuests: Quest[] = generated.map((q, i) => ({
        id: Date.now().toString() + i,
        title: q.title,
        description: q.description,
        difficulty: q.difficulty as 'EASY' | 'MEDIUM' | 'HARD',
        completed: false,
        xp: q.xp
      }));
      setQuests(newQuests);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load initial quests if empty
    if (quests.length === 0) {
      loadDailyQuests();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggle = (id: string) => {
    setQuests(prev => prev.map(q => {
      if (q.id === id && !q.completed) {
        onCompleteQuest(q.xp);
        return { ...q, completed: true };
      }
      return q;
    }));
  };

  return (
    <div className="flex flex-col h-full p-6 space-y-6 overflow-y-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">오늘의 작은 미션</h2>
          <p className="text-slate-500 text-sm mt-1">너무 무리하지 않아도 괜찮아요.</p>
        </div>
        <button 
          onClick={loadDailyQuests}
          disabled={loading}
          className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <label className="block text-sm font-medium text-slate-700 mb-2">지금 기분이 어떤가요?</label>
        <div className="flex gap-2 flex-wrap">
          {['피곤해요', '우울해요', '보통이에요', '의욕이 있어요', '불안해요'].map(mood => (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                selectedMood === mood 
                  ? 'bg-indigo-100 border-indigo-300 text-indigo-700 font-semibold' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-3 text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin" />
                <p>하루가 당신에게 맞는 미션을 고민 중이에요...</p>
            </div>
        ) : (
          quests.map((quest) => (
            <div 
              key={quest.id}
              onClick={() => handleToggle(quest.id)}
              className={`group flex items-center p-4 rounded-xl border transition-all cursor-pointer select-none ${
                quest.completed 
                  ? 'bg-slate-50 border-slate-100 opacity-60' 
                  : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="mr-4 text-indigo-500">
                {quest.completed ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <Circle className="w-6 h-6 text-slate-300 group-hover:text-indigo-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className={`font-medium ${quest.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                  {quest.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{quest.description}</p>
              </div>
              <div className="ml-2 flex items-center text-xs font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">
                <Trophy className="w-3 h-3 mr-1" />
                +{quest.xp}
              </div>
            </div>
          ))
        )}
      </div>

      {quests.length > 0 && quests.every(q => q.completed) && (
        <div className="mt-8 p-6 bg-indigo-50 rounded-2xl text-center animate-pulse">
          <Trophy className="w-12 h-12 text-indigo-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-indigo-800">모든 미션 완료!</h3>
          <p className="text-indigo-600 text-sm">정말 대단해요! 오늘 하루 큰 발걸음을 내디뎠네요.</p>
        </div>
      )}
    </div>
  );
};

export default QuestBoard;