import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

type ButtonVariant = 'default' | 'destructive' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({
         className = "",
         variant = "default",
         size = "default",
         asChild = false,
         ...props
     }, ref) => {
        const Comp = asChild ? Slot : "button";

        const buttonClasses = [
            "button",
            `button--${variant}`,
            `button--${size}`,
            className
        ].filter(Boolean).join(" ");

        return (
            <Comp
                className={buttonClasses}
                ref={ref}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";

export { Button };