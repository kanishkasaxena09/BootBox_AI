import React, { Suspense } from 'react';
import { FileText, BarChart3, Search, Brain, Mic, Mail, PenLine, Calculator, Link2, Globe, Timer, Languages, ClipboardList, Coins, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { ToolSkeleton } from '../../components/shared';

const ResumeBuilder = React.lazy(() => import('../career/ResumeBuilder'));
const AtsAudit = React.lazy(() => import('../career/AtsAudit'));
const JobSearch = React.lazy(() => import('../jobsearch/JobSearch'));
const CareerTest = React.lazy(() => import('../careertest/CareerTest'));
const InterviewPrep = React.lazy(() => import('../interviewprep/InterviewPrep'));
const EmailGen = React.lazy(() => import('../emailgen/EmailGen'));
const CoverLetter = React.lazy(() => import('../coverletter/CoverLetter'));
const SalaryCalc = React.lazy(() => import('../salarycalc/SalaryCalc'));
const LinkedInSuite = React.lazy(() => import('../linkedin/LinkedInSuite'));
const PortfolioBuilder = React.lazy(() => import('../portfolio/PortfolioBuilder'));
const NoticePeriodCalc = React.lazy(() => import('../noticeperiod/NoticePeriodCalc'));
const CorporateTranslator = React.lazy(() => import('../corporatetranslator/CorporateTranslator'));
const ResignationGenerator = React.lazy(() => import('../resignation/ResignationGenerator'));
const FreelanceRateCalc = React.lazy(() => import('../freelancerate/FreelanceRateCalc'));
const ExcuseGenerator = React.lazy(() => import('../excusegenerator/ExcuseGenerator'));

const subTools = [
  { id: 'resume', name: 'Resume Builder', icon: FileText, desc: 'Build AI-optimized resumes with live preview' },
  { id: 'ats', name: 'ATS Resume Audit', icon: BarChart3, desc: 'Check resume compatibility with job descriptions' },
  { id: 'jobsearch', name: 'Job Search', icon: Search, desc: 'Find jobs by keyword, location, salary & more' },
  { id: 'careertest', name: 'Career Test', icon: Brain, desc: 'Psychometric assessment for career guidance' },
  { id: 'interview', name: 'Interview Prep', icon: Mic, desc: 'AI questions, voice recording, mock interviews' },
  { id: 'emailgen', name: 'Email & LinkedIn', icon: Mail, desc: 'Generate cold emails, LinkedIn messages & more' },
  { id: 'coverletter', name: 'Cover Letter', icon: PenLine, desc: 'Generate tailored cover letters with live preview' },
  { id: 'salarycalc', name: 'Salary Calculator', icon: Calculator, desc: 'Estimate salary by role, location, experience & skills' },
  { id: 'linkedin', name: 'LinkedIn Suite', icon: Link2, desc: 'Headline, about, skills, posts, hashtags & profile optimization' },
  { id: 'portfolio', name: 'Portfolio Builder', icon: Globe, desc: 'Build a professional portfolio website with live preview & export' },
  { id: 'noticeperiod', name: 'Notice Period', icon: Timer, desc: 'Track notice period, calculate release date & view calendar' },
  { id: 'corporatetranslator', name: 'Corporate Translator', icon: Languages, desc: 'Transform between plain language and corporate speak with tone options' },
  { id: 'resignation', name: 'Resignation & Handover', icon: ClipboardList, desc: 'Generate resignation letters, notice mails, knowledge transfer & handover docs' },
  { id: 'freelancerate', name: 'Freelance Rate', icon: Coins, desc: 'Calculate ideal hourly, daily, weekly & monthly freelance rates with charts' },
  { id: 'excuses', name: 'Excuse Generator', icon: Wand2, desc: 'Generate perfect excuses for any work situation with multiple tones' },
];

const componentMap = {
  resume: ResumeBuilder,
  ats: AtsAudit,
  jobsearch: JobSearch,
  careertest: CareerTest,
  interview: InterviewPrep,
  emailgen: EmailGen,
  coverletter: CoverLetter,
  salarycalc: SalaryCalc,
  linkedin: LinkedInSuite,
  portfolio: PortfolioBuilder,
  noticeperiod: NoticePeriodCalc,
  corporatetranslator: CorporateTranslator,
  resignation: ResignationGenerator,
  freelancerate: FreelanceRateCalc,
  excuses: ExcuseGenerator,
};

const JobProfessionalRoles = ({ path, onNavigate }) => {
  const subId = path[1] || null;

  if (subId) {
    const ToolComponent = componentMap[subId];
    if (!ToolComponent) {
      return (
        <div className="glass-panel rounded-2xl p-12 border border-[var(--border)] flex flex-col items-center justify-center text-center space-y-3 min-h-[300px]">
          <p className="text-sm font-bold text-[var(--text-secondary)]">Tool not found</p>
        </div>
      );
    }
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
          Job & Professional Roles
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Resume, ATS, job search, career test, interview prep, email generator, salary calculator & LinkedIn suite.
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

export default JobProfessionalRoles;
