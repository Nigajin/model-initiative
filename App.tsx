import React, { useState, useEffect } from 'react';
import { Home, ListTodo, MessageCircleHeart, Timer, Sparkles } from 'lucide-react';
import Dashboard from './components/Dashboard';
import QuestBoard from './components/QuestBoard';
import AICoach from './components/AICoach';
import FocusZone from './components/FocusZone';
import { AppView, UserState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [checkingKey, setCheckingKey] = useState(true);
  
  // Mock initial user state
  const [userState, setUserState] = useState<UserState>({
    level: 1,
    currentXp: 45,
    nextLevelXp: 100,
    streak: 3,
    moodHistory: [
      { date: '월', score: 4 },
      { date: '화', score: 5 },
      { date: '수', score: 3 },
      { date: '목', score: 6 },
      { date: '금', score: 5 },
    ],
  });

  useEffect(() => {
    const checkKey = async () => {
      // Check if window.aistudio exists and if key is selected
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(hasKey);
      } else {
        // Fallback for local dev or if aistudio is not injected
        if (process.env.API_KEY) {
            setHasApiKey(true);
        }
      }
      setCheckingKey(false);
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      try {
        await window.aistudio.openSelectKey();
        setHasApiKey(true);
      } catch (e) {
        console.error("Failed to select key", e);
        // If "Requested entity was not found" error occurs, retry might be needed by user
        alert("키 선택 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } else {
      alert("API Key 선택 기능을 사용할 수 없는 환경입니다.");
    }
  };

  const handleCompleteQuest = (xp: number) => {
    setUserState(prev => {
      let newXp = prev.currentXp + xp;
      let newLevel = prev.level;
      let nextXp = prev.nextLevelXp;

      if (newXp >= nextXp) {
        newLevel += 1;
        newXp = newXp - nextXp;
        nextXp = Math.floor(nextXp * 1.2);
        alert(`축하합니다! 레벨 ${newLevel}로 성장했어요! 🎉`);
      }

      return {
        ...prev,
        level: newLevel,
        currentXp: newXp,
        nextLevelXp: nextXp,
      };
    });
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard userState={userState} />;
      case AppView.QUESTS:
        return <QuestBoard onCompleteQuest={handleCompleteQuest} energyLevel={6} />;
      case AppView.COACH:
        return <AICoach />;
      case AppView.FOCUS:
        return <FocusZone />;
      default:
        return <Dashboard userState={userState} />;
    }
  };

  if (checkingKey) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!hasApiKey) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-10 h-10 text-indigo-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">HaruStep에 오신 것을 환영해요</h1>
          <p className="text-slate-600">
            당신의 작은 발걸음을 응원합니다.<br/>
            AI 코치 '하루'와 함께 시작해보세요.
          </p>
          <div className="pt-4">
            <button
              onClick={handleSelectKey}
              className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all transform hover:scale-[1.02] shadow-lg shadow-indigo-200"
            >
              Google API Key로 시작하기
            </button>
            <p className="text-xs text-slate-400 mt-4">
              AI 모델 사용을 위해 Google Cloud API Key가 필요합니다.
              <br />
              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-500">
                과금 정책 확인하기
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4 md:p-6 font-sans text-slate-800">
      <div className="w-full max-w-md h-[100dvh] sm:h-[85vh] bg-white sm:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden relative ring-8 ring-slate-900/5">
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden relative">
          {renderContent()}
        </main>

        {/* Bottom Navigation */}
        <nav className="h-20 bg-white border-t border-slate-100 px-6 pb-2 flex justify-between items-center z-10 shrink-0">
          <NavButton 
            active={currentView === AppView.DASHBOARD} 
            onClick={() => setCurrentView(AppView.DASHBOARD)}
            icon={<Home className="w-6 h-6" />}
            label="홈"
          />
          <NavButton 
            active={currentView === AppView.QUESTS} 
            onClick={() => setCurrentView(AppView.QUESTS)}
            icon={<ListTodo className="w-6 h-6" />}
            label="미션"
          />
          <div className="relative -top-6">
            <button 
              onClick={() => setCurrentView(AppView.COACH)}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-indigo-200 transition-transform hover:scale-105 active:scale-95 ${
                currentView === AppView.COACH ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white'
              }`}
            >
              <MessageCircleHeart className="w-7 h-7" />
            </button>
          </div>
          <NavButton 
            active={currentView === AppView.FOCUS} 
            onClick={() => setCurrentView(AppView.FOCUS)}
            icon={<Timer className="w-6 h-6" />}
            label="집중"
          />
          {/* Profile placeholder */}
          <button className="flex flex-col items-center justify-center w-12 text-slate-300">
            <div className="w-6 h-6 rounded-full bg-slate-200 mb-1"></div>
            <span className="text-[10px] font-medium">나</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-12 transition-colors duration-200 ${
      active ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
    }`}
  >
    <div className={`mb-1 ${active ? 'transform scale-110' : ''}`}>
      {icon}
    </div>
    <span className={`text-[10px] font-medium ${active ? 'font-bold' : ''}`}>
      {label}
    </span>
  </button>
);

export default App;
