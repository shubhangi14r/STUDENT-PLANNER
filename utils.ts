import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Calendar as CalendarIcon, 
  FileText, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Bell,
  Trash2,
  X,
  MoreVertical,
  Clock,
  CheckCircle2,
  Circle,
  Sparkles,
  ListTodo,
  Library,
  ArrowRight,
  Plane,
  Rocket,
  Wind,
  Home,
  Edit3,
  GraduationCap,
  Trophy,
  Activity,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  isToday,
  parseISO
} from 'date-fns';
import Markdown from 'react-markdown';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Note, Reminder, View, Todo, Subject, User, WeeklyGoal, Deadline, AcademicRecord, WeeklyReview } from './types';
import { cn } from './utils';

// --- Components ---

const Sidebar = ({ 
  currentView, 
  setView, 
  subjects, 
  activeSubjectId, 
  setActiveSubjectId,
  todos,
  weeklyReviews
}: { 
  currentView: View, 
  setView: (v: View) => void,
  subjects: Subject[],
  activeSubjectId: string | null,
  setActiveSubjectId: (id: string | null) => void,
  todos: Todo[],
  weeklyReviews: WeeklyReview[]
}) => {
  const upcomingTasks = todos.filter(t => !t.completed).slice(0, 5);
  
  // Check if current week review exists
  const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 }).getTime();
  const hasCurrentWeekReview = weeklyReviews.some(r => isSameDay(r.weekStarting, startOfCurrentWeek));

  return (
    <div className="w-64 h-screen bg-white/5 backdrop-blur-md border-r border-white/10 flex flex-col p-4 gap-6 overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-2 px-2 mb-2">
        <div className="w-8 h-8 bento-card-pink rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-pink-500/20">NF</div>
        <span className="font-bold text-sm tracking-tight text-white">NotionFlow</span>
      </div>

      <div className="flex flex-col gap-1">
        <button 
          onClick={() => { setView('library'); setActiveSubjectId(null); }}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all duration-200",
            currentView === 'library' ? "bg-white/20 notion-shadow font-bold text-white" : "hover:bg-white/10 text-blue-200"
          )}
        >
          <Library size={16} className={currentView === 'library' ? "text-pink-400" : ""} />
          Dashboard
        </button>
        <button 
          onClick={() => setView('calendar')}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all duration-200",
            currentView === 'calendar' ? "bg-white/20 notion-shadow font-bold text-white" : "hover:bg-white/10 text-blue-200"
          )}
        >
          <CalendarIcon size={16} className={currentView === 'calendar' ? "text-purple-400" : ""} />
          Calendar
        </button>
        <button 
          onClick={() => setView('todos')}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all duration-200",
            currentView === 'todos' ? "bg-white/20 notion-shadow font-bold text-white" : "hover:bg-white/10 text-blue-200"
          )}
        >
          <ListTodo size={16} className={currentView === 'todos' ? "text-indigo-400" : ""} />
          Daily Tasks
        </button>
        <button 
          onClick={() => setView('academics-tracker')}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all duration-200",
            currentView === 'academics-tracker' ? "bg-white/20 notion-shadow font-bold text-white" : "hover:bg-white/10 text-blue-200"
          )}
        >
          <GraduationCap size={16} className={currentView === 'academics-tracker' ? "text-green-400" : ""} />
          Academics
        </button>
        <button 
          onClick={() => setView('weekly-review')}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all duration-200 relative",
            currentView === 'weekly-review' ? "bg-white/20 notion-shadow font-bold text-white" : "hover:bg-white/10 text-blue-200"
          )}
        >
          <Sparkles size={16} className={currentView === 'weekly-review' ? "text-yellow-400" : ""} />
          Weekly Review
          {!hasCurrentWeekReview && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)] animate-pulse" />
          )}
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <div className="px-3 text-[10px] font-bold text-blue-400 uppercase tracking-[0.1em] mb-1 flex items-center gap-2">
          <Clock size={10} />
          Upcoming Tasks
        </div>
        {upcomingTasks.length === 0 ? (
          <div className="px-3 py-2 text-xs text-blue-300/50 italic">No pending tasks</div>
        ) : (
          upcomingTasks.map(task => (
            <div key={task.id} className="px-3 py-1.5 text-xs text-blue-200 truncate flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-pink-400 shrink-0" />
              {task.text}
            </div>
          ))
        )}
      </div>

      <div className="flex flex-col gap-1">
        <div className="px-3 text-[10px] font-bold text-blue-400 uppercase tracking-[0.1em] mb-1 flex items-center gap-2">
          <Sparkles size={10} />
          Subjects
        </div>
        {subjects.map(subject => (
          <button 
            key={subject.id}
            onClick={() => { setView('subject-detail'); setActiveSubjectId(subject.id); }}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors text-left truncate",
              activeSubjectId === subject.id ? "bg-white/20 text-white font-semibold" : "hover:bg-white/10 text-blue-200"
            )}
          >
            <span className={cn("w-2 h-2 rounded-full", subject.color === 'pink' ? 'bg-pink-400' : subject.color === 'blue' ? 'bg-blue-400' : 'bg-slate-400')} />
            {subject.name}
          </button>
        ))}
      </div>
    </div>
  );
};

const SignUpPage = ({ onSignUp }: { onSignUp: (user: User) => void }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      onSignUp({ name, email });
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#051937] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bento-card-pink rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-pink-500/20 mx-auto mb-4">NF</div>
          <h1 className="text-3xl font-black text-white tracking-tight">Welcome to NotionFlow</h1>
          <p className="text-blue-300 mt-2">Start your journey to productivity.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
            <input 
              required
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-pink-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-pink-500 transition-all"
            />
          </div>
          <button 
            type="submit"
            className="w-full bento-card-pink py-4 rounded-2xl text-white font-bold text-lg shadow-xl shadow-pink-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Create Account
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const NoteEditor = ({ 
  note, 
  onUpdate, 
  onClose,
  onDelete
}: { 
  note: Note, 
  onUpdate: (n: Note) => void, 
  onClose: () => void,
  onDelete: (id: string) => void
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [subject, setSubject] = useState(note.subject);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setSubject(note.subject);
  }, [note]);

  const handleSave = () => {
    onUpdate({ ...note, title, content, subject, updatedAt: Date.now() });
    setIsEditing(false);
  };

  return (
    <div className="flex-1 h-screen flex flex-col bg-white overflow-hidden">
      <div className="h-12 border-b border-[#EDECE9] flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="p-1 hover:bg-[#F1F1EF] rounded text-[#787774]">
            <ChevronLeft size={20} />
          </button>
          <span className="text-xs text-[#787774] font-medium">Notes / {subject || 'Untitled'}</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="px-3 py-1 text-xs font-medium hover:bg-[#F1F1EF] rounded transition-colors"
          >
            {isEditing ? 'Preview' : 'Edit'}
          </button>
          <button 
            onClick={() => onDelete(note.id)}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-12 max-w-3xl mx-auto w-full">
        {isEditing ? (
          <div className="flex flex-col gap-6">
            <input 
              type="text" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject..."
              className="text-sm text-[#787774] outline-none border-b border-transparent focus:border-[#EDECE9] pb-1"
            />
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled"
              className="text-4xl font-bold outline-none placeholder:text-[#EDECE9]"
            />
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing..."
              className="min-h-[400px] text-lg outline-none resize-none placeholder:text-[#EDECE9]"
              onBlur={handleSave}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="text-sm text-[#787774] font-medium uppercase tracking-wider">{subject || 'No Subject'}</div>
            <h1 className="text-4xl font-bold">{title || 'Untitled'}</h1>
            <div className="markdown-body">
              <Markdown>{content || '_No content yet. Click edit to start writing._'}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CalendarView = ({ 
  reminders, 
  onAddReminder,
  onDeleteReminder,
  onToggleReminder
}: { 
  reminders: Reminder[], 
  onAddReminder: (r: Omit<Reminder, 'id' | 'notified' | 'isCompleted'>) => void,
  onDeleteReminder: (id: string) => void,
  onToggleReminder: (id: string) => void
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newReminder, setNewReminder] = useState({ title: '', description: '', time: '12:00' });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const remindersForSelectedDate = reminders.filter(r => isSameDay(new Date(r.dateTime), selectedDate));

  const handleSaveReminder = () => {
    if (!newReminder.title) return;
    const [hours, minutes] = newReminder.time.split(':').map(Number);
    const reminderDate = new Date(selectedDate);
    reminderDate.setHours(hours, minutes, 0, 0);
    
    onAddReminder({
      title: newReminder.title,
      description: newReminder.description,
      dateTime: reminderDate.getTime()
    });
    setShowAddModal(false);
    setNewReminder({ title: '', description: '', time: '12:00' });
  };

  return (
    <div className="flex-1 h-screen flex bg-white overflow-hidden">
      <div className="flex-1 flex flex-col border-r border-[#EDECE9]">
        <div className="h-12 border-b border-[#EDECE9] flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-sm">{format(currentDate, 'MMMM yyyy')}</span>
            <div className="flex items-center gap-1">
              <button onClick={handlePrevMonth} className="p-1 hover:bg-[#F1F1EF] rounded text-[#787774]">
                <ChevronLeft size={16} />
              </button>
              <button onClick={handleNextMonth} className="p-1 hover:bg-[#F1F1EF] rounded text-[#787774]">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <button 
            onClick={() => setCurrentDate(new Date())}
            className="px-2 py-1 text-xs font-medium hover:bg-[#F1F1EF] rounded border border-[#EDECE9]"
          >
            Today
          </button>
        </div>

        <div className="grid grid-cols-7 border-b border-[#EDECE9] bg-[#F7F7F5]">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-2 text-center text-[10px] font-bold text-[#787774] uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-7 auto-rows-fr overflow-y-auto">
          {calendarDays.map(day => {
            const dayReminders = reminders.filter(r => isSameDay(new Date(r.dateTime), day));
            return (
              <div 
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "min-h-[100px] p-2 border-r border-b border-[#EDECE9] cursor-pointer transition-colors",
                  !isSameMonth(day, monthStart) ? "bg-[#FBFBFA] text-[#D3D2CE]" : "hover:bg-[#F7F7F5]",
                  isSameDay(day, selectedDate) && "bg-blue-50/30"
                )}
              >
                <div className="flex justify-between items-start">
                  <span className={cn(
                    "text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full",
                    isToday(day) ? "bg-red-500 text-white" : ""
                  )}>
                    {format(day, 'd')}
                  </span>
                  {dayReminders.length > 0 && (
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  )}
                </div>
                <div className="mt-1 flex flex-col gap-0.5">
                  {dayReminders.slice(0, 3).map(r => (
                    <div 
                      key={r.id} 
                      className={cn(
                        "text-[10px] truncate px-1 rounded",
                        r.isCompleted ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      )}
                    >
                      {format(new Date(r.dateTime), 'HH:mm')} {r.title}
                    </div>
                  ))}
                  {dayReminders.length > 3 && (
                    <div className="text-[10px] text-[#787774] px-1">+{dayReminders.length - 3} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-80 flex flex-col bg-[#F7F7F5]">
        <div className="h-12 border-b border-[#EDECE9] flex items-center px-4 justify-between">
          <span className="text-xs font-bold text-[#787774] uppercase tracking-wider">
            {format(selectedDate, 'EEE, MMM d')}
          </span>
          <button 
            onClick={() => setShowAddModal(true)}
            className="p-1 hover:bg-[#EBEBE8] rounded text-[#787774]"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {remindersForSelectedDate.length === 0 ? (
            <div className="text-center py-12 text-[#787774] text-sm italic">
              No reminders for this day
            </div>
          ) : (
            remindersForSelectedDate.map(r => (
              <div key={r.id} className="bg-white p-3 rounded-lg notion-shadow border border-[#EDECE9] group">
                <div className="flex justify-between items-start">
                  <div className={cn(
                    "flex items-center gap-2 mb-1",
                    r.isCompleted ? "text-green-600" : "text-red-600"
                  )}>
                    <Clock size={14} />
                    <span className="text-xs font-bold">{format(new Date(r.dateTime), 'HH:mm')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => onToggleReminder(r.id)}
                      className={cn(
                        "p-1 rounded transition-all",
                        r.isCompleted ? "text-green-500 hover:bg-green-50" : "text-red-400 hover:bg-red-50"
                      )}
                    >
                      {r.isCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                    </button>
                    <button 
                      onClick={() => onDeleteReminder(r.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 text-red-400 rounded transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <h4 className={cn(
                  "text-sm font-semibold",
                  r.isCompleted && "line-through text-[#787774]"
                )}>{r.title}</h4>
                {r.description && <p className="text-xs text-[#787774] mt-1">{r.description}</p>}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Reminder Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-xl notion-shadow overflow-hidden"
            >
              <div className="p-6 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">New Reminder</h3>
                  <button onClick={() => setShowAddModal(false)} className="text-[#787774] hover:bg-[#F1F1EF] p-1 rounded">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-[#787774] uppercase tracking-wider">Title</label>
                  <input 
                    autoFocus
                    type="text" 
                    value={newReminder.title}
                    onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                    placeholder="What needs to be done?"
                    className="w-full px-3 py-2 bg-[#F7F7F5] border border-[#EDECE9] rounded-md outline-none focus:border-blue-400 transition-colors"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-[#787774] uppercase tracking-wider">Date</label>
                    <div className="px-3 py-2 bg-[#F7F7F5] border border-[#EDECE9] rounded-md text-sm text-[#787774]">
                      {format(selectedDate, 'MMM d, yyyy')}
                    </div>
                  </div>
                  <div className="w-32 flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-[#787774] uppercase tracking-wider">Time</label>
                    <input 
                      type="time" 
                      value={newReminder.time}
                      onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
                      className="w-full px-3 py-2 bg-[#F7F7F5] border border-[#EDECE9] rounded-md outline-none focus:border-blue-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-[#787774] uppercase tracking-wider">Description (Optional)</label>
                  <textarea 
                    value={newReminder.description}
                    onChange={(e) => setNewReminder({...newReminder, description: e.target.value})}
                    placeholder="Add more details..."
                    className="w-full px-3 py-2 bg-[#F7F7F5] border border-[#EDECE9] rounded-md outline-none focus:border-blue-400 transition-colors resize-none h-24"
                  />
                </div>

                <button 
                  onClick={handleSaveReminder}
                  className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors mt-2"
                >
                  Set Reminder
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TodoView = ({ 
  todos, 
  onAddTodo, 
  onToggleTodo, 
  onDeleteTodo 
}: { 
  todos: Todo[], 
  onAddTodo: (text: string) => void, 
  onToggleTodo: (id: string) => void, 
  onDeleteTodo: (id: string) => void 
}) => {
  const [newTodo, setNewTodo] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      onAddTodo(newTodo.trim());
      setNewTodo('');
    }
  };

  const completedCount = todos.filter(t => t.completed).length;
  const progress = todos.length > 0 ? (completedCount / todos.length) * 100 : 0;

  return (
    <div className="flex-1 h-screen flex flex-col bg-[#FBFBFA] overflow-hidden">
      <div className="h-12 border-b border-[#EDECE9] flex items-center px-6 bg-white">
        <h2 className="text-sm font-bold text-[#787774] uppercase tracking-wider flex items-center gap-2">
          <ListTodo size={14} className="text-pink-500" />
          Daily Tasks
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-12 max-w-2xl mx-auto w-full">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-extrabold tracking-tight">Today's Focus</h1>
            <span className="text-sm font-bold text-pink-500 bg-pink-50 px-3 py-1 rounded-full">
              {format(new Date(), 'MMMM d, yyyy')}
            </span>
          </div>
          
          <div className="bg-white p-6 rounded-2xl notion-shadow border border-[#EDECE9] mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-[#787774] uppercase tracking-wider">Daily Progress</span>
              <span className="text-xs font-bold text-indigo-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full fun-gradient"
              />
            </div>
          </div>

          <form onSubmit={handleAdd} className="relative mb-8">
            <input 
              type="text" 
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="What's on your mind today?"
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl notion-shadow border border-transparent focus:border-indigo-400 outline-none transition-all text-lg"
            />
            <Plus className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" size={24} />
            <button 
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors"
            >
              Add Task
            </button>
          </form>

          <div className="flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
              {todos.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 text-[#787774] italic"
                >
                  No tasks for today. Start fresh!
                </motion.div>
              ) : (
                todos.map(todo => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={todo.id}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl border transition-all group",
                      todo.completed 
                        ? "bg-green-50 border-green-200 opacity-90" 
                        : "bg-red-50 border-red-200 opacity-90"
                    )}
                  >
                    <button 
                      onClick={() => onToggleTodo(todo.id)}
                      className={cn(
                        "transition-colors",
                        todo.completed ? "text-green-500" : "text-red-400 hover:text-red-600"
                      )}
                    >
                      {todo.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                    </button>
                    <span className={cn(
                      "flex-1 text-lg transition-all",
                      todo.completed ? "line-through text-green-700" : "text-red-700"
                    )}>
                      {todo.text}
                    </span>
                    <button 
                      onClick={() => onDeleteTodo(todo.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:bg-red-100 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const AcademicsTrackerView = ({ 
  subjects, 
  records, 
  onUpdateRecord 
}: { 
  subjects: Subject[], 
  records: AcademicRecord[], 
  onUpdateRecord: (record: Partial<AcademicRecord> & { subjectId: string }) => void 
}) => {
  return (
    <div className="flex-1 h-screen flex flex-col bg-[#051937] overflow-hidden">
      <div className="h-12 border-b border-white/10 flex items-center px-6 bg-white/10 backdrop-blur-md">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <GraduationCap size={14} className="text-green-400" />
          Academics Tracker
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-black text-white tracking-tighter mb-4">Academics Tracker</h1>
            <p className="text-blue-300 text-lg">Monitor your grades, targets, and study progress across all subjects.</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {subjects.map(subject => {
              const record = records.find(r => r.subjectId === subject.id) || {
                subjectId: subject.id,
                grade: '-',
                targetGrade: '-',
                studyHours: 0
              };

              return (
                <div key={subject.id} className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[32px] p-8 flex flex-col md:flex-row items-center gap-8 group hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center text-white",
                      subject.color === 'pink' ? 'bg-pink-500' : subject.color === 'blue' ? 'bg-blue-500' : 'bg-slate-500'
                    )}>
                      {subject.icon === 'rocket' ? <Rocket size={24} /> : <FileText size={24} />}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{subject.name}</h3>
                      <p className="text-blue-400 text-sm font-medium uppercase tracking-widest">Academic Record</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-8 w-full md:w-auto">
                    <div className="text-center">
                      <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-1">Current Grade</p>
                      <input 
                        type="text"
                        value={record.grade}
                        onChange={(e) => onUpdateRecord({ subjectId: subject.id, grade: e.target.value })}
                        className="bg-white/10 border border-white/10 rounded-xl w-16 py-2 text-center text-white font-bold text-xl outline-none focus:border-green-400"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-1">Target Grade</p>
                      <input 
                        type="text"
                        value={record.targetGrade}
                        onChange={(e) => onUpdateRecord({ subjectId: subject.id, targetGrade: e.target.value })}
                        className="bg-white/10 border border-white/10 rounded-xl w-16 py-2 text-center text-white font-bold text-xl outline-none focus:border-blue-400"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-1">Study Hours</p>
                      <input 
                        type="number"
                        value={record.studyHours}
                        onChange={(e) => onUpdateRecord({ subjectId: subject.id, studyHours: Number(e.target.value) })}
                        className="bg-white/10 border border-white/10 rounded-xl w-16 py-2 text-center text-white font-bold text-xl outline-none focus:border-yellow-400"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const WeeklyReviewView = ({ 
  goals, 
  onAddGoal, 
  onToggleGoal,
  onDeleteGoal,
  deadlines,
  onAddDeadline,
  onDeleteDeadline,
  reviews,
  selectedReviewId,
  onSelectReview,
  onUpdateReview,
  onAddReview
}: { 
  goals: WeeklyGoal[], 
  onAddGoal: (text: string) => void,
  onToggleGoal: (id: string) => void,
  onDeleteGoal: (id: string) => void,
  deadlines: Deadline[],
  onAddDeadline: (title: string, date: number) => void,
  onDeleteDeadline: (id: string) => void,
  reviews: WeeklyReview[],
  selectedReviewId: string | null,
  onSelectReview: (id: string) => void,
  onUpdateReview: (id: string, data: Partial<WeeklyReview>) => void,
  onAddReview: () => void
}) => {
  const [newGoal, setNewGoal] = useState('');
  const [newDeadlineTitle, setNewDeadlineTitle] = useState('');
  const [newDeadlineDate, setNewDeadlineDate] = useState('');
  const [newWin, setNewWin] = useState('');
  const [newMiss, setNewMiss] = useState('');
  const [newProject, setNewProject] = useState('');

  const activeReview = reviews.find(r => r.id === selectedReviewId) || reviews[0];

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.trim()) {
      onAddGoal(newGoal.trim());
      setNewGoal('');
    }
  };

  const handleAddDeadline = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDeadlineTitle.trim() && newDeadlineDate) {
      onAddDeadline(newDeadlineTitle.trim(), new Date(newDeadlineDate).getTime());
      setNewDeadlineTitle('');
      setNewDeadlineDate('');
    }
  };

  const handleAddWin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWin.trim() && activeReview) {
      onUpdateReview(activeReview.id, { wins: [...activeReview.wins, newWin.trim()] });
      setNewWin('');
    }
  };

  const handleAddMiss = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMiss.trim() && activeReview) {
      onUpdateReview(activeReview.id, { misses: [...activeReview.misses, newMiss.trim()] });
      setNewMiss('');
    }
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProject.trim() && activeReview) {
      onUpdateReview(activeReview.id, { projects: [...activeReview.projects, newProject.trim()] });
      setNewProject('');
    }
  };

  // Monthly stats
  const currentMonthReviews = [...reviews]
    .filter(r => isSameMonth(r.weekStarting, new Date()))
    .sort((a, b) => a.weekStarting - b.weekStarting);
    
  const monthlyStudyHours = currentMonthReviews.reduce((acc, r) => acc + r.studyHours, 0);
  const monthlyWorkouts = currentMonthReviews.reduce((acc, r) => acc + r.workouts, 0);

  const chartData = currentMonthReviews.map(r => ({
    name: format(r.weekStarting, 'MMM d'),
    study: r.studyHours,
    workouts: r.workouts
  }));

  // Check if current week review exists
  const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 }).getTime();
  const hasCurrentWeekReview = reviews.some(r => isSameDay(r.weekStarting, startOfCurrentWeek));

  return (
    <div className="flex-1 h-screen flex flex-col bg-[#051937] overflow-hidden">
      <div className="h-12 border-b border-white/10 flex items-center px-6 bg-white/10 backdrop-blur-md justify-between">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Sparkles size={14} className="text-yellow-400" />
          Weekly Review
        </h2>
        <button 
          onClick={onAddReview}
          className={cn(
            "px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
            hasCurrentWeekReview 
              ? "bg-white/10 text-blue-200 hover:bg-white/20" 
              : "bg-yellow-400 text-blue-900 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20 animate-pulse"
          )}
        >
          <Plus size={14} />
          {hasCurrentWeekReview ? "Add Another Week" : "Start Current Week"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-5xl font-black text-white tracking-tighter mb-4">Weekly Review</h1>
              <p className="text-blue-300 text-lg">Reflect on your progress and set goals for the week ahead.</p>
              
              <div className="mt-8 flex gap-8">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex-1">
                  <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-1">Monthly Study</p>
                  <p className="text-3xl font-black text-white">{monthlyStudyHours}h</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex-1">
                  <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-1">Monthly Workouts</p>
                  <p className="text-3xl font-black text-white">{monthlyWorkouts}</p>
                </div>
              </div>
            </div>
            
            {/* Monthly Trends Chart */}
            <div className="lg:w-[400px] bg-white/5 border border-white/10 rounded-[40px] p-6 h-[240px]">
              <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-4">Monthly Trends</p>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#60a5fa" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff20', borderRadius: '12px' }}
                      itemStyle={{ fontSize: '12px' }}
                    />
                    <Bar dataKey="study" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="workouts" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-blue-300/30 italic text-sm">
                  Add more weeks to see trends
                </div>
              )}
            </div>
          </div>

          {/* Week Selector */}
          <div className="flex gap-2 mb-12 overflow-x-auto pb-2 custom-scrollbar">
            {[...reviews].sort((a, b) => b.weekStarting - a.weekStarting).map(review => (
              <button
                key={review.id}
                onClick={() => onSelectReview(review.id)}
                className={cn(
                  "px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap border",
                  (selectedReviewId === review.id || (!selectedReviewId && review.id === reviews[0]?.id))
                    ? "bg-yellow-400 text-blue-900 border-yellow-400 shadow-lg shadow-yellow-400/20" 
                    : "bg-white/5 text-blue-200 border-white/10 hover:bg-white/10"
                )}
              >
                Week of {format(review.weekStarting, 'MMM d')}
              </button>
            ))}
          </div>

          {activeReview ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* ✅ Wins Section */}
                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[40px] p-8">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Trophy className="text-green-400" />
                    ✅ Wins
                  </h3>
                  <p className="text-blue-300 text-sm mb-4">What went well (3–4 points)</p>
                  <form onSubmit={handleAddWin} className="flex gap-2 mb-4">
                    <input 
                      type="text" 
                      value={newWin}
                      onChange={(e) => setNewWin(e.target.value)}
                      placeholder="Add a win..."
                      className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-green-400"
                    />
                    <button type="submit" className="bg-green-400 text-blue-900 px-4 py-2 rounded-xl font-bold hover:bg-green-300 transition-colors">
                      <Plus size={20} />
                    </button>
                  </form>
                  <div className="space-y-2">
                    {activeReview.wins.map((win, i) => (
                      <div key={i} className="flex items-center gap-2 text-white bg-white/5 p-2 rounded-lg border border-white/5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        {win}
                      </div>
                    ))}
                  </div>
                </div>

                {/* ❌ Misses Section */}
                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[40px] p-8">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <X className="text-red-400" />
                    ❌ Misses
                  </h3>
                  <p className="text-blue-300 text-sm mb-4">What didn’t go well</p>
                  <form onSubmit={handleAddMiss} className="flex gap-2 mb-4">
                    <input 
                      type="text" 
                      value={newMiss}
                      onChange={(e) => setNewMiss(e.target.value)}
                      placeholder="Add a miss..."
                      className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-red-400"
                    />
                    <button type="submit" className="bg-red-400 text-white px-4 py-2 rounded-xl font-bold hover:bg-red-300 transition-colors">
                      <Plus size={20} />
                    </button>
                  </form>
                  <div className="space-y-2">
                    {activeReview.misses.map((miss, i) => (
                      <div key={i} className="flex items-center gap-2 text-white bg-white/5 p-2 rounded-lg border border-white/5">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                        {miss}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 📊 Progress Section */}
                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[40px] p-8">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Activity className="text-blue-400" />
                    📊 Progress
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-blue-300 text-sm block mb-1">Study hours</label>
                      <input 
                        type="number" 
                        value={activeReview.studyHours}
                        onChange={(e) => onUpdateReview(activeReview.id, { studyHours: Number(e.target.value) })}
                        className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="text-blue-300 text-sm block mb-1">Workouts / Steps</label>
                      <input 
                        type="number" 
                        value={activeReview.workouts}
                        onChange={(e) => onUpdateReview(activeReview.id, { workouts: Number(e.target.value) })}
                        className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="text-blue-300 text-sm block mb-1">Projects worked on</label>
                      <form onSubmit={handleAddProject} className="flex gap-2 mb-2">
                        <input 
                          type="text" 
                          value={newProject}
                          onChange={(e) => setNewProject(e.target.value)}
                          placeholder="Add project..."
                          className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-400"
                        />
                        <button type="submit" className="bg-blue-400 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-300 transition-colors">
                          <Plus size={20} />
                        </button>
                      </form>
                      <div className="flex flex-wrap gap-2">
                        {activeReview.projects.map((p, i) => (
                          <span key={i} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs border border-blue-500/30">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 🎯 Goal Check Section */}
                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[40px] p-8">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Target className="text-yellow-400" />
                    🎯 Goal Check
                  </h3>
                  <p className="text-blue-300 text-sm mb-4">Completed / Not completed goals</p>
                  <div className="space-y-3">
                    {goals.length === 0 ? (
                      <p className="text-blue-300/50 italic text-sm">No goals set for this week</p>
                    ) : (
                      goals.map(goal => (
                        <div key={goal.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10">
                          <div className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center",
                            goal.completed ? "bg-green-400 text-blue-900" : "border-2 border-white/20"
                          )}>
                            {goal.completed && <CheckCircle2 size={14} />}
                          </div>
                          <span className={cn("flex-1 text-white", goal.completed && "line-through opacity-50")}>
                            {goal.text}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[40px] p-8 mb-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Edit3 className="text-pink-400" />
                  Reflections
                </h3>
                <textarea 
                  value={activeReview.reflections}
                  onChange={(e) => onUpdateReview(activeReview.id, { reflections: e.target.value })}
                  placeholder="What went well this week? What could be improved?"
                  className="w-full h-64 bg-white/10 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-pink-400 resize-none"
                />
              </div>

              <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[40px] p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Clock className="text-pink-400" />
                  ⏳ Upcoming Deadlines
                </h3>
                
                <form onSubmit={handleAddDeadline} className="space-y-3 mb-6">
                  <input 
                    type="text" 
                    value={newDeadlineTitle}
                    onChange={(e) => setNewDeadlineTitle(e.target.value)}
                    placeholder="Deadline title..."
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-pink-400"
                  />
                  <div className="flex gap-2">
                    <input 
                      type="date" 
                      value={newDeadlineDate}
                      onChange={(e) => setNewDeadlineDate(e.target.value)}
                      className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-pink-400"
                    />
                    <button type="submit" className="bg-pink-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-pink-400 transition-colors">
                      <Plus size={20} />
                    </button>
                  </div>
                </form>

                <div className="space-y-3">
                  {deadlines.map(deadline => (
                    <div key={deadline.id} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/10 group">
                      <div className="flex flex-col">
                        <span className="text-white font-bold">{deadline.title}</span>
                        <span className="text-blue-400 text-xs">{format(deadline.date, 'MMM d, yyyy')}</span>
                      </div>
                      <button onClick={() => onDeleteDeadline(deadline.id)} className="opacity-0 group-hover:opacity-100 text-red-400">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-blue-300">
              <Sparkles size={64} className="text-yellow-400 mb-4" />
              <p className="text-xl font-bold">No weekly reviews yet</p>
              <button 
                onClick={onAddReview}
                className="mt-4 bg-yellow-400 text-blue-900 px-6 py-2 rounded-xl font-bold hover:bg-yellow-300 transition-colors"
              >
                Create First Review
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LibraryView = ({ 
  subjects, 
  onSelectSubject,
  onRenameSubject,
  onDeleteSubject,
  onAddSubject,
  todos,
  weeklyGoals,
  deadlines
}: { 
  subjects: Subject[], 
  onSelectSubject: (id: string) => void,
  onRenameSubject: (id: string, newName: string) => void,
  onDeleteSubject: (id: string) => void,
  onAddSubject: () => void,
  todos: Todo[],
  weeklyGoals: WeeklyGoal[],
  deadlines: Deadline[]
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const upcomingTasks = todos.filter(t => !t.completed).slice(0, 3);
  const todaysTasks = todos.filter(t => isToday(t.createdAt));

  return (
    <div className="flex-1 h-screen overflow-y-auto p-12 bg-[#051937]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-black text-white tracking-tighter mb-2">Dashboard</h1>
            <p className="text-blue-300 font-medium">Welcome back! Here's your overview for today.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Today's Tasks */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[40px] p-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <ListTodo className="text-indigo-400" size={20} />
              Today’s Tasks
            </h3>
            <div className="space-y-3">
              {todaysTasks.length === 0 ? (
                <p className="text-blue-300/50 italic text-sm">No tasks for today</p>
              ) : (
                todaysTasks.slice(0, 4).map(task => (
                  <div key={task.id} className="flex items-center gap-2 text-blue-200 text-sm">
                    <div className={cn("w-1.5 h-1.5 rounded-full", task.completed ? "bg-green-400" : "bg-red-400")} />
                    <span className={task.completed ? "line-through opacity-50" : ""}>{task.text}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Weekly Goals */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[40px] p-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="text-yellow-400" size={20} />
              🎯 Weekly Goals
            </h3>
            <div className="space-y-3">
              {weeklyGoals.length === 0 ? (
                <p className="text-blue-300/50 italic text-sm">No goals set for this week</p>
              ) : (
                weeklyGoals.slice(0, 4).map(goal => (
                  <div key={goal.id} className="flex items-center gap-2 text-blue-200 text-sm">
                    <div className={cn("w-1.5 h-1.5 rounded-full", goal.completed ? "bg-green-400" : "bg-yellow-400")} />
                    <span className={goal.completed ? "line-through opacity-50" : ""}>{goal.text}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[40px] p-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="text-pink-400" size={20} />
              ⏳ Upcoming Deadlines
            </h3>
            <div className="space-y-3">
              {deadlines.length === 0 ? (
                <p className="text-blue-300/50 italic text-sm">No upcoming deadlines</p>
              ) : (
                deadlines.slice(0, 4).map(deadline => (
                  <div key={deadline.id} className="flex flex-col gap-0.5">
                    <span className="text-white text-sm font-bold">{deadline.title}</span>
                    <span className="text-blue-400 text-[10px] uppercase font-bold tracking-wider">
                      {format(deadline.date, 'MMM d')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-black text-white tracking-tight mb-6">My Library</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Static Header Card */}
            <div className="bento-card bento-card-white h-[200px]">
              <div className="text-center mt-4">
                <h2 className="text-2xl font-black tracking-[0.2em] leading-tight">NOTION<br/>FLOW</h2>
              </div>
              <div className="bento-arrow">
                <Sparkles size={20} />
              </div>
            </div>

            {subjects.map((subject, index) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => editingId !== subject.id && onSelectSubject(subject.id)}
                className={cn(
                  "bento-card group relative",
                  subject.color === 'pink' ? 'bento-card-pink' : subject.color === 'blue' ? 'bento-card-blue' : 'bento-card-white',
                  index % 4 === 0 ? 'md:col-span-2' : 'md:col-span-1',
                  index % 3 === 0 ? 'h-[300px]' : 'h-[200px]'
                )}
              >
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(subject.id);
                      setEditName(subject.name);
                    }}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSubject(subject.id);
                    }}
                    className="p-2 rounded-full bg-red-500/40 hover:bg-red-500/60 text-white"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex flex-col h-full">
                  {editingId === subject.id ? (
                    <input
                      autoFocus
                      className="bg-white/20 border-none text-white text-2xl font-bold tracking-tight w-full rounded px-2 focus:ring-0"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={() => {
                        onRenameSubject(subject.id, editName);
                        setEditingId(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          onRenameSubject(subject.id, editName);
                          setEditingId(null);
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <h3 className="text-2xl font-bold tracking-tight">{subject.name}</h3>
                  )}
                  <div className="mt-4 flex-1 flex items-center justify-center opacity-40">
                    {subject.icon === 'helicopter' && <Plane size={80} strokeWidth={1} />}
                    {subject.icon === 'rocket' && <Rocket size={80} strokeWidth={1} />}
                    {subject.icon === 'blimp' && <Wind size={80} strokeWidth={1} />}
                  </div>
                </div>
                <div className="bento-arrow">
                  <ArrowRight size={20} />
                </div>
              </motion.div>
            ))}

            {/* Add Subject Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: subjects.length * 0.1 }}
              onClick={onAddSubject}
              className="bento-card bento-card-white border-2 border-dashed border-white/20 bg-transparent hover:bg-white/5 cursor-pointer flex flex-col items-center justify-center gap-4 h-[200px]"
            >
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white">
                <Plus size={24} />
              </div>
              <span className="text-white font-bold tracking-tight">Add New Subject</span>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SubjectDetailView = ({ 
  subject, 
  notes, 
  onAddNote, 
  onSelectNote 
}: { 
  subject: Subject, 
  notes: Note[], 
  onAddNote: () => void, 
  onSelectNote: (id: string) => void 
}) => {
  return (
    <div className="flex-1 h-screen flex flex-col bg-[#051937] overflow-hidden">
      <div className="h-12 border-b border-white/10 flex items-center justify-between px-6 bg-white/10 backdrop-blur-md">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <FileText size={14} />
          {subject.name}
        </h2>
        <button 
          onClick={onAddNote}
          className="flex items-center gap-1.5 px-4 py-1.5 bento-card-pink text-white text-xs font-bold rounded-xl hover:shadow-lg hover:shadow-pink-200 transition-all"
        >
          <Plus size={14} />
          New Note
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-black text-pink-600 tracking-tight mb-2">{subject.name}</h1>
            <p className="text-pink-500 font-medium">{notes.length} notes in this subject</p>
          </div>

          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-pink-300">
              <FileText size={64} strokeWidth={1} />
              <p className="mt-4 text-sm font-bold">No notes yet. Let's start writing!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {notes.map(note => (
                <motion.div 
                  key={note.id}
                  whileHover={{ y: -5 }}
                  onClick={() => onSelectNote(note.id)}
                  className="bg-white p-6 rounded-[32px] notion-shadow border border-transparent hover:border-pink-200 cursor-pointer transition-all flex flex-col gap-4"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-pink-500 bg-pink-50 px-2 py-0.5 rounded-full uppercase tracking-widest">
                      {format(note.updatedAt, 'MMM d, yyyy')}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl text-pink-600 line-clamp-1">
                    {note.title || 'Untitled Note'}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">
                    {note.content || 'Start writing something amazing...'}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('nf_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Failed to parse user', e);
      return null;
    }
  });
  const [view, setView] = useState<View>('library');
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem('nf_notes');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse notes', e);
      return [];
    }
  });
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    try {
      const saved = localStorage.getItem('nf_reminders');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse reminders', e);
      return [];
    }
  });
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const saved = localStorage.getItem('nf_todos');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse todos', e);
      return [];
    }
  });
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>(() => {
    try {
      const saved = localStorage.getItem('nf_weekly_goals');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse weekly goals', e);
      return [];
    }
  });
  const [deadlines, setDeadlines] = useState<Deadline[]>(() => {
    try {
      const saved = localStorage.getItem('nf_deadlines');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse deadlines', e);
      return [];
    }
  });
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const saved = localStorage.getItem('nf_subjects');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse subjects', e);
    }
    const initialSubjects: Subject[] = [
      { id: '1', name: 'Maths', color: 'pink', icon: 'none' },
      { id: '2', name: 'Science', color: 'blue', icon: 'rocket' },
      { id: '3', name: 'Computer', color: 'pink', icon: 'none' },
    ];
    return initialSubjects;
  });
  const [academicRecords, setAcademicRecords] = useState<AcademicRecord[]>(() => {
    try {
      const saved = localStorage.getItem('nf_academic_records');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse academic records', e);
      return [];
    }
  });
  const [weeklyReviews, setWeeklyReviews] = useState<WeeklyReview[]>(() => {
    try {
      const saved = localStorage.getItem('nf_weekly_reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse weekly reviews', e);
    }
    return [{
      id: Math.random().toString(36).substr(2, 9),
      weekStarting: Date.now(),
      wins: [],
      misses: [],
      studyHours: 0,
      workouts: 0,
      projects: [],
      reflections: ''
    }];
  });
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [activeReminder, setActiveReminder] = useState<Reminder | null>(null);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('nf_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('nf_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('nf_todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('nf_weekly_goals', JSON.stringify(weeklyGoals));
  }, [weeklyGoals]);

  useEffect(() => {
    localStorage.setItem('nf_deadlines', JSON.stringify(deadlines));
  }, [deadlines]);

  useEffect(() => {
    localStorage.setItem('nf_academic_records', JSON.stringify(academicRecords));
  }, [academicRecords]);

  useEffect(() => {
    localStorage.setItem('nf_weekly_reviews', JSON.stringify(weeklyReviews));
  }, [weeklyReviews]);

  useEffect(() => {
    localStorage.setItem('nf_subjects', JSON.stringify(subjects));
  }, [subjects]);

  // Reminder Checker
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const dueReminders = reminders.filter(r => !r.notified && r.dateTime <= now);
      
      if (dueReminders.length > 0) {
        const reminder = dueReminders[0];
        setActiveReminder(reminder);
        
        // Mark as notified
        setReminders(prev => prev.map(r => 
          r.id === reminder.id ? { ...r, notified: true } : r
        ));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [reminders]);

  const handleAddNote = () => {
    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      content: '',
      subject: activeSubject?.name || '',
      updatedAt: Date.now()
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes(notes.map(n => n.id === updatedNote.id ? updatedNote : n));
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
    setActiveNoteId(null);
  };

  const handleAddReminder = (r: Omit<Reminder, 'id' | 'notified' | 'isCompleted'>) => {
    const newReminder: Reminder = {
      ...r,
      id: Math.random().toString(36).substr(2, 9),
      notified: false,
      isCompleted: false
    };
    setReminders([...reminders, newReminder]);
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const handleToggleReminder = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, isCompleted: !r.isCompleted } : r));
  };

  const handleAddTodo = (text: string) => {
    const newTodo: Todo = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      completed: false,
      createdAt: Date.now()
    };
    setTodos([newTodo, ...todos]);
  };

  const handleToggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const handleAddWeeklyGoal = (text: string) => {
    const newGoal: WeeklyGoal = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      completed: false
    };
    setWeeklyGoals([...weeklyGoals, newGoal]);
  };

  const handleToggleWeeklyGoal = (id: string) => {
    setWeeklyGoals(weeklyGoals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const handleDeleteWeeklyGoal = (id: string) => {
    setWeeklyGoals(weeklyGoals.filter(g => g.id !== id));
  };

  const handleAddDeadline = (title: string, date: number) => {
    const newDeadline: Deadline = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      date
    };
    setDeadlines([...deadlines, newDeadline]);
  };

  const handleDeleteDeadline = (id: string) => {
    setDeadlines(deadlines.filter(d => d.id !== id));
  };

  const handleUpdateAcademicRecord = (update: Partial<AcademicRecord> & { subjectId: string }) => {
    setAcademicRecords(prev => {
      const existing = prev.find(r => r.subjectId === update.subjectId);
      if (existing) {
        return prev.map(r => r.subjectId === update.subjectId ? { ...r, ...update } : r);
      }
      return [...prev, { 
        id: Math.random().toString(36).substr(2, 9), 
        subjectId: update.subjectId,
        grade: '-',
        targetGrade: '-',
        studyHours: 0,
        ...update 
      } as AcademicRecord];
    });
  };

  const handleUpdateWeeklyReview = (id: string, update: Partial<WeeklyReview>) => {
    setWeeklyReviews(prev => prev.map(r => r.id === id ? { ...r, ...update } : r));
  };

  const handleAddWeeklyReview = () => {
    // Set to start of current week (Monday)
    const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 }).getTime();
    
    // Check if a review for this week already exists
    const existing = weeklyReviews.find(r => isSameDay(r.weekStarting, startOfCurrentWeek));
    
    if (existing) {
      setSelectedReviewId(existing.id);
      return;
    }

    const newId = Math.random().toString(36).substr(2, 9);
    const newReview: WeeklyReview = {
      id: newId,
      weekStarting: startOfCurrentWeek,
      wins: [],
      misses: [],
      studyHours: 0,
      workouts: 0,
      projects: [],
      reflections: ''
    };
    setWeeklyReviews([newReview, ...weeklyReviews]);
    setSelectedReviewId(newId);
  };

  const activeSubject = subjects.find(s => s.id === activeSubjectId);
  const filteredNotes = activeSubject 
    ? notes.filter(n => n.subject === activeSubject.name)
    : notes;

  const activeNote = notes.find(n => n.id === activeNoteId);

  const handleAddNoteToSubject = () => {
    if (!activeSubject) return;
    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      content: '',
      subject: activeSubject.name,
      updatedAt: Date.now()
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const handleRenameSubject = (id: string, newName: string) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, name: newName } : s));
  };

  const handleDeleteSubject = (id: string) => {
    const subjectToDelete = subjects.find(s => s.id === id);
    if (!subjectToDelete) return;

    setSubjects(prev => prev.filter(s => s.id !== id));
    setNotes(prev => prev.filter(n => n.subject !== subjectToDelete.name));
    setAcademicRecords(prev => prev.filter(r => r.subjectId !== id));
    
    // Also clear active subject if it was the one deleted
    if (activeSubjectId === id) setActiveSubjectId(null);
  };

  const handleAddSubject = () => {
    const colors: ('pink' | 'blue' | 'white')[] = ['pink', 'blue', 'white'];
    const icons: ('helicopter' | 'blimp' | 'rocket' | 'none')[] = ['helicopter', 'blimp', 'rocket', 'none'];
    
    const newSubject: Subject = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Subject',
      color: colors[Math.floor(Math.random() * colors.length)],
      icon: icons[Math.floor(Math.random() * icons.length)]
    };
    setSubjects([...subjects, newSubject]);
  };

  const handleSignUp = (userData: User) => {
    setUser(userData);
    localStorage.setItem('nf_user', JSON.stringify(userData));
  };

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden bg-[#051937]">
      <AnimatePresence>
        {!user && <SignUpPage onSignUp={handleSignUp} />}
      </AnimatePresence>

      <Sidebar 
        currentView={view} 
        setView={setView} 
        subjects={subjects}
        activeSubjectId={activeSubjectId}
        setActiveSubjectId={setActiveSubjectId}
        todos={todos}
        weeklyReviews={weeklyReviews}
      />

      <main className="flex-1 h-screen overflow-hidden bg-[#051937]">
        {view === 'library' ? (
          <LibraryView 
            subjects={subjects} 
            onSelectSubject={(id) => {
              setActiveSubjectId(id);
              setView('subject-detail');
            }}
            onRenameSubject={handleRenameSubject}
            onDeleteSubject={handleDeleteSubject}
            onAddSubject={handleAddSubject}
            todos={todos}
            weeklyGoals={weeklyGoals}
            deadlines={deadlines}
          />
        ) : view === 'subject-detail' ? (
          activeNote ? (
            <NoteEditor 
              note={activeNote} 
              onUpdate={handleUpdateNote} 
              onClose={() => setActiveNoteId(null)}
              onDelete={handleDeleteNote}
            />
          ) : activeSubject ? (
            <SubjectDetailView 
              subject={activeSubject}
              notes={filteredNotes}
              onAddNote={handleAddNoteToSubject}
              onSelectNote={setActiveNoteId}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-pink-300">
              Select a subject to view notes
            </div>
          )
        ) : view === 'calendar' ? (
          <CalendarView 
            reminders={reminders} 
            onAddReminder={handleAddReminder}
            onDeleteReminder={handleDeleteReminder}
            onToggleReminder={handleToggleReminder}
          />
        ) : view === 'weekly-review' ? (
          <WeeklyReviewView 
            goals={weeklyGoals}
            onAddGoal={handleAddWeeklyGoal}
            onToggleGoal={handleToggleWeeklyGoal}
            onDeleteGoal={handleDeleteWeeklyGoal}
            deadlines={deadlines}
            onAddDeadline={handleAddDeadline}
            onDeleteDeadline={handleDeleteDeadline}
            reviews={weeklyReviews}
            selectedReviewId={selectedReviewId}
            onSelectReview={setSelectedReviewId}
            onUpdateReview={handleUpdateWeeklyReview}
            onAddReview={handleAddWeeklyReview}
          />
        ) : view === 'academics-tracker' ? (
          <AcademicsTrackerView 
            subjects={subjects}
            records={academicRecords}
            onUpdateRecord={handleUpdateAcademicRecord}
          />
        ) : (
          <TodoView 
            todos={todos}
            onAddTodo={handleAddTodo}
            onToggleTodo={handleToggleTodo}
            onDeleteTodo={handleDeleteTodo}
          />
        )}
      </main>

      {/* Reminder Popup */}
      <AnimatePresence>
        {activeReminder && (
          <div className="fixed bottom-6 right-6 z-[100]">
            <motion.div 
              initial={{ y: 100, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.9 }}
              className="bg-white w-80 notion-shadow border border-blue-100 rounded-2xl overflow-hidden"
            >
              <div className="bg-blue-600 p-4 flex items-center gap-3 text-white">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Bell size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">Reminder Now</div>
                  <div className="font-bold text-sm">NotionFlow Alert</div>
                </div>
                <button 
                  onClick={() => setActiveReminder(null)}
                  className="ml-auto p-1 hover:bg-white/10 rounded"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-5">
                <h4 className="font-bold text-lg mb-1">{activeReminder.title}</h4>
                {activeReminder.description && (
                  <p className="text-sm text-[#787774] mb-4">{activeReminder.description}</p>
                )}
                <div className="flex items-center gap-2 text-xs text-blue-600 font-medium mb-4">
                  <Clock size={14} />
                  {format(new Date(activeReminder.dateTime), 'h:mm a')}
                </div>
                <button 
                  onClick={() => setActiveReminder(null)}
                  className="w-full py-2 bg-[#F7F7F5] border border-[#EDECE9] rounded-lg text-sm font-bold hover:bg-[#EBEBE8] transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
