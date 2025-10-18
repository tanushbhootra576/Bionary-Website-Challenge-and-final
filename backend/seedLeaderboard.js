import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { Leaderboard, Team } from './schema.js'

dotenv.config()

const uri = process.env.MONGO_DB_URI || process.env.MONGO_URI || process.env.MONGO_URI
const FORCE_UPDATE = process.env.FORCE_LEADERBOARD_UPDATE === '1' || false

async function seedLeaderboard() {
    if (!uri) {
        console.error('No MONGO_DB_URI found in environment')
        process.exit(1)
    }

    await mongoose.connect(uri)
    console.log('Connected to MongoDB for leaderboard seeding')

    let inserted = 0
    let updated = 0

    // Read all team members from DB and seed leaderboard from them
    const members = await Team.find({})
    for (const t of members) {
        const name = t.name || t.id || 'Unknown'
        const department = t.department || 'Unknown'

            // Prefer explicit points field on Team documents. If not present, generate deterministic score
            // based on name and batch so results are repeatable.
            let score = 0
            if (typeof t.points === 'number') {
                score = t.points
            } else if (typeof t.score === 'number') {
                score = t.score
            } else {
                // simple deterministic hash -> 0..1000
                const str = `${name}-${t.batch ?? ''}`
                let h = 0
                for (let i = 0; i < str.length; i++) {
                    h = (h << 5) - h + str.charCodeAt(i)
                    h |= 0
                }
                score = Math.abs(h) % 1001 // 0..1000
            }

        const existing = await Leaderboard.findOne({ name, department })
        if (existing) {
            if (FORCE_UPDATE) {
                existing.score = score
                await existing.save()
                updated++
                console.log(`Updated leaderboard entry for ${name} (${department})`)
            } else {
                console.log(`Skipping existing leaderboard entry for ${name} (${department})`)
            }
            continue
        }

        const e = new Leaderboard({ name, score, department })
        await e.save()
        inserted++
        console.log(`Inserted leaderboard entry for ${name} (${department})`)
    }

    console.log(`Leaderboard seeding completed. Inserted: ${inserted}, Updated: ${updated}`)
    process.exit(0)
}

seedLeaderboard().catch(err => { console.error(err); process.exit(1) })
