export const categories = [
  { id: 'leave', name: 'Leave', icon: 'CalendarOff', color: '#f43f5e', desc: 'Time off requests' },
  { id: 'late', name: 'Late Arrival', icon: 'Clock', color: '#f97316', desc: 'Running behind schedule' },
  { id: 'meeting', name: 'Meeting Skip', icon: 'VideoOff', color: '#8b5cf6', desc: 'Avoiding that meeting' },
  { id: 'deadline', name: 'Deadline Extension', icon: 'Timer', color: '#eab308', desc: 'Need more time' },
  { id: 'wfh', name: 'Work From Home', icon: 'Home', color: '#22c55e', desc: 'Remote work today' },
  { id: 'emergency', name: 'Emergency', icon: 'AlertTriangle', color: '#ef4444', desc: 'Urgent situations' },
  { id: 'professional', name: 'Professional', icon: 'Briefcase', color: '#0ea5e9', desc: 'Corporate-grade excuses' },
  { id: 'funny', name: 'Funny', icon: 'Laugh', color: '#ec4899', desc: 'Make them laugh' },
];

export const tones = [
  { id: 'formal', name: 'Formal', emoji: '🎩' },
  { id: 'casual', name: 'Casual', emoji: '😎' },
  { id: 'urgent', name: 'Urgent', emoji: '🚨' },
  { id: 'apologetic', name: 'Apologetic', emoji: '🙏' },
];

const excuseBank = {
  leave: {
    formal: [
      'I would like to request a personal day on [date] to attend to some important matters that require my immediate attention. I will ensure all pending tasks are completed beforehand.',
      'Due to unforeseen personal circumstances, I need to take a leave of absence on [date]. I have informed the team and delegated my responsibilities accordingly.',
      'I am writing to inform you that I will be unavailable on [date] due to a prior medical appointment that cannot be rescheduled. I will be back online the following day.',
      'I would like to formally request time off on [date] to handle a family matter. I will coordinate with the team to ensure minimal disruption.',
      'Please accept this request for a personal day on [date]. I have reviewed my calendar and confirmed no critical deadlines conflict with this absence.',
    ],
    casual: [
      'Hey, I need to take the day off on [date] — got some stuff I need to handle. I\'ll make sure nothing falls through the cracks before I go.',
      'Just a heads up, I won\'t be in on [date]. Got a personal thing I need to take care of. Everything\'s covered though!',
      'Mind if I take [date] off? Something came up and I need to deal with it. I\'ll wrap up anything urgent before then.',
      'I need to dip out on [date] for a bit. Personal stuff. Don\'t worry, I\'ll make sure the team\'s all set.',
      'Taking [date] off if that\'s cool. Got a thing. I\'ll be back at it the next day, promise.',
    ],
    urgent: [
      'URGENT: I need to take immediate leave on [date] due to a family emergency. Please treat this as a priority approval.',
      'I regret to inform you that I cannot come in on [date] due to an unexpected emergency situation that demands my immediate presence.',
      'I need emergency leave for [date]. A critical personal matter has come up that I must attend to. Please confirm at your earliest.',
      'Requesting urgent leave for [date]. Something unavoidable has come up. I apologize for the short notice.',
      'I need to take leave immediately on [date] due to an urgent personal matter. I will provide further details when possible.',
    ],
    apologetic: [
      'I\'m really sorry for the short notice, but I need to take [date] off. Something came up that I can\'t avoid. I feel terrible about any inconvenience.',
      'I apologize, but I need to request a day off on [date]. I know it\'s last minute and I\'m sorry for any disruption this causes the team.',
      'So sorry about this, but I won\'t be able to make it on [date]. I understand the timing isn\'t great and I truly apologize.',
      'I hate to do this at the last minute, but I need [date] off. I\'m sorry for any trouble this causes. I\'ll make it up.',
      'I feel awful asking for this, but I need a personal day on [date]. Sorry for the inconvenience — I\'ll catch up on everything after.',
    ],
  },
  late: {
    formal: [
      'I wanted to inform you in advance that I will be arriving late today due to an unavoidable situation. I expect to be in by [time] and will make up for any missed time.',
      'Due to unforeseen circumstances, I will be late arriving at the office this morning. I anticipate arriving by [time] and will ensure my deliverables remain on track.',
      'I regret to inform you that I will be delayed this morning. An unexpected situation requires my attention, and I expect to arrive by [time].',
      'Please be advised that I will be arriving later than usual today. I will make the necessary adjustments to complete my work on schedule.',
      'I need to inform you that my arrival will be delayed this morning due to circumstances beyond my control. I will be in by [time].',
    ],
    casual: [
      'Running a bit behind this morning — should be there by [time]. Sorry about that!',
      'Hey, traffic is brutal today. I\'ll be in around [time]. Nothing urgent is affected.',
      'Sorry, something came up and I\'m running late. Should land by [time] though!',
      'Morning! Just letting you know I\'m running behind. Expect me around [time].',
      'Ugh, running late. Should be there by [time]. Will jump right into it when I arrive.',
    ],
    urgent: [
      'EMERGENCY: I will be significantly late today. An urgent situation requires my attention. I will update you with an ETA as soon as possible.',
      'I need to alert you that I will be late today due to an unexpected emergency. I will keep you updated on my arrival time.',
      'Unexpected emergency — I\'ll be late. Will update you soon. Very sorry for the disruption.',
      'I\'m dealing with an urgent personal matter that will delay my arrival. I will be in as soon as I can.',
      'Critical situation this morning — will be late. I\'ll communicate my ETA shortly.',
    ],
    apologetic: [
      'I\'m so sorry, but I\'m going to be late today. Something completely unexpected came up. I\'ll be there as fast as I can.',
      'I really apologize — I\'m running late this morning. I know it\'s not ideal and I\'m sorry for any inconvenience.',
      'Sorry about this, I\'m delayed and will be late. I hate doing this but it\'s unavoidable. I\'ll be in soon.',
      'I feel terrible about this but I\'m going to be late today. An unexpected situation came up. Sorry!',
      'Apologies for being late — something came up at the last minute. I\'ll make it up, I promise.',
    ],
  },
  meeting: {
    formal: [
      'I regret to inform you that I will be unable to attend today\'s meeting due to a conflicting priority that requires my immediate attention. I will review the meeting notes afterward.',
      'Unfortunately, I have an unavoidable conflict during the scheduled meeting time. I have delegated my input to [colleague] and will follow up on any action items.',
      'I would like to request to be excused from today\'s meeting as I need to focus on a time-sensitive deliverable. I will catch up via the recording or notes.',
      'Due to a scheduling conflict with an urgent task, I won\'t be able to attend the meeting. Please share the minutes and I\'ll review them thoroughly.',
      'I need to prioritize a critical deadline that conflicts with today\'s meeting. I apologize for any inconvenience and will review all materials afterward.',
    ],
    casual: [
      'Hey, I\'m going to have to sit out today\'s meeting — got a tight deadline to hit. Can you fill me in on what I miss?',
      'Can\'t make the meeting today, something came up. Let me know the key takeaways and I\'ll catch up!',
      'Mind if I skip today\'s meeting? Need to grind on something urgent. I\'ll check the notes after.',
      'I\'m going to pass on the meeting today — deep in a project that needs my full attention. What did I miss?',
      'Won\'t be in the meeting today. Got my hands full with something. Shoot me a summary when you can!',
    ],
    urgent: [
      'URGENT PRIORITY: I must excuse myself from today\'s meeting to handle a time-critical issue that cannot wait.',
      'I need to immediately focus on an urgent matter and will be unable to attend the meeting. Please proceed without me.',
      'A critical issue has come up that requires my immediate attention. I cannot attend the meeting today.',
      'Emergency situation requires me to skip today\'s meeting. Please share all notes and action items.',
      'I have a time-sensitive crisis to manage and cannot participate in the meeting. Kindly excuse me.',
    ],
    apologetic: [
      'I\'m really sorry but I can\'t make it to the meeting today. Something urgent popped up. I feel bad about missing it.',
      'So sorry to miss the meeting today — I know my input would be valuable. Something came up that I need to handle.',
      'I apologize, but I won\'t be able to attend today\'s meeting. I know it\'s important and I\'m sorry for missing it.',
      'Sorry about this, but I need to skip today\'s meeting. I feel terrible about it. I\'ll review everything afterward.',
      'I hate to miss this, but I have to skip the meeting. I\'m really sorry and will make sure to catch up on everything.',
    ],
  },
  deadline: {
    formal: [
      'I am writing to request an extension on the [project] deadline. Due to unforeseen complexities, I need [number] additional days to ensure the deliverable meets the required quality standards.',
      'I would like to formally request a deadline extension for [project]. The scope has evolved significantly, and I need additional time to complete it properly. I propose a new deadline of [date].',
      'After careful assessment, I need to inform you that the [project] deadline may not be achievable as originally planned. I request an extension of [number] days to deliver a polished result.',
      'I need to flag a potential delay with [project]. Unforeseen technical challenges have emerged, and I request a brief extension to [date] to address them adequately.',
      'I would like to formally request additional time for [project]. The complexity of the work has increased and I want to ensure the final output is of the highest quality.',
    ],
    casual: [
      'Hey, I\'m going to need a bit more time on [project]. Hit some bumps I didn\'t expect. Can we push the deadline to [date]?',
      'So, the [project] thing is taking longer than I thought. Any chance we can extend the deadline? I want to make sure it\'s done right.',
      'Quick update — [project] needs more time. Some unexpected stuff came up. How about [date]?',
      'I\'m going to need a deadline extension on [project]. Ran into some issues. Can we aim for [date] instead?',
      'The [project] deadline is going to be tight. I need a few more days to nail it. New target: [date]?',
    ],
    urgent: [
      'URGENT: Critical issues have emerged with [project] that require immediate deadline extension. Requesting new deadline of [date].',
      'I need to alert you to a significant blocker on [project]. The current deadline is at serious risk. Requesting emergency extension.',
      'Major unexpected complications with [project] — deadline extension is critical. I need [number] more days minimum.',
      'The [project] is facing unforeseen critical challenges. I must request an urgent deadline extension to [date].',
      'Priority alert: [project] deadline is at high risk. Emergency extension of [number] days is needed to avoid quality compromise.',
    ],
    apologetic: [
      'I\'m really sorry, but I need more time on [project]. I know we had a deadline and I feel terrible about this. Can we extend it?',
      'I feel awful about this, but [project] is going to need more time. Something unexpected came up. Sorry for the inconvenience.',
      'I hate to ask for this, but I need an extension on [project]. I\'m sorry — I know this isn\'t ideal.',
      'Sorry to do this, but I\'m going to miss the [project] deadline. I feel really bad about it. Can we get an extension?',
      'I apologize sincerely — [project] needs more time. I know this is frustrating and I\'m sorry.',
    ],
  },
  wfh: {
    formal: [
      'I would like to request permission to work from home today due to [reason]. I will be fully available during work hours and all tasks will proceed as planned.',
      'I am requesting to work remotely today as I need to [reason]. I will be online and available for all meetings and communications.',
      'Due to personal circumstances, I would appreciate the opportunity to work from home today. I assure you there will be no impact on my productivity.',
      'I would like to work from home today to handle [reason]. I will maintain regular hours and be available via all communication channels.',
      'Please consider approving a remote work day for me today. I need to [reason] but will remain fully productive and accessible.',
    ],
    casual: [
      'Hey, can I work from home today? Got [reason] to deal with. I\'ll be online and available all day though!',
      'Working from home today if that\'s okay — got [reason] to handle. Don\'t worry, I\'ll be reachable.',
      'Mind if I WFH today? Need to take care of [reason]. I\'ll be at my desk, just not in the office.',
      'Is it cool if I work from home today? Something I need to deal with at home. I\'m still working though!',
      'Hey, WFH today please? [reason]. I\'ll be online all day, promise.',
    ],
    urgent: [
      'URGENT: I need to work from home today due to an unexpected situation. I will be fully operational and available.',
      'I need to work remotely today due to an urgent personal matter. Please approve. I will maintain full productivity.',
      'Requesting immediate approval for remote work today due to an emergency situation at home.',
      'I must work from home today due to an urgent matter. I will be online and available as normal.',
      'Emergency requires me to work from home today. I will be fully accessible and productive.',
    ],
    apologetic: [
      'I\'m sorry for the late notice, but I need to work from home today. Something came up at home. I\'ll be fully available though.',
      'Sorry about this, but can I work from home today? An unexpected situation needs my presence at home. I\'ll be online all day.',
      'I apologize for the inconvenience, but I need to work remotely today. I promise it won\'t affect my work.',
      'So sorry to ask last minute, but I need to WFH today. Something came up. I\'ll be fully online.',
      'I hate to spring this on you, but I need to work from home today. Sorry for any inconvenience.',
    ],
  },
  emergency: {
    formal: [
      'I am writing to inform you of an emergency that requires my immediate attention. I will be unavailable for the remainder of the day and will provide an update as soon as possible.',
      'Due to a family emergency, I need to take immediate leave. I will handle urgent matters through email when possible and return as soon as I can.',
      'I regret to inform you that a personal emergency requires me to leave immediately. I will coordinate with the team to ensure business continuity.',
      'An unexpected emergency has occurred that demands my immediate presence. I need to step away but will remain reachable for critical matters.',
      'I must inform you of an urgent personal emergency. I will be temporarily unavailable but will resume duties at the earliest opportunity.',
    ],
    casual: [
      'Something came up — a family emergency. I need to go handle it. I\'ll keep you posted when I can.',
      'Hey, family emergency. Need to run. I\'ll update you as soon as I know more.',
      'Emergency at home, I have to go. Sorry for the sudden departure. I\'ll check in when I can.',
      'Something urgent came up — family stuff. I need to go deal with it. Will be in touch.',
      'Gotta go — emergency. I\'ll fill you in when things calm down. Sorry about this.',
    ],
    urgent: [
      'EMERGENCY: I must leave immediately due to a critical family situation. Please excuse me without delay.',
      'URGENT: A serious emergency has occurred. I need to depart immediately. All critical tasks have been delegated.',
      'I need to leave right now for an emergency. This is time-critical. I will update you as soon as possible.',
      'Critical emergency situation — I must go immediately. Please excuse the sudden departure.',
      'EMERGENCY DEPARTURE: A serious personal emergency requires my immediate attention. I will be unreachable for a period.',
    ],
    apologetic: [
      'I\'m so sorry but I have a family emergency and need to leave right away. I know this is sudden and I\'m sorry for any disruption.',
      'I\'m really sorry to do this, but an emergency has come up and I need to go immediately. I feel terrible about leaving.',
      'I apologize for the sudden absence — a family emergency requires my immediate attention. I\'m sorry for any inconvenience.',
      'So sorry, but I have to go. A family emergency. I\'m really sorry for leaving things in a lurch.',
      'I feel terrible about this, but an emergency means I need to leave now. Sorry for any disruption.',
    ],
  },
  professional: {
    formal: [
      'I would like to formally notify you that I will be unavailable on [date] to attend a professional development opportunity that aligns with my career growth objectives.',
      'I am writing to request approval for a strategic absence on [date] to pursue a certification examination that will benefit the organization.',
      'Due to a pre-scheduled professional commitment, I will need to adjust my availability on [date]. I have ensured all responsibilities are covered.',
      'I would like to inform you of a professional obligation on [date] that requires my attendance. I have made arrangements to minimize any impact.',
      'Please be advised that I will be attending a professional conference on [date]. This will contribute valuable insights to our team.',
    ],
    casual: [
      'I\'ve got a professional commitment on [date] that I need to attend. It\'ll make me better at my job, so I\'ll be out that day.',
      'Quick heads up — I have a professional development thing on [date]. Should be back the next day.',
      'I\'m attending a professional event on [date]. Just giving you a heads up so you know I\'ll be out.',
      'Got a certification exam on [date] that I need to take. I\'ll be unavailable that day.',
      'Professional thing on [date] — need to step out for it. Everything\'s covered on my end.',
    ],
    urgent: [
      'PRIORITY NOTICE: I need to attend a time-sensitive professional certification exam on [date]. This is critical for compliance.',
      'URGENT: A professional accreditation deadline requires my immediate attention on [date]. Please approve this absence.',
      'I need to attend an urgent professional development session on [date]. This impacts our team\'s certification status.',
      'Critical professional commitment on [date] that cannot be rescheduled. Requesting immediate approval.',
      'A mandatory professional certification exam is scheduled for [date]. I need to attend.',
    ],
    apologetic: [
      'I\'m sorry for the short notice, but I have a professional commitment on [date] that I can\'t reschedule. Sorry for any inconvenience.',
      'I apologize, but I need to attend a professional development session on [date]. I know the timing isn\'t great.',
      'Sorry about this, but a professional certification exam fell on [date]. I really need to attend. Sorry for the disruption.',
      'I feel bad about the timing, but I have a professional obligation on [date] that needs my attention.',
      'Sorry to do this, but a professional commitment popped up on [date]. I\'ll make sure everything\'s covered.',
    ],
  },
  funny: {
    formal: [
      'I regret to inform you that my cat has learned to open doors and has locked me in the bathroom. I am working on negotiations and will be in shortly.',
      'Due to an incident involving a runaway Roomba and a plate of spaghetti, my home office is currently a crime scene. I will be working from the kitchen.',
      'My smart home system has gained sentience and refuses to let me leave until I agree to watch its favorite show. I am in active mediation.',
      'I must report that a pigeon has claimed my car as its nesting ground. Animal control has been contacted. ETA to resolution: unknown.',
      'My GPS has recalculated my commute and determined that I live on a different planet. I am working to resolve this navigational dispute.',
    ],
    casual: [
      'So my dog ate my alarm clock. And then my backup alarm. And then my phone. I\'m starting to think he doesn\'t want me to go to work.',
      'I\'m currently trapped under a very judgmental cat who has decided my lap is her office now. Rescue ETA: when she feels like it.',
      'My coffee machine broke this morning and I physically cannot function without coffee. This is a medical emergency. I\'ll be late.',
      'I walked out the door and realized my shirt is on inside out AND backwards. I need a full restart. Give me 30 minutes.',
      'My neighbor\'s rooster has been crowing since 4 AM and I haven\'t slept. I\'m running on pure spite and caffeine. I\'ll be late.',
    ],
    urgent: [
      'EMERGENCY: A flock of geese has formed an impenetrable circle around my car. I am currently negotiating safe passage. Send backup.',
      'CRITICAL: My neighbor\'s dog has stolen my work badge and is running around the neighborhood. This is a security breach.',
      'URGENT SITUATION: I accidentally glued my hand to my coffee mug. I am working with emergency services. This is not a drill.',
      'ALERT: My houseplant has fallen and I\'m pretty sure it\'s judging me. I need a moment to process this emotionally.',
      'EMERGENCY: I put on matching socks this morning and I\'m afraid to move and break the streak. I need to stay still for safety.',
    ],
    apologetic: [
      'I\'m really sorry, but I accidentally superglued my fingers together and I can\'t type. I know this sounds made up. It\'s not. I\'m sorry.',
      'So sorry about this, but my cat sent an email to the entire company from my laptop. I need to go fix the damage. Sorry.',
      'I feel terrible, but I sleepwalked and apparently ordered 200 rubber ducks on the company card. I need to fix this immediately.',
      'I\'m so sorry, but I walked into the wrong office building and have been in a meeting for an hour with people I don\'t know. I\'m leaving now.',
      'Sorry! I accidentally replied-all to the company email with a meme. I need to go pack my desk. Just kidding... unless?',
    ],
  },
};

export const generateExcuse = async (categoryId, toneId) => {
  try {
    const res = await fetch('/api/excuse/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: categoryId, tone: toneId }),
    });
    if (res.ok) {
      const data = await res.json();
      if (!data.fallback && data.excuses && data.excuses.length > 0) {
        return data.excuses[Math.floor(Math.random() * data.excuses.length)];
      }
    }
  } catch (e) {
    console.warn('AI excuse generation failed, using mock:', e.message);
  }

  const category = excuseBank[categoryId];
  if (!category) return 'Excuse not found.';
  const toneExcuses = category[toneId] || category.formal;
  const idx = Math.floor(Math.random() * toneExcuses.length);
  return toneExcuses[idx];
};

export const getCategoryById = (id) => categories.find(c => c.id === id) || categories[0];
export const getToneById = (id) => tones.find(t => t.id === id) || tones[0];
