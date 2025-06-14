import Link from "next/link"
import { Hourglass, Twitter, Github, Linkedin, Disc as Discord } from "lucide-react"
import { Button } from "@/components/ui/button"

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Hourglass className="h-8 w-8 text-cyan-400" />
              <span className="font-space-grotesk text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-cyan-600">
                Capsulr
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              The On-Chain Time Capsule Network. Create, lock, and reveal digital time capsules on the blockchain.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon={<Twitter className="h-4 w-4" />} />
              <SocialIcon icon={<Discord className="h-4 w-4" />} />
              <SocialIcon icon={<Github className="h-4 w-4" />} />
              <SocialIcon icon={<Linkedin className="h-4 w-4" />} />
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Product</h4>
            <ul className="space-y-2">
              <FooterLink href="/capsules">Capsules</FooterLink>
              <FooterLink href="/marketplace">Marketplace</FooterLink>
              <FooterLink href="/roadmap">Roadmap</FooterLink>
              <FooterLink href="/statistics">Statistics</FooterLink>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Resources</h4>
            <ul className="space-y-2">
              <FooterLink href="/documentation">Documentation</FooterLink>
              <FooterLink href="/guides">Guides</FooterLink>
              <FooterLink href="/api">API</FooterLink>
              <FooterLink href="/faq">FAQ</FooterLink>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Company</h4>
            <ul className="space-y-2">
              <FooterLink href="/about">About</FooterLink>
              <FooterLink href="/team">Team</FooterLink>
              <FooterLink href="/careers">Careers</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <div>© 2025 Capsulr. All rights reserved.</div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookies Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

interface FooterLinkProps {
  href: string
  children: React.ReactNode
}

const FooterLink = ({ href, children }: FooterLinkProps) => (
  <li>
    <Link href={href} className="text-gray-400 hover:text-white transition-colors">
      {children}
    </Link>
  </li>
)

interface SocialIconProps {
  icon: React.ReactNode
}

const SocialIcon = ({ icon }: SocialIconProps) => (
  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white">
    {icon}
  </Button>
)

export default Footer