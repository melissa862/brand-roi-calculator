import CalculatorForm from "@/components/CalculatorForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center px-6 py-16 sm:py-20">
      <div className="mb-12 max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Brand ROI Calculator
        </h1>
        <p className="mt-4 text-lg text-foreground/80 sm:text-xl">
          Creator Partnership vs LinkedIn Ads
        </p>
      </div>
      <CalculatorForm />
    </main>
  );
}
