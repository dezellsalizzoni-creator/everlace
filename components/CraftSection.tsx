import Image from "next/image";

export default function CraftSection() {
  return (
    <section id="craftsmanship" className="mx-auto max-w-7xl px-6 py-24">
      <div className="relative overflow-hidden rounded-3xl">
        <Image
          src="https://via.placeholder.com/1800x900.png?text=Hand-finished+Detail"
          alt="Craft details"
          width={1800}
          height={900}
          className="h-[440px] w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/25" />
        <p className="absolute bottom-8 left-8 max-w-xl font-[var(--font-cormorant)] text-4xl text-white">
          Hand-finished. Precision-engineered. Uniquely yours.
        </p>
      </div>
    </section>
  );
}
