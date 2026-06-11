export default function VisitorScreen({ children, className = '' }) {
  return (
    <div className={`flex min-h-screen items-center justify-center bg-[#F4F4F1] ${className}`}>
      {children}
    </div>
  )
}
