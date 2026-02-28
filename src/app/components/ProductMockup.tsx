import Image from "next/image";

export default function ProductMockup() {
  return (
    <section className="w-full max-w-2xl mx-auto mt-8 mb-8 flex flex-col items-center">
      <div className="rounded-2xl overflow-hidden shadow-lg border border-brand-100 bg-white">
        <Image
          src="/mockup-placeholder.png"
          alt="LoyaltyHub product preview"
          width={480}
          height={320}
          className="object-cover w-full h-auto"
        />
      </div>
      <div className="mt-3 text-brand-400 text-xs">* Product preview. Replace with your own screenshots.</div>
    </section>
  );
}
