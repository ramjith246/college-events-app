export function Card({ children }: { children: React.ReactNode }) {
    return <div className="border rounded p-4 shadow-md">{children}</div>;
  }
  
  export function CardContent({ children }: { children: React.ReactNode }) {
    return <div className="p-2">{children}</div>;
  }
  