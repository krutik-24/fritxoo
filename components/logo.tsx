import Link from "next/link"

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <div className="font-extrabold text-2xl md:text-3xl tracking-tighter">
        <span className="text-black">FRIT</span>
        <span className="text-gray-700">XOO</span>
      </div>
    </Link>
  )
}
