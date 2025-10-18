import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { Team } from './schema.js'

dotenv.config()

const uri = process.env.MONGO_DB_URI || process.env.MONGO_URI || process.env.MONGO_URI
const FORCE_UPDATE = process.env.FORCE_ADD_POINTS === '1' || false

async function addPoints() {
  if (!uri) {
    console.error('No MONGO_DB_URI found in environment')
    process.exit(1)
  }

  await mongoose.connect(uri)
  console.log('Connected to MongoDB for adding points to Team')

  const members = await Team.find({}).lean()
  let updated = 0

  for (const t of members) {
    const id = t._id
    const name = t.name || ''
    // If points exists and not forcing, skip
    if (typeof t.points === 'number' && !FORCE_UPDATE) {
      continue
    }

    let points = 0
    if (typeof t.points === 'number') points = t.points
    else {
      const str = `${t.name ?? ''}-${t.batch ?? ''}`
      let h = 0
      for (let i = 0; i < str.length; i++) {
        h = (h << 5) - h + str.charCodeAt(i)
        h |= 0
      }
      points = Math.abs(h) % 1001
    }

    await Team.updateOne({ _id: id }, { $set: { points } })
    updated++
    console.log(`Set points=${points} for ${name}`)
  }

  console.log(`Done. Updated: ${updated}`)
  process.exit(0)
}

addPoints().catch(err => { console.error(err); process.exit(1) })
