# AdGenie AI

This project is a Next.js application that generates marketing videos by combining GPT-4 scripts, ElevenLabs voiceovers, Whisper captions, Pexels stock clips, and Supabase storage.

## Deploying to Vercel

1. **Install dependencies locally**
   ```bash
   npm install
   ```

2. **Create required services**
   - Supabase project with a `videos` storage bucket that allows public reads.
   - API keys for OpenAI, ElevenLabs, and Pexels.

3. **Connect the repository to Vercel**
   - Import the project in Vercel and select this repository.
   - Use the default build command (`npm run build`) and output directory (`.next`).

4. **Configure environment variables** in the Vercel dashboard under **Project Settings → Environment Variables**:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `OPENAI_API_KEY`
   - `ELEVENLABS_API_KEY`
   - `PEXELS_API_KEY`

5. **Set function resources (optional)**
   - The included `vercel.json` configures the `api/generate-video` function to run on Node.js 18 with extended memory and timeout limits suitable for FFmpeg processing.

6. **Trigger a deployment**
   - Pushing to the default branch will automatically start a deployment. You can also trigger one manually from the Vercel dashboard.

## Viewing the deployment

Once Vercel finishes building the project, you can open the generated preview or production URL directly from the dashboard:

1. Navigate to your Vercel project and select **Deployments**.
2. Click the latest deployment to view its status details.
3. Use the **Preview** or **Production** link at the top-right of the deployment page to open the live site in your browser.

If you prefer the CLI, run `npx vercel --prod --open` (for production) or `npx vercel --open` (for previews) to launch the current deployment in your default browser.

You can also verify the app locally before deploying by running `npm run dev` and visiting [http://localhost:3000](http://localhost:3000).

## Local development

Run the development server with:

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).
