require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Post = require('./models/Post');
const Message = require('./models/Message');

const demoUsers = [
  {
    name: 'Amina Patel',
    email: 'amina@example.com',
    password: 'password123',
    gender: 'female',
    preferredName: 'Amina',
    role: 'Developer',
    organization: 'OpenSource Labs',
    bio: 'Full-stack engineer who loves building community tools.'
  },
  {
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    password: 'password123',
    gender: 'male',
    preferredName: 'Raj',
    role: 'Professional',
    organization: 'CloudBridge',
    bio: 'Cloud enthusiast and API builder.'
  },
  {
    name: 'Lina Torres',
    email: 'lina@example.com',
    password: 'password123',
    gender: 'female',
    preferredName: 'Lina',
    role: 'Student',
    organization: 'Tech University',
    bio: 'CS student exploring UX, accessibility, and modern stack.'
  }
];

const demoPosts = [
  {
    title: 'How do I center a div using Flexbox?',
    content: 'I am trying to center a card inside a container using Flexbox. I am not sure why justify-content and align-items are not working together. Any help?',
  },
  {
    title: 'Best way to organize React state in a large app?',
    content: 'I have a medium-sized React app with several forms and lists. Should I use context, Redux, or local component state?',
  },
  {
    title: 'MongoDB indexing for search queries',
    content: 'What is the best way to index a collection when I need to search by name, email, and organization at the same time?',
  },
  {
    title: 'Handling JWT refresh tokens securely',
    content: 'I am building auth for a React app. Should I store refresh tokens in localStorage or cookies? What is the safer pattern?',
  }
];

const demoMessages = [
  {
    fromEmail: 'amina@example.com',
    toEmail: 'rajesh@example.com',
    text: 'Hey Raj, did you check the new API design in the docs?'
  },
  {
    fromEmail: 'rajesh@example.com',
    toEmail: 'amina@example.com',
    text: 'Yes, I did. I think we can simplify the endpoint names and add pagination support.'
  }
];

const seedDemoData = async () => {
  try {
    await connectDB();

    const existingUsers = await User.countDocuments();
    if (existingUsers === 0) {
      console.log('Seeding demo users...');
      const hashedUsers = await Promise.all(demoUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10)
      })));
      await User.insertMany(hashedUsers);
    } else {
      console.log('Skipping user seeding: users already exist.');
    }

    const users = await User.find({ email: { $in: demoUsers.map((u) => u.email) } });
    if (users.length > 0) {
      const existingPosts = await Post.countDocuments();
      if (existingPosts === 0) {
        console.log('Seeding demo posts...');
        const postsToInsert = demoPosts.map((post, index) => ({
          ...post,
          user: users[index % users.length]._id
        }));
        await Post.insertMany(postsToInsert);
      } else {
        console.log('Skipping post seeding: posts already exist.');
      }

      const existingMessages = await Message.countDocuments();
      if (existingMessages === 0) {
        console.log('Seeding demo messages...');
        const messagesToInsert = demoMessages.map((message) => {
          const sender = users.find((u) => u.email === message.fromEmail);
          const receiver = users.find((u) => u.email === message.toEmail);
          return {
            sender: sender?._id,
            receiver: receiver?._id,
            text: message.text
          };
        }).filter(Boolean);
        await Message.insertMany(messagesToInsert);
      } else {
        console.log('Skipping message seeding: messages already exist.');
      }
    }

    console.log('Demo data seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding demo data:', error);
    process.exit(1);
  }
};

seedDemoData();
