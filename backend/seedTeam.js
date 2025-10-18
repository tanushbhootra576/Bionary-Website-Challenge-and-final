import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { Team } from './schema.js'
import { teamData } from '../bionary_website/src/teamData.js'

dotenv.config()

const uri = process.env.MONGO_DB_URI || process.env.MONGO_URI || process.env.MONGO_URI

async function seed() {
    if (!uri) {
        console.error('No MONGO_DB_URI found in environment')
        process.exit(1)
    }
    await mongoose.connect(uri)
    console.log('Connected to MongoDB for seeding')

    for (const t of teamData) {
        // Avoid duplicates by name + department
        const exists = await Team.findOne({ name: t.name, department: t.department })
        if (exists) {
            console.log(`Skipping existing: ${t.name}`)
            continue
        }
        const doc = new Team({
            name: t.name,
            role: t.role,
            department: t.department,
            batch: t.batch,
            bio: t.bio,
            skills: t.skills,
            points: t.points || 0,
            image: t.image,
            github: t.github,
            linkedin: t.linkedin,
            email: t.email
        })
        await doc.save()
        console.log(`Inserted: ${t.name}`)
    }

    // Additional sample members to make departments richer
    const extra = [
        { name: 'Maya Singh', role: 'Frontend Dev', department: 'Development', batch: 2024, skills: ['React', 'CSS'], bio: 'Builds polished UI components.', image: 'https://i.pravatar.cc/400?img=5', github: 'https://github.com/mayasingh' },
        { name: 'Arjun Mehta', role: 'Backend Dev', department: 'Development', batch: 2023, skills: ['Node', 'Express'], bio: 'APIs and architecture.', image: 'https://i.pravatar.cc/400?img=6' },
        { name: 'Priya Verma', role: 'UX Designer', department: 'Design', batch: 2025, skills: ['Figma', 'Prototyping'], bio: 'Designs intuitive flows.', image: 'https://i.pravatar.cc/400?img=7' },
        { name: 'Liu Wei', role: 'Data Scientist', department: 'AIML', batch: 2024, skills: ['Python', 'Pandas'], bio: 'ML pipelines and analysis.', image: 'https://i.pravatar.cc/400?img=9' },
        { name: 'Carlos Diaz', role: 'Embedded Engineer', department: 'Robotics', batch: 2025, skills: ['C++', 'ROS'], bio: 'Hardware integration.', image: 'https://i.pravatar.cc/400?img=10' },
        { name: 'Nina Patel', role: 'Marketing Exec', department: 'Marketing', batch: 2023, skills: ['SEO', 'Content'], bio: 'Growth and outreach.', image: 'https://i.pravatar.cc/400?img=11' },
        { name: 'Omar Khalid', role: 'QA Engineer', department: 'Quality Assurance', batch: 2024, skills: ['Testing', 'Automation'], bio: 'Ensures reliability.', image: 'https://i.pravatar.cc/400?img=13' },
        { name: 'Zara Ali', role: 'Data Engineer', department: 'Data', batch: 2025, skills: ['ETL', 'SQL'], bio: 'Data pipelines and ETL.', image: 'https://i.pravatar.cc/400?img=14' },
        { name: 'Ben Turner', role: 'DevOps', department: 'Operations', batch: 2023, skills: ['Docker', 'Kubernetes'], bio: 'Infrastructure and CI/CD.', image: 'https://i.pravatar.cc/400?img=15' },
        { name: 'Hana Suzuki', role: 'Mobile Dev', department: 'Development', batch: 2025, skills: ['React Native', 'iOS'], bio: 'Builds mobile apps.', image: 'https://i.pravatar.cc/400?img=16' }
    ]

    for (const t of extra) {
        const exists = await Team.findOne({ name: t.name, department: t.department })
        if (exists) {
            console.log(`Skipping existing: ${t.name}`)
            continue
        }
        const doc = new Team({
            name: t.name,
            role: t.role,
            department: t.department,
            batch: t.batch,
            bio: t.bio,
            skills: t.skills,
            points: t.points || 0,
            image: t.image,
            github: t.github,
            linkedin: t.linkedin,
            email: t.email
        })
        await doc.save()
        console.log(`Inserted: ${t.name}`)
    }

    console.log('Done seeding team data')
    process.exit(0)
}

seed().catch(err => { console.error(err); process.exit(1) })
