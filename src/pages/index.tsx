import VideoForm from "@/components/VideoForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20 px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          AdGenie.ai — AI Video Generator
        </h1>
        <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
          Turn any text idea into a TikTok-ready video in seconds. Add voiceovers, captions, stock clips, and your branding!
        </p>
        <a
          href="#generate"
          className="px-8 py-3 bg-white text-blue-600 font-semibold rounded shadow hover:bg-gray-100 transition"
        >
          Try it Now
        </a>
      </section>

      <section id="generate" className="py-16 px-8 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Generate Your First Video</h2>
        <VideoForm />
      </section>

      <section className="py-16 px-8 bg-white text-center">
        <h2 className="text-3xl font-bold mb-4">Join the Beta Waitlist</h2>
        <p className="mb-6 text-gray-700">
          Get early access to AdGenie.ai and be the first to create viral AI videos.
        </p>

        <form
          action="https://api.mailerlite.com/api/v2/subscribers"
          method="POST"
          className="flex flex-col md:flex-row justify-center items-center gap-4 max-w-xl mx-auto"
        >
          <input
            type="email"
            name="email"
            placeholder="Your email address"
            required
            className="w-full md:flex-1 p-3 border rounded"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
          >
            Join Waitlist
          </button>
        </form>
      </section>

      <footer className="py-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} AdGenie.ai. All rights reserved.
      </footer>
    </div>
  );
}
