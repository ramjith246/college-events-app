import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ReactNode } from "react";
// Remove this if not used
import { cn } from "@/lib/utlis";


interface DialogProps extends DialogPrimitive.DialogProps {
  children: ReactNode;
}

export function Dialog({ children, ...props }: DialogProps) {
  return <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>;
}
