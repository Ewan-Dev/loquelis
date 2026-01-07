import dotenv from 'dotenv'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { generateText } from 'ai'

dotenv.config({ path: '../backend/.env' })

const hackclub = createOpenRouter({
  apiKey: process.env.HACK_CLUB_AI_API_KEY,
  baseUrl: 'https://ai.hackclub.com/proxy/v1',
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { prompt } = req.body

    const { text } = await generateText({
      model: hackclub('qwen/qwen3-32b'),
      system: 'You are a helpful assistant.',
      prompt,
    })

    res.status(200).json({ text })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'AI failed' })
  }
}
