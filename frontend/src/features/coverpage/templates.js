// Cover page template generators
// Each returns an HTML string for the preview + PDF capture

const field = (val) => (val || '').trim();

export function renderModern(data, logoDataUrl) {
  const { studentName, college, university, subject, course, semester, faculty, assignmentTitle, rollNumber, submissionDate, guideName } = data;
  return `
    <div style="width:595px;min-height:842px;font-family:'Segoe UI',Arial,sans-serif;background:#fff;color:#1a1a2e;padding:0;display:flex;flex-direction:column;">
      <div style="height:8px;background:linear-gradient(90deg,#6366f1,#8b5cf6,#a855f7);"></div>
      <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:48px 40px;text-align:center;">
        ${logoDataUrl ? `<img src="${logoDataUrl}" style="max-width:90px;max-height:90px;object-fit:contain;margin-bottom:24px;border-radius:12px;" />` : ''}
        <div style="width:60px;height:4px;background:linear-gradient(90deg,#6366f1,#a855f7);border-radius:2px;margin-bottom:28px;"></div>
        <h1 style="font-size:26px;font-weight:800;letter-spacing:0.5px;margin:0 0 6px;color:#1a1a2e;">${field(assignmentTitle) || 'Assignment Title'}</h1>
        <p style="font-size:13px;color:#6366f1;font-weight:600;margin:0 0 32px;text-transform:uppercase;letter-spacing:2px;">${field(subject) || 'Subject'}</p>
        <div style="width:100%;max-width:360px;border:1px solid #e5e7eb;border-radius:12px;padding:24px;text-align:left;background:#fafafa;">
          ${infoRow('Student', studentName)}
          ${infoRow('Roll No.', rollNumber)}
          ${infoRow('Course', `${field(course)} — Semester ${field(semester)}`)}
          ${infoRow('Faculty', faculty)}
          ${infoRow('Guide', guideName)}
        </div>
        <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e5e7eb;width:100%;max-width:360px;">
          <p style="font-size:11px;color:#9ca3af;margin:0 0 4px;">Submitted To</p>
          <p style="font-size:14px;font-weight:700;color:#1a1a2e;margin:0;">${field(faculty) || 'Faculty Name'}</p>
        </div>
        <div style="margin-top:20px;">
          <p style="font-size:10px;color:#9ca3af;margin:0;">${field(college)}</p>
          <p style="font-size:10px;color:#9ca3af;margin:2px 0 0;">${field(university)}</p>
          <p style="font-size:11px;color:#6366f1;font-weight:600;margin:10px 0 0;">${field(submissionDate) ? new Date(submissionDate).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' }) : ''}</p>
        </div>
      </div>
      <div style="height:8px;background:linear-gradient(90deg,#a855f7,#8b5cf6,#6366f1);"></div>
    </div>`;
}

export function renderClassic(data, logoDataUrl) {
  const { studentName, college, university, subject, course, semester, faculty, assignmentTitle, rollNumber, submissionDate, guideName } = data;
  return `
    <div style="width:595px;min-height:842px;font-family:'Georgia','Times New Roman',serif;background:#fff;color:#1a1a1a;padding:0;display:flex;flex-direction:column;">
      <div style="border:3px double #1a1a1a;margin:36px;flex:1;display:flex;flex-direction:column;">
        <div style="text-align:center;padding:32px 24px 20px;border-bottom:2px solid #1a1a1a;">
          ${logoDataUrl ? `<img src="${logoDataUrl}" style="max-width:80px;max-height:80px;object-fit:contain;margin-bottom:16px;" />` : ''}
          <p style="font-size:11px;text-transform:uppercase;letter-spacing:3px;margin:0;color:#666;">${field(college) || 'College Name'}</p>
          <p style="font-size:10px;text-transform:uppercase;letter-spacing:2px;margin:4px 0 0;color:#999;">${field(university) || 'University Name'}</p>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:20px 32px;text-align:center;">
          <p style="font-size:11px;text-transform:uppercase;letter-spacing:3px;margin:0;color:#666;">A ${field(course) || 'Course'} Project</p>
          <h1 style="font-size:24px;font-weight:700;margin:12px 0;letter-spacing:0.5px;">${field(assignmentTitle) || 'Assignment Title'}</h1>
          <p style="font-size:14px;color:#444;font-style:italic;margin:0 0 8px;">${field(subject) || 'Subject'}</p>
          <p style="font-size:11px;color:#888;">Semester ${field(semester) || '—'}</p>
          <div style="width:80px;height:1px;background:#1a1a1a;margin:28px auto;"></div>
          <div style="text-align:center;margin-top:4px;">
            <p style="font-size:11px;color:#666;margin:0;">Submitted by</p>
            <p style="font-size:15px;font-weight:700;margin:4px 0 2px;">${field(studentName) || 'Student Name'}</p>
            <p style="font-size:11px;color:#888;margin:0;">Roll No: ${field(rollNumber) || '—'}</p>
          </div>
        </div>
        <div style="border-top:2px solid #1a1a1a;padding:20px 32px;display:flex;justify-content:space-between;align-items:flex-end;">
          <div>
            <p style="font-size:10px;color:#666;margin:0;">Guided by</p>
            <p style="font-size:13px;font-weight:600;margin:2px 0 0;">${field(guideName) || 'Guide Name'}</p>
          </div>
          <div style="text-align:right;">
            <p style="font-size:10px;color:#666;margin:0;">Submitted to</p>
            <p style="font-size:13px;font-weight:600;margin:2px 0 0;">${field(faculty) || 'Faculty Name'}</p>
          </div>
        </div>
        <div style="text-align:center;padding:12px;border-top:1px solid #ddd;">
          <p style="font-size:10px;color:#999;margin:0;">${field(submissionDate) ? new Date(submissionDate).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' }) : ''}</p>
        </div>
      </div>
    </div>`;
}

export function renderUniversityStyle(data, logoDataUrl) {
  const { studentName, college, university, subject, course, semester, faculty, assignmentTitle, rollNumber, submissionDate, guideName } = data;
  return `
    <div style="width:595px;min-height:842px;font-family:'Segoe UI',Arial,sans-serif;background:#fff;color:#1e293b;padding:0;display:flex;flex-direction:column;">
      <div style="background:#1e3a5f;color:#fff;padding:28px 40px;text-align:center;">
        ${logoDataUrl ? `<img src="${logoDataUrl}" style="max-width:70px;max-height:70px;object-fit:contain;margin-bottom:12px;border-radius:50%;border:2px solid rgba(255,255,255,0.3);" />` : ''}
        <p style="font-size:12px;text-transform:uppercase;letter-spacing:4px;margin:0;opacity:0.8;">${field(university) || 'University Name'}</p>
        <p style="font-size:14px;font-weight:600;margin:4px 0 0;">${field(college) || 'College Name'}</p>
      </div>
      <div style="height:4px;background:linear-gradient(90deg,#c9a84c,#e8c84a,#c9a84c);"></div>
      <div style="flex:1;padding:32px 40px;">
        <div style="text-align:center;margin-bottom:28px;">
          <p style="font-size:10px;text-transform:uppercase;letter-spacing:3px;color:#64748b;margin:0;">Department of ${field(course) || 'Course'}</p>
          <h1 style="font-size:22px;font-weight:800;margin:10px 0 4px;color:#1e3a5f;">${field(assignmentTitle) || 'Assignment Title'}</h1>
          <p style="font-size:13px;color:#c9a84c;font-weight:600;margin:0;">${field(subject) || 'Subject'}</p>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:12px;">
          <tr><td style="padding:8px 12px;color:#64748b;font-weight:600;width:120px;">Student Name</td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;">${field(studentName) || '—'}</td></tr>
          <tr><td style="padding:8px 12px;color:#64748b;font-weight:600;">Roll Number</td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;">${field(rollNumber) || '—'}</td></tr>
          <tr><td style="padding:8px 12px;color:#64748b;font-weight:600;">Course</td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;">${field(course) || '—'}</td></tr>
          <tr><td style="padding:8px 12px;color:#64748b;font-weight:600;">Semester</td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;">${field(semester) || '—'}</td></tr>
          <tr><td style="padding:8px 12px;color:#64748b;font-weight:600;">Subject</td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;">${field(subject) || '—'}</td></tr>
        </table>
        <div style="margin-top:28px;display:flex;justify-content:space-between;">
          <div style="text-align:center;">
            <p style="font-size:10px;color:#64748b;margin:0 0 32px 0;">Submitted by</p>
            <div style="width:160px;border-top:1px solid #1e293b;padding-top:4px;">
              <p style="font-size:12px;font-weight:700;margin:0;">${field(studentName) || 'Student Name'}</p>
            </div>
          </div>
          <div style="text-align:center;">
            <p style="font-size:10px;color:#64748b;margin:0 0 32px 0;">Approved by</p>
            <div style="width:160px;border-top:1px solid #1e293b;padding-top:4px;">
              <p style="font-size:12px;font-weight:700;margin:0;">${field(faculty) || 'Faculty Name'}</p>
              <p style="font-size:9px;color:#64748b;margin:2px 0 0;">${field(guideName) ? `Guide: ${guideName}` : ''}</p>
            </div>
          </div>
        </div>
      </div>
      <div style="background:#f1f5f9;padding:12px 40px;text-align:center;border-top:1px solid #e2e8f0;">
        <p style="font-size:10px;color:#64748b;margin:0;">${field(submissionDate) ? `Date of Submission: ${new Date(submissionDate).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}` : ''}</p>
      </div>
    </div>`;
}

export function renderMinimal(data, logoDataUrl) {
  const { studentName, college, university, subject, course, semester, faculty, assignmentTitle, rollNumber, submissionDate, guideName } = data;
  return `
    <div style="width:595px;min-height:842px;font-family:'Helvetica Neue',Arial,sans-serif;background:#fafafa;color:#333;padding:0;display:flex;flex-direction:column;">
      <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:60px 56px;">
        ${logoDataUrl ? `<img src="${logoDataUrl}" style="max-width:60px;max-height:60px;object-fit:contain;margin-bottom:40px;" />` : ''}
        <p style="font-size:10px;text-transform:uppercase;letter-spacing:4px;color:#aaa;margin:0;">${field(course) || 'Course'} · Semester ${field(semester) || '—'}</p>
        <h1 style="font-size:32px;font-weight:300;margin:12px 0 0;color:#111;line-height:1.2;">${field(assignmentTitle) || 'Assignment Title'}</h1>
        <p style="font-size:14px;color:#888;margin:8px 0 0;font-weight:400;">${field(subject) || 'Subject'}</p>
        <div style="width:40px;height:2px;background:#333;margin:32px 0;"></div>
        <div style="display:flex;gap:48px;">
          <div>
            <p style="font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#aaa;margin:0 0 6px;">Student</p>
            <p style="font-size:13px;font-weight:600;margin:0;">${field(studentName) || '—'}</p>
            <p style="font-size:11px;color:#999;margin:2px 0 0;">${field(rollNumber) ? `Roll: ${rollNumber}` : ''}</p>
          </div>
          <div>
            <p style="font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#aaa;margin:0 0 6px;">Faculty</p>
            <p style="font-size:13px;font-weight:600;margin:0;">${field(faculty) || '—'}</p>
            ${guideName ? `<p style="font-size:11px;color:#999;margin:2px 0 0;">Guide: ${guideName}</p>` : ''}
          </div>
        </div>
      </div>
      <div style="padding:20px 56px;display:flex;justify-content:space-between;border-top:1px solid #e5e5e5;">
        <p style="font-size:10px;color:#bbb;margin:0;">${field(college)}${university ? ` · ${university}` : ''}</p>
        <p style="font-size:10px;color:#bbb;margin:0;">${field(submissionDate) ? new Date(submissionDate).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : ''}</p>
      </div>
    </div>`;
}

function infoRow(label, value) {
  return `
    <div style="display:flex;justify-content:space-between;padding:5px 0;font-size:11px;">
      <span style="color:#6b7280;font-weight:500;">${label}</span>
      <span style="color:#1a1a2e;font-weight:600;text-align:right;max-width:200px;">${field(value) || '—'}</span>
    </div>`;
}

export const TEMPLATES = [
  { id: 'modern', label: 'Modern', render: renderModern },
  { id: 'classic', label: 'Classic', render: renderClassic },
  { id: 'university', label: 'University Style', render: renderUniversityStyle },
  { id: 'minimal', label: 'Minimal', render: renderMinimal },
];
