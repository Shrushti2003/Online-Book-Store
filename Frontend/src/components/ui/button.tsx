import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7B61FF] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#1E1E1E] text-[#FFF7ED] shadow-lg hover:shadow-xl",
        glow: "bg-gradient-to-r from-[#FF7B54] via-[#FF4ECD] to-[#7B61FF] text-white shadow-[0_18px_45px_rgba(255,78,205,0.25)]",
        glass: "glass text-foreground hover:border-[#7B61FF]/45",
        ghost: "hover:bg-black/5"
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4",
        lg: "h-13 px-7 text-base",
        icon: "h-11 w-11"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
