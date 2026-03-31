import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-black/10 px-6 py-10 text-center text-sm text-charcoal/70">
      <div className="mb-3 flex flex-wrap justify-center gap-6">
        <Link href="/orders" className="hover:text-burnishedGold">
          Orders
        </Link>
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
        <a href="#">Contact</a>
      </div>
      <p>You must be 18+ to purchase</p>
    </footer>
  );
}
