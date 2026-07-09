import { MantineProvider } from '@mantine/core'

function App() {
  return (
    <MantineProvider defaultColorScheme="dark">
      <main className="min-h-screen bg-black px-6 py-10 text-white">
        <section className="mx-auto max-w-4xl rounded-lg border border-[#333] bg-[#111] p-8">
          <p className="mb-3 text-sm text-[#00e128]">
            WorldQuant Alert Management
          </p>
          <h1 className="mb-4 text-3xl font-medium">UI/UX screen specs first</h1>
          <p className="max-w-2xl text-[#ccc]">
            This repository is prepared as a React, TypeScript, Bun, Vite,
            Tailwind CSS and Mantine SPA. The first milestone is the detailed
            screen documentation in the <code>screen/</code> folder.
          </p>
        </section>
      </main>
    </MantineProvider>
  )
}

export default App
