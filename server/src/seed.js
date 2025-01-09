import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Board from './models/Board.js';
import Task from './models/Task.js';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  // Clear existing data
  await Task.deleteMany({});
  await Board.deleteMany({});
  await User.deleteMany({});
  console.log('Cleared existing data');

  // Create demo user
  const user = await User.create({
    name: 'Demo User',
    email: 'demo@taskboard.com',
    password: 'password123',
  });
  console.log('Created user:', user.email);

  // Create boards
  const [website, mobile, marketing] = await Board.insertMany([
    { title: 'Website Redesign', description: 'Redesign the company website with a modern look and feel', owner: user._id },
    { title: 'Mobile App', description: 'Build the iOS and Android app for the platform', owner: user._id },
    { title: 'Marketing Campaign', description: 'Q1 product launch campaign planning and execution', owner: user._id },
  ]);
  console.log('Created boards:', website.title, mobile.title, marketing.title);

  // Create tasks
  await Task.insertMany([
    // Website Redesign tasks
    { title: 'Audit current website', description: 'Review existing pages, identify pain points and areas to improve', priority: 'high', status: 'done', order: 0, board: website._id, dueDate: new Date('2025-01-10') },
    { title: 'Define new design system', description: 'Choose typography, colour palette, and spacing tokens', priority: 'high', status: 'done', order: 1, board: website._id, dueDate: new Date('2025-01-15') },
    { title: 'Design homepage mockup', description: 'Create high-fidelity mockup in Figma for stakeholder review', priority: 'high', status: 'inprogress', order: 0, board: website._id, dueDate: new Date('2025-01-22') },
    { title: 'Build reusable component library', description: 'Implement Button, Card, Modal, and Form components', priority: 'medium', status: 'inprogress', order: 1, board: website._id, dueDate: new Date('2025-01-28') },
    { title: 'Implement responsive navigation', description: 'Desktop and mobile nav with smooth transitions', priority: 'medium', status: 'todo', order: 0, board: website._id, dueDate: new Date('2025-02-05') },
    { title: 'SEO meta tags and sitemap', description: 'Add proper meta descriptions, OG tags, and generate sitemap.xml', priority: 'low', status: 'todo', order: 1, board: website._id, dueDate: new Date('2025-02-10') },
    { title: 'Cross-browser testing', description: 'Test on Chrome, Firefox, Safari and Edge', priority: 'medium', status: 'todo', order: 2, board: website._id },

    // Mobile App tasks
    { title: 'Set up React Native project', description: 'Initialise project with Expo, configure ESLint and folder structure', priority: 'high', status: 'done', order: 0, board: mobile._id, dueDate: new Date('2025-01-08') },
    { title: 'Design onboarding screens', description: 'Splash, sign-in, sign-up and walkthrough screens', priority: 'high', status: 'done', order: 1, board: mobile._id, dueDate: new Date('2025-01-12') },
    { title: 'Implement authentication flow', description: 'JWT login, register, and token refresh with secure storage', priority: 'high', status: 'inprogress', order: 0, board: mobile._id, dueDate: new Date('2025-01-20') },
    { title: 'Build dashboard screen', description: 'Main home screen with summary cards and recent activity', priority: 'medium', status: 'todo', order: 0, board: mobile._id, dueDate: new Date('2025-02-01') },
    { title: 'Push notification setup', description: 'Integrate Expo Notifications for iOS and Android', priority: 'medium', status: 'todo', order: 1, board: mobile._id, dueDate: new Date('2025-02-08') },
    { title: 'Offline mode support', description: 'Cache data locally with AsyncStorage and sync on reconnect', priority: 'low', status: 'todo', order: 2, board: mobile._id },

    // Marketing Campaign tasks
    { title: 'Define target audience', description: 'Research and document ICP — demographics, pain points, and channels', priority: 'high', status: 'done', order: 0, board: marketing._id, dueDate: new Date('2025-01-05') },
    { title: 'Write launch blog post', description: 'Draft a 1500-word post covering the product story and key features', priority: 'high', status: 'inprogress', order: 0, board: marketing._id, dueDate: new Date('2025-01-18') },
    { title: 'Create social media assets', description: 'Design banners and short-form video clips for LinkedIn, X, and Instagram', priority: 'medium', status: 'inprogress', order: 1, board: marketing._id, dueDate: new Date('2025-01-20') },
    { title: 'Set up email drip campaign', description: 'Write 5-email welcome sequence and configure in Mailchimp', priority: 'high', status: 'todo', order: 0, board: marketing._id, dueDate: new Date('2025-01-25') },
    { title: 'Schedule Product Hunt launch', description: 'Prepare listing, assets, and coordinate hunter outreach', priority: 'medium', status: 'todo', order: 1, board: marketing._id, dueDate: new Date('2025-02-03') },
    { title: 'Track launch metrics', description: 'Set up dashboard in GA4 to monitor traffic, signups, and conversions', priority: 'low', status: 'todo', order: 2, board: marketing._id },
  ]);

  console.log('Created tasks');
  console.log('\nSeed complete!');
  console.log('---');
  console.log('Login with:');
  console.log('  Email:    demo@taskboard.com');
  console.log('  Password: password123');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
