"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { 
  Clock, 
  Menu, 
  X, 
  Hourglass, 
  Users, 

  Lock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { ConnectBtn } from "../connectButton"


const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled 
        ? "bg-black/80 backdrop-blur-md border-b border-white/10" 
        : "bg-transparent"
    )}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
        <div className="hover:rotate-180 transition-transform duration-300"><Hourglass className="h-8 w-8 text-cyan-400 " /></div>
          
          <span className="font-space-grotesk text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-cyan-600">
            Capsulr
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="flex">
        <nav className="hidden md:flex justify-center font-normal gap-8">
          <NavLink href="/my-capsule">Explore Capsules</NavLink>
          {/* <NavLink href="/your-capsule">Your Capsules</NavLink> */}
          <NavLink href="/gifted-capsule">Gifted Capsules</NavLink>
          <NavLink href="/feed">Community</NavLink>
        </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {/* <Button variant="outline" className="border-cyan-500/50 hover:border-cyan-500 text-white">
            Connect Wallet
          </Button> */}
          <ConnectBtn/>
          
          <Button className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white" onClick={()=> router.push("/create")} >
            Create Capsule
          </Button>
        </div>

        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-black/95 backdrop-blur-md z-40 flex flex-col">
          <div className="container mx-auto px-4 py-8 flex flex-col gap-6">
            <MobileNavLink href="/my-capsule" icon={<Clock />}>Explore Capsules</MobileNavLink>
            {/* <MobileNavLink href="/how-it-works" icon={<Hourglass />}>How It Works</MobileNavLink> */}
            <MobileNavLink href="/gifted-capsule" icon={<Lock />}>Gifted Capsules</MobileNavLink>
            <MobileNavLink href="/feed" icon={<Users />}>Community</MobileNavLink>
            
            <div className="mt-8 flex flex-col gap-4">
              <Button variant="outline" className="w-full border-cyan-500/50 hover:border-cyan-500">
                Connect Wallet
              </Button>
              <Button className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700">
                Create Capsule
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

interface NavLinkProps {
  href: string
  children: React.ReactNode
}

const NavLink = ({ href, children }: NavLinkProps) => (
  <Link 
    href={href} 
    className="text-gray-300 hover:text-white transition-colors relative group"
  >
    {children}
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-cyan-600 group-hover:w-full transition-all duration-300"></span>
  </Link>
)

interface MobileNavLinkProps {
  href: string
  children: React.ReactNode
  icon: React.ReactNode
}

const MobileNavLink = ({ href, children, icon }: MobileNavLinkProps) => (
  <Link 
    href={href} 
    className="flex items-center gap-3 text-lg text-gray-300 hover:text-white p-3 rounded-md hover:bg-white/5 transition-all"
  >
    {icon}
    {children}
  </Link>
)

export default Header