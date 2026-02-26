import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded font-body ring-offset-background transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm hover:shadow-md border border-transparent font-medium",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-[0_0_15px_rgba(225,29,72,0.4)] font-medium transition-all",
        outline: "border border-border/80 bg-transparent hover:bg-primary/5 hover:text-primary hover:border-primary/30 font-medium",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary hover:shadow-[0_0_20px_rgba(225,29,72,0.3)] shadow-sm font-medium transition-all",
        ghost: "hover:bg-primary/5 hover:text-primary font-medium",
        link: "text-primary underline-offset-4 hover:underline font-medium",
        // Premium variants for real estate platform
        hero: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl font-semibold tracking-wider uppercase text-xs border border-transparent",
        heroOutline: "border border-primary-foreground/50 bg-white/10 backdrop-blur-md text-primary-foreground hover:bg-white hover:text-primary font-bold tracking-widest uppercase text-xs shadow-lg hover:shadow-xl",
        premium: "bg-gradient-to-br from-primary via-primary to-secondary/80 text-primary-foreground hover:brightness-110 shadow-lg hover:shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:-translate-y-0.5 font-bold tracking-wide transition-all",
        dark: "bg-muted text-foreground hover:bg-primary hover:text-white border border-border/50 shadow-sm hover:shadow-lg font-medium",
        whatsapp: "bg-[#25D366] text-white hover:bg-[#20BD5A] hover:shadow-[0_0_15px_rgba(37,211,102,0.4)] shadow-sm font-semibold tracking-wide transition-all",
        luxury: "bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm uppercase tracking-widest text-[11px] font-bold border border-transparent",
        "luxury-outline": "border border-primary/30 text-primary hover:bg-primary hover:text-white hover:shadow-md uppercase tracking-widest text-[11px] font-bold",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "hero" | "heroOutline" | "premium" | "dark" | "whatsapp" | "luxury" | "luxury-outline";
  size?: "default" | "sm" | "lg" | "xl" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
