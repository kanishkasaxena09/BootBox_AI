export const defaultInputs = {
  fullName: '',
  employeeId: '',
  designation: '',
  department: '',
  managerName: '',
  managerEmail: '',
  hrEmail: '',
  company: '',
  lastWorkingDay: '',
  joiningDate: '',
  reason: '',
  handoverNotes: '',
};

export const defaultTasks = [
  { id: 't1', task: '', status: 'Pending', assignee: '', deadline: '', notes: '' },
];

export const defaultAssets = [
  { id: 'a1', item: 'Laptop', serial: '', status: 'With Employee', returned: false },
  { id: 'a2', item: 'ID Badge', serial: '', status: 'With Employee', returned: false },
  { id: 'a3', item: 'Access Cards', serial: '', status: 'With Employee', returned: false },
  { id: 'a4', item: 'VPN Token', serial: '', status: 'With Employee', returned: false },
  { id: 'a5', item: 'Company Phone', serial: '', status: 'With Employee', returned: false },
];

export const defaultExitChecklist = [
  { id: 'e1', item: 'Submit resignation letter', done: false },
  { id: 'e2', item: 'Complete knowledge transfer', done: false },
  { id: 'e3', item: 'Return all company assets', done: false },
  { id: 'e4', item: 'Revoke system access', done: false },
  { id: 'e5', item: 'Clear pending dues', done: false },
  { id: 'e6', item: 'Collect experience letter', done: false },
  { id: 'e7', item: 'Update personal contact info with HR', done: false },
  { id: 'e8', item: 'Download personal files from work accounts', done: false },
  { id: 'e9', item: 'Handover vehicle parking pass', done: false },
  { id: 'e10', item: 'Confirm final settlement date', done: false },
];

const today = () => new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

async function aiGenerate(type, inputs) {
  try {
    const res = await fetch('/api/resignation/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, inputs }),
    });
    if (res.ok) {
      const data = await res.json();
      if (!data.fallback && data.content) return data.content;
    }
  } catch (e) {
    console.warn('AI resignation generation failed, using mock:', e.message);
  }
  return null;
}

export const generateResignationLetter = async (inputs) => {
  const ai = await aiGenerate('letter', inputs);
  if (ai) return ai;

  return `Date: ${today()}

To,
${inputs.hrEmail ? `HR Department` : 'HR Department'}
${inputs.company || '[Company Name]'}

Subject: Formal Resignation – ${inputs.fullName || '[Your Name]'}

Dear ${inputs.managerName || 'Manager'},

I am writing to formally inform you of my resignation from my position as ${inputs.designation || '[Designation]'} in the ${inputs.department || '[Department]'} department at ${inputs.company || '[Company Name]'}. This letter serves as my official notice, and my last working day will be ${inputs.lastWorkingDay ? new Date(inputs.lastWorkingDay).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '[Last Working Day]'}.

${inputs.reason ? `The reason for my resignation is: ${inputs.reason}.` : ''}

During my tenure, I have had the opportunity to work with an exceptional team and contribute to meaningful projects. I am grateful for the professional growth and experiences I have gained here.

I am committed to ensuring a smooth transition during my notice period. I will complete all pending tasks, document my processes, and assist in training my replacement as needed.

I request you to kindly initiate the necessary formalities for my relieving and final settlement.

Thank you for your understanding and support throughout my tenure.

Sincerely,
${inputs.fullName || '[Your Name]'}
${inputs.employeeId ? `Employee ID: ${inputs.employeeId}` : ''}
${inputs.designation || '[Designation]'}
${inputs.department || '[Department]'}`;
};

export const generateNoticeMail = async (inputs) => {
  const ai = await aiGenerate('noticeMail', inputs);
  if (ai) return ai;

  return `Subject: Resignation Notice – ${inputs.fullName || '[Your Name]'} | Last Working Day: ${inputs.lastWorkingDay ? new Date(inputs.lastWorkingDay).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '[Date]'}

Dear ${inputs.managerName || 'Manager'},

Please accept this email as formal notification of my resignation from ${inputs.company || '[Company Name]'}, effective ${inputs.lastWorkingDay ? new Date(inputs.lastWorkingDay).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '[Last Working Day]'}.

Key Details:
• Name: ${inputs.fullName || '[Your Name]'}
• Employee ID: ${inputs.employeeId || '[ID]'}
• Designation: ${inputs.designation || '[Designation]'}
• Department: ${inputs.department || '[Department]'}
• Last Working Day: ${inputs.lastWorkingDay ? new Date(inputs.lastWorkingDay).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '[Date]'}

${inputs.reason ? `Reason: ${inputs.reason}` : ''}

I will ensure a smooth handover of my responsibilities during the notice period. Please let me know the next steps regarding the exit process.

Thank you for the opportunities and support during my time here.

Best regards,
${inputs.fullName || '[Your Name]'}
${inputs.designation || '[Designation]'}
${inputs.department || '[Department]'}`;
};

export const generateManagerMail = async (inputs) => {
  const ai = await aiGenerate('managerMail', inputs);
  if (ai) return ai;

  return `Subject: Resignation & Handover Plan – ${inputs.fullName || '[Your Name]'}

Dear ${inputs.managerName || 'Manager'},

I wanted to reach out personally to inform you about my resignation and share my handover plan.

As discussed, my last working day will be ${inputs.lastWorkingDay ? new Date(inputs.lastWorkingDay).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '[Last Working Day]'}.

Handover Plan:
${inputs.handoverNotes || '• All ongoing projects will be documented and transferred\n• Pending tasks will be completed or handed over to designated team members\n• Key contacts and processes will be thoroughly documented'}

I want to express my sincere gratitude for your mentorship and leadership. Working under your guidance has been a valuable experience in my career.

I am fully committed to making this transition as smooth as possible. Please let me know if there are any specific tasks or documentation you would like me to prioritize.

Thank you for everything.

Warm regards,
${inputs.fullName || '[Your Name]'}`;
};

export const generateKnowledgeTransfer = async (inputs) => {
  const ai = await aiGenerate('knowledgeTransfer', inputs);
  if (ai) return ai;

  return `KNOWLEDGE TRANSFER DOCUMENT
Prepared by: ${inputs.fullName || '[Your Name]'}
Department: ${inputs.department || '[Department]'}
Date: ${today()}
Last Working Day: ${inputs.lastWorkingDay ? new Date(inputs.lastWorkingDay).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '[Date]'}

═══════════════════════════════════════

1. ROLE OVERVIEW
Designation: ${inputs.designation || '[Designation]'}
Reporting To: ${inputs.managerName || '[Manager]'}
Duration: ${inputs.joiningDate ? `${new Date(inputs.joiningDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })} – ${inputs.lastWorkingDay ? new Date(inputs.lastWorkingDay).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'Present'}` : '[Period]'}

2. KEY RESPONSIBILITIES
• Primary role responsibilities and daily operations
• Recurring tasks and reporting schedules
• Stakeholder management and communication channels
• Tool access and system dependencies

3. ACTIVE PROJECTS
${inputs.handoverNotes || '[Document current projects, their status, and next steps]'}

4. IMPORTANT CONTACTS
• Manager: ${inputs.managerName || '[Name]'} – ${inputs.managerEmail || '[Email]'}
• Team Members: [Add key team contacts]
• External Vendors: [Add vendor contacts if applicable]

5. DOCUMENTATION & FILES
• Project files location: [Path/Link]
• Credentials & access: [Secure handover procedure]
• Process documents: [Locations]

6. PENDING ITEMS
[List any unfinished work and recommended next steps]

7. TIPS FOR SUCCESSOR
• Key lessons learned during tenure
• Common pitfalls to avoid
• Recommended approach for ongoing projects

═══════════════════════════════════════
Document prepared for smooth transition. Contact ${inputs.fullName || '[Name]'} at ${inputs.hrEmail || '[Email]'} for questions.`;
};

export const generateTaskHandover = (inputs, tasks) => {
  const taskList = tasks.map((t, i) =>
    `${i + 1}. ${t.task || '[Task]'}\n   Status: ${t.status} | Assignee: ${t.assignee || '[TBD]'} | Deadline: ${t.deadline || '[TBD]'}${t.notes ? `\n   Notes: ${t.notes}` : ''}`
  ).join('\n\n');

  return `TASK HANDOVER DOCUMENT
Prepared by: ${inputs.fullName || '[Your Name]'}
Date: ${today()}
Last Working Day: ${inputs.lastWorkingDay ? new Date(inputs.lastWorkingDay).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '[Date]'}

═══════════════════════════════════════

TASKS FOR HANDOVER:

${taskList}

═══════════════════════════════════════

SUMMARY:
Total Tasks: ${tasks.length}
Pending: ${tasks.filter(t => t.status === 'Pending').length}
In Progress: ${tasks.filter(t => t.status === 'In Progress').length}
Completed: ${tasks.filter(t => t.status === 'Completed').length}

Please ensure all tasks are transitioned before the last working day.`;
};

export const generateAssetChecklist = (inputs, assets) => {
  const assetList = assets.map((a, i) =>
    `${i + 1}. ${a.item}\n   Serial: ${a.serial || 'N/A'} | Status: ${a.status} | Returned: ${a.returned ? 'Yes ✓' : 'No ✗'}`
  ).join('\n\n');

  return `ASSET RETURN CHECKLIST
Employee: ${inputs.fullName || '[Your Name]'}
Employee ID: ${inputs.employeeId || '[ID]'}
Department: ${inputs.department || '[Department]'}
Date: ${today()}

═══════════════════════════════════════

ASSETS:

${assetList}

═══════════════════════════════════════

Total Assets: ${assets.length}
Returned: ${assets.filter(a => a.returned).length}
Pending: ${assets.filter(a => !a.returned).length}

Employee Signature: ________________
Date: ________________

HR Signature: ________________
Date: ________________`;
};

export const generateExitChecklist = (inputs, checklist) => {
  const items = checklist.map((c, i) =>
    `${i + 1}. [${c.done ? 'X' : ' '}] ${c.item}`
  ).join('\n');

  const completed = checklist.filter(c => c.done).length;

  return `EXIT CHECKLIST
Employee: ${inputs.fullName || '[Your Name]'}
Employee ID: ${inputs.employeeId || '[ID]'}
Department: ${inputs.department || '[Department]'}
Last Working Day: ${inputs.lastWorkingDay ? new Date(inputs.lastWorkingDay).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '[Date]'}

═══════════════════════════════════════

${items}

═══════════════════════════════════════

Progress: ${completed}/${checklist.length} completed

Completed by: ${inputs.fullName || '[Name]'}
Date: ${today()}

HR Approval: ________________
Date: ________________`;
};

export const docTabs = [
  { id: 'resignation', label: 'Resignation Letter', icon: 'FileText' },
  { id: 'notice', label: 'Notice Mail', icon: 'Mail' },
  { id: 'manager', label: 'Manager Mail', icon: 'Send' },
  { id: 'knowledge', label: 'Knowledge Transfer', icon: 'BookOpen' },
  { id: 'handover', label: 'Task Handover', icon: 'ListChecks' },
  { id: 'assets', label: 'Asset Checklist', icon: 'Package' },
  { id: 'exit', label: 'Exit Checklist', icon: 'ClipboardCheck' },
];
