// POST /api/seed — Seeds the demo account with a sample CV and 3 sample jobs.
// Only works in development. Run this once after setting up Supabase.
// You must first create the demo user in Supabase Auth (dashboard or CLI).

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SAMPLE_CV = `JANE DOE
Software Engineer | San Francisco, CA
jane.doe@email.com | linkedin.com/in/janedoe

SUMMARY
Full-stack software engineer with 4 years of experience building web applications
using React, Node.js, and PostgreSQL. Passionate about clean code and user experience.

EXPERIENCE
Software Engineer — Acme Corp (2022–Present)
• Built a customer dashboard using React and TypeScript, reducing support tickets by 30%
• Designed REST APIs with Node.js and Express serving 10,000+ daily requests
• Migrated legacy jQuery frontend to React, improving page load speed by 50%

Junior Developer — StartupXYZ (2020–2022)
• Developed features for an e-commerce platform using Next.js and Tailwind CSS
• Wrote unit and integration tests with Jest, achieving 85% code coverage
• Collaborated with the design team to implement responsive mobile layouts

EDUCATION
B.S. Computer Science — University of California, Berkeley (2020)

SKILLS
Languages: JavaScript, TypeScript, Python, SQL
Frontend: React, Next.js, Tailwind CSS, HTML/CSS
Backend: Node.js, Express, PostgreSQL, Redis
Tools: Git, Docker, AWS (S3, Lambda), Vercel`;

const SAMPLE_JOBS = [
  {
    title: 'Senior Frontend Engineer',
    company: 'TechCo',
    location: 'Remote',
    description: `We're looking for a Senior Frontend Engineer to join our product team.

Requirements:
- 5+ years of experience with React and TypeScript
- Experience with Next.js and server-side rendering
- Strong understanding of CSS and responsive design
- Experience with testing frameworks (Jest, Cypress)
- Familiarity with CI/CD pipelines

Nice to have:
- Experience with GraphQL
- Knowledge of accessibility standards (WCAG)
- Experience mentoring junior developers`,
    url: 'https://example.com/jobs/senior-frontend',
  },
  {
    title: 'Full Stack Developer',
    company: 'DataFlow Inc',
    location: 'New York, NY',
    description: `Join our engineering team to build data visualization tools.

Requirements:
- 3+ years full-stack experience
- Proficient in React, Node.js, and PostgreSQL
- Experience building REST APIs
- Understanding of database design and optimization
- Experience with Docker and cloud services (AWS or GCP)

Nice to have:
- Experience with D3.js or similar charting libraries
- Knowledge of Redis or other caching solutions
- Python experience for data processing`,
    url: 'https://example.com/jobs/fullstack-dev',
  },
  {
    title: 'React Native Developer',
    company: 'MobileFirst',
    location: 'Austin, TX',
    description: `Build cross-platform mobile apps with React Native.

Requirements:
- 3+ years experience with React Native
- Published apps on App Store and/or Google Play
- Experience with native modules and bridging
- Strong knowledge of mobile UI/UX patterns
- Experience with state management (Redux, MobX)

Nice to have:
- iOS or Android native development experience
- Experience with over-the-air updates (CodePush)
- Knowledge of mobile analytics and crash reporting`,
    url: 'https://example.com/jobs/react-native',
  },
];

export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Seed is disabled in production' }, { status: 403 });
  }

  // Use service role key to bypass RLS for seeding
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { error: 'Missing SUPABASE_SERVICE_ROLE_KEY in .env.local — needed to seed demo data' },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  // Find or create demo user
  const demoEmail = process.env.NEXT_PUBLIC_DEMO_EMAIL || 'demo@applywise.example';
  const demoPassword = process.env.NEXT_PUBLIC_DEMO_PASSWORD || 'demo-password-change-me';

  let userId: string;

  // Try to find existing demo user
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existingDemo = existingUsers?.users?.find((u) => u.email === demoEmail);

  if (existingDemo) {
    userId = existingDemo.id;
  } else {
    // Create demo user
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: demoEmail,
      password: demoPassword,
      email_confirm: true,
    });
    if (createError || !newUser.user) {
      return NextResponse.json({ error: `Failed to create demo user: ${createError?.message}` }, { status: 500 });
    }
    userId = newUser.user.id;
  }

  // Clear existing demo data
  await supabase.from('applications').delete().eq('user_id', userId);
  await supabase.from('analyses').delete().eq('user_id', userId);
  await supabase.from('jobs').delete().eq('user_id', userId);
  await supabase.from('cvs').delete().eq('user_id', userId);

  // Insert sample CV
  const { error: cvError } = await supabase.from('cvs').insert({
    user_id: userId,
    file_name: 'jane-doe-cv.pdf',
    raw_text: SAMPLE_CV,
  });

  if (cvError) {
    return NextResponse.json({ error: `CV insert failed: ${cvError.message}` }, { status: 500 });
  }

  // Insert sample jobs
  const { error: jobsError } = await supabase.from('jobs').insert(
    SAMPLE_JOBS.map((job) => ({ ...job, user_id: userId }))
  );

  if (jobsError) {
    return NextResponse.json({ error: `Jobs insert failed: ${jobsError.message}` }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: `Demo account seeded: ${demoEmail}`,
    userId,
  });
}
