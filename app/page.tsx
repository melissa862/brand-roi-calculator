import CalculatorForm from "@/components/CalculatorForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-16 md:py-20">
      <div className="w-full max-w-[1200px]">
        <header className="mb-8 text-center sm:mb-10">
          <p className="text-sm font-semibold tracking-[0.2em] text-[#C9A961]">
            CITRINE CREATORS
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
            Brand ROI Calculator
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-foreground/60 sm:text-base">
            Compare creator partnerships against equivalent LinkedIn ad spend.
          </p>
        </header>
        <CalculatorForm />
      </div>
    </main>
  );
}
