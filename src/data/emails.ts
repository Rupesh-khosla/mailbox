import niteshAvatar from '../assets/nitesh.jpg'

export interface Attachment {
  id: string
  name: string
  size: string
  /** File type key used for the colored badge, e.g. "pdf" | "zip" | "img" | "doc" | "xls" */
  kind: string
  /** Object URL for real (user-attached) files — enables actual downloads */
  url?: string
}

export interface Email {
  id: string
  from: string
  email: string
  subject: string
  snippet: string
  body: string[]
  /** ISO-ish display time, e.g. "10:32 AM" */
  time: string
  /** Grouping label used by the list, e.g. "Today" | "Yesterday" | "Jul 10" */
  day: string
  /** True until the mail is opened */
  unread: boolean
  starred: boolean
  attachments: Attachment[]
  /** Solid avatar background class, e.g. "bg-sky-600" (fallback when no photo) */
  color: string
  /** Portrait photo URL */
  avatar: string
  /** Higher = more recent; drives the Recent/Oldest sort */
  recency: number}

export const emails: Email[] = [
  {
    id: '1',
    recency: 99,
    from: 'Andrew Cano',
    email: 'andrewcano@keitoto.co',
    subject: 'Report - Chatto project',
    snippet: 'Hello, Orlando! Please see the project status in the pdf I attached. The project...',
    body: [
      'Hello, Orlando!',
      'Please see the project status in the pdf I attached. The project looks good, and we are confident that we will complete it on time.',
      'Also, we have provided completed Hi-fi design. Do you have any feedbacks or comments more? If not, then we can make up and finish everything. Let us know as soon as possible. Thanks in advance 😊',
      'Regards,\nAndrew Cano',
    ],
    time: '10:32 AM',
    day: 'Today',
    unread: true,
    starred: false,
    attachments: [
      { id: 'a1', name: 'Report - Chatto project.pdf', size: '2.4 MB', kind: 'pdf' },
      { id: 'a2', name: 'Final Design - Chatto.zip', size: '25.8 MB', kind: 'zip' },
    ],
    color: 'bg-sky-600',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: '2',
    recency: 98,
    from: 'Zahir Mays',
    email: 'zahir.mays@lunaagency.com',
    subject: 'Following up on quotation',
    snippet: 'Dear Orlando, I am following up on the quotation that I sent to you on 12...',
    body: [
      'Dear Orlando,',
      'I am following up on the quotation that I sent to you on 12 July for the interior renovation work. Could you please let me know your decision so we can schedule the crew accordingly?',
      'Happy to walk you through any line items if something is unclear.',
      'Best regards,\nZahir Mays',
    ],
    time: '9:18 AM',
    day: 'Today',
    unread: true,
    starred: false,
    attachments: [],
    color: 'bg-amber-600',
    avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
  },
  {
    id: '3',
    recency: 97,
    from: 'James Dunn',
    email: 'james.dunn@jeezgear.com',
    subject: "It's here! The Jeez",
    snippet: "Hi Orlando! I hope you're having a wonderful day! I am emailing you today...",
    body: [
      'Hi Orlando!',
      "I hope you're having a wonderful day! I am emailing you today to let you know that the Jeez wireless headphones you ordered have arrived at our warehouse and will ship within 24 hours.",
      'You will receive a tracking link as soon as the parcel leaves our facility. Thank you for your patience — it will be worth the wait!',
      'Cheers,\nJames Dunn',
    ],
    time: 'Yesterday, 6:44 PM',
    day: 'Yesterday',
    unread: true,
    starred: false,
    attachments: [],
    color: 'bg-violet-600',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    id: '4',
    recency: 95,
    from: 'Rene Wells',
    email: 'rene.wells@brightpath.io',
    subject: 'About your free consultation with...',
    snippet: 'Hi Orlando, Thank you for signing up for the free consultation. I am looking...',
    body: [
      'Hi Orlando,',
      'Thank you for signing up for the free consultation. I am looking forward to speaking with you on Thursday at 3:00 PM.',
      'To make the most of our session, please prepare a short list of the goals you want to achieve this quarter. A calendar invite is on its way to your inbox.',
      'Warm regards,\nRene Wells',
    ],
    time: 'Yesterday, 1:59 PM',
    day: 'Yesterday',
    unread: true,
    starred: false,
    attachments: [],
    color: 'bg-rose-600',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: '5',
    recency: 94,
    from: 'Loki Bright',
    email: 'loki@brightdesigns.studio',
    subject: 'Following up on my proposal',
    snippet: 'Dear Orlando, I am following up on the proposal that I sent to you on 12...',
    body: [
      'Dear Orlando,',
      'I am following up on the proposal that I sent to you on 12 July. I understand you have a busy schedule, so I wanted to bring this back to the top of your inbox.',
      'The proposal covers the full rebrand: logo refresh, tone of voice, and a component library for your product team. The attached PDF has the updated pricing page.',
      'Best,\nLoki Bright',
    ],
    time: 'Jul 10, 4:48 PM',
    day: 'Jul 10',
    unread: false,
    starred: true,
    attachments: [{ id: 'a3', name: 'Bright_Proposal_v2.pdf', size: '8.1 MB', kind: 'pdf' }],
    color: 'bg-emerald-600',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
  },
  {
    id: '6',
    recency: 93,
    from: 'Katherine Moss',
    email: 'k.moss@northwind-law.com',
    subject: 'Information required',
    snippet: 'Dear Orlando, I am contacting you to request a few documents for the audit...',
    body: [
      'Dear Orlando,',
      'I am contacting you to request a few documents for the audit scheduled at the end of the month. Specifically we need the signed vendor agreements and the Q2 expense ledger.',
      'Please send them through the secure portal before Friday. Reach out if you need help accessing the portal.',
      'Sincerely,\nKatherine Moss',
    ],
    time: 'Jul 10, 9:48 AM',
    day: 'Jul 10',
    unread: false,
    starred: false,
    attachments: [{ id: 'a4', name: 'Document_Checklist.xlsx', size: '112 KB', kind: 'xls' }],
    color: 'bg-indigo-600',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    id: '7',
    recency: 100,
    from: 'Nitesh Arora',
    email: 'nitesh@projectlab.dev',
    subject: 'Report - Project',
    snippet: 'Hello, Rupesh! Please see the project status in the pdf I attached.',
    body: [
      'Hello, Rupesh!',
      'Please see the project status in the pdf I attached. Milestone 3 is complete and QA sign-off is expected by Wednesday.',
      'Let me know if you would like a walkthrough before the sprint review.',
      'Thanks,\nNitesh',
    ],
    time: '11:11 AM',
    day: 'Today',
    unread: true,
    starred: false,
    attachments: [{ id: 'a5', name: 'Project_Status_Report.pdf', size: '3.2 MB', kind: 'pdf' }],
    avatar: niteshAvatar,
    color: 'bg-slate-600',
  },
  {
    id: '8',
    recency: 96,
    from: 'Maya Okafor',
    email: 'maya.okafor@kavitaco.com',
    subject: 'Design tokens handoff',
    snippet: 'Hey! The design tokens are finalized. I have exported the JSON and a short guide...',
    body: [
      'Hey!',
      'The design tokens are finalized. I have exported the JSON and a short guide explaining spacing, radii, and color usage for the engineering team.',
      'Let me know when you have merged them so we can delete the staging branch.',
      'Maya',
    ],
    time: 'Yesterday, 11:05 AM',
    day: 'Yesterday',
    unread: false,
    starred: false,
    attachments: [
      { id: 'a6', name: 'tokens.json', size: '18 KB', kind: 'code' },
      { id: 'a7', name: 'Handoff_Guide.pdf', size: '1.9 MB', kind: 'pdf' },
    ],
    color: 'bg-fuchsia-600',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    id: '9',
    recency: 92,
    from: 'Samuel Park',
    email: 'sam.park@ledgerline.com',
    subject: 'Payment Confirmation',
    snippet: 'Thank you for your prompt response. This is a confirmation that invoice #2231...',
    body: [
      'Hi Orlando,',
      'Thank you for your prompt response. This is a confirmation that invoice #2231 has been paid in full. The amount of $4,850.00 was transferred to your account today.',
      'The receipt is attached for your records.',
      'Samuel Park\nAccounts Team',
    ],
    time: 'Jul 9, 2:20 PM',
    day: 'Jul 9',
    unread: false,
    starred: true,
    attachments: [{ id: 'a8', name: 'Invoice_2231_Receipt.pdf', size: '240 KB', kind: 'pdf' }],
    color: 'bg-lime-600',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
  },
  {
    id: '10',
    recency: 91,
    from: 'Ingrid Bergström',
    email: 'ingrid@nordic-UI.se',
    subject: 'Usability findings — week 2',
    snippet: 'Hej! Here are the top findings from the second usability round. Five participants...',
    body: [
      'Hej Orlando!',
      'Here are the top findings from the second usability round. Five participants completed all tasks, but three hesitated on the export dialog.',
      'I suggest we rename the primary action and add a confirmation step. Details and clips are in the attached deck.',
      'Ingrid',
    ],
    time: 'Jul 8, 5:02 PM',
    day: 'Jul 8',
    unread: false,
    starred: false,
    attachments: [{ id: 'a9', name: 'Usability_Week2.pptx', size: '14.6 MB', kind: 'ppt' }],
    color: 'bg-cyan-600',
    avatar: 'https://randomuser.me/api/portraits/women/26.jpg',
  },
  {
    id: '11',
    recency: 90,
    from: 'Diego Ramos',
    email: 'diego.ramos@cargo-fox.mx',
    subject: 'Shipment delayed — update',
    snippet: 'Hola Orlando, the shipment is delayed by two days due to a port backlog. New ETA...',
    body: [
      'Hola Orlando,',
      'The shipment is delayed by two days due to a port backlog. New ETA is Thursday, July 16 at the usual dock.',
      'No action is needed from your side. Apologies for the inconvenience.',
      'Diego Ramos\nLogistics',
    ],
    time: 'Jul 8, 9:14 AM',
    day: 'Jul 8',
    unread: false,
    starred: false,
    attachments: [],
    color: 'bg-orange-600',
    avatar: 'https://randomuser.me/api/portraits/men/54.jpg',
  },
  {
    id: '12',
    recency: 89,
    from: 'Priya Sharma',
    email: 'priya@festivalearth.org',
    subject: 'Volunteer roster for Saturday',
    snippet: 'Hi Orlando! Here is the final roster for the Saturday event. You are on the...',
    body: [
      'Hi Orlando!',
      'Here is the final roster for the Saturday event. You are on the morning shift, 8:00 to 12:00, at the welcome desk.',
      'Wear comfortable shoes — and thank you again for volunteering!',
      'Priya',
    ],
    time: 'Jul 7, 7:45 PM',
    day: 'Jul 7',
    unread: false,
    starred: false,
    attachments: [{ id: 'a10', name: 'Roster_Saturday.pdf', size: '540 KB', kind: 'pdf' }],
    color: 'bg-teal-600',
    avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
  },
]
