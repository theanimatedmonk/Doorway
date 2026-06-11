import AuroraBackground from './AuroraBackground'

export default function VisitorScreen({ children, className = '' }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F4F4F1]">
      <AuroraBackground />
      <div className={`relative z-10 flex min-h-screen items-center justify-center ${className}`}>
        {children}
      </div>
    </div>
  )
}
