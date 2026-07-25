import React, { Suspense } from 'react';
import { Calculator, Brain, Layers, LayoutTemplate, CalendarDays, ClipboardCheck, ClipboardList, MonitorPlay, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';
import AcademicCalculators from '../academic/AcademicCalculators';
import { ToolSkeleton } from '../../components/shared';

const StudyCompanion = React.lazy(() => import('../studycompanion/StudyCompanion'));
const FlashcardTool = React.lazy(() => import('../flashcards/FlashcardTool'));
const CoverPageGenerator = React.lazy(() => import('../coverpage/CoverPageGenerator'));
const StudyPlanner = React.lazy(() => import('../studyplanner/StudyPlannerTool'));
const AttendanceCalc = React.lazy(() => import('../attendancecalculator/AttendanceCalculator'));
const AssignmentTracker = React.lazy(() => import('../assignmenttracker/AssignmentTrackerTool'));
const Teleprompter = React.lazy(() => import('../teleprompter/Teleprompter'));
const TextHumanizer = React.lazy(() => import('../texthumanizer/TextHumanizer'));

const subTools = [
  { id: 'calculator', name: 'Academic Calculator', icon: Calculator, desc: 'CGPA to percentage & SGPA to CGPA estimator', component: AcademicCalculators },
  { id: 'study', name: 'AI Study Companion', icon: Brain, desc: 'Learn any topic with AI explanations, quizzes, memory tricks & more', component: StudyCompanion },
  { id: 'flashcards', name: 'Smart Flashcards', icon: Layers, desc: 'AI-powered flashcards with spaced repetition, quiz mode & progress tracking', component: FlashcardTool },
  { id: 'coverpage', name: 'Cover Page Generator', icon: LayoutTemplate, desc: 'Generate professional academic cover pages with live preview & PDF/DOCX export', component: CoverPageGenerator },
  { id: 'planner', name: 'Study Planner', icon: CalendarDays, desc: 'Plan semesters, track tasks, Pomodoro timer, streaks & progress charts', component: StudyPlanner },
  { id: 'attendance', name: 'Attendance Calculator', icon: ClipboardCheck, desc: 'Track attendance %, calculate required classes, skip planner & forecast charts', component: AttendanceCalc },
  { id: 'assignments', name: 'Assignment Tracker', icon: ClipboardList, desc: 'Track assignments with deadlines, reminders, attachments, calendar & progress charts', component: AssignmentTracker },
  { id: 'teleprompter', name: 'Web Teleprompter', icon: MonitorPlay, desc: 'Auto-scrolling script reader with voice control, mirror mode & fullscreen', component: Teleprompter },
  { id: 'humanizer', name: 'AI Text Humanizer', icon: Wand2, desc: 'Transform AI text into natural human writing with tone control & readability scores', component: TextHumanizer },
];

const AcademicProductivity = ({ path, onNavigate }) => {
  const subId = path[1] || null;

  if (subId) {
    const tool = subTools.find(t => t.id === subId);
    if (!tool) {
      return (
        <div className="glass-panel rounded-2xl p-12 border border-[var(--border)] flex flex-col items-center justify-center text-center space-y-3 min-h-[300px]">
          <p className="text-sm font-bold text-[var(--text-secondary)]">Tool not found</p>
        </div>
      );
    }
    const ToolComponent = tool.component;
    return (
      <Suspense fallback={<ToolSkeleton />}>
        <ToolComponent />
      </Suspense>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center md:text-left space-y-2">
        <h2 className="text-2xl font-black bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
          Academic & Productivity
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          CGPA calculators, SGPA estimators & academic tools.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <motion.div key={tool.id} whileHover={{ y: -4 }}
              onClick={() => onNavigate(tool.id)}
              className="card-hover-border glass-panel border border-[var(--border-color)] p-6 rounded-2xl cursor-pointer transition-all flex flex-col text-left space-y-3 shadow-sm">
              <div className="p-3 bg-pink-500/10 rounded-xl w-fit">
                <Icon className="h-5 w-5 text-pink-500" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--text-primary)]">{tool.name}</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1">{tool.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AcademicProductivity;
