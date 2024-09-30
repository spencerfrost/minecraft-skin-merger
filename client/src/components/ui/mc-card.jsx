import React from 'react';
import { cn } from "../../lib/utils";

const MinecraftCard = React.forwardRef(({ className, children, ...props }, ref) => (
  <div className={cn("relative", className)}>
    <div 
      className="grid h-full w-full"
      style={{
        gridTemplateColumns: '2px 2px 1fr 2px 2px',
        gridTemplateRows: '2px 2px 1fr 2px 2px',
        gridTemplateAreas: `
          "tl-tl tr-tl t tl-tr tr-tr"
          "bl-tl br-tl t bl-tr br-tr"
          "l l inv r r"
          "tl-bl tr-bl b tl-br tr-br"
          "bl-bl br-bl b bl-br br-br"
        `
      }}
      {...props}
      ref={ref}
    >
      {/* Border pieces */}
      <div className="bg-card-border-bottom" style={{ gridArea: 'br-br', position: 'relative', top: '-4px', left: '-4px' }} />
      
      <div className="bg-card-border-top" style={{ gridArea: 'bl-tl' }} />
      <div className="bg-card-border-top" style={{ gridArea: 'tr-tl' }} />
      <div className="bg-card-border-top" style={{ gridArea: 'br-tl' }} />
      
      <div className="bg-card" style={{ gridArea: 'bl-tr' }} />
      <div className="bg-card" style={{ gridArea: 'tr-bl' }} />
      
      <div className="bg-card-border-bottom" style={{ gridArea: 'tr-br' }} />
      <div className="bg-card-border-bottom" style={{ gridArea: 'tl-br' }} />
      <div className="bg-card-border-bottom" style={{ gridArea: 'bl-br' }} />
      
      <div className="bg-card-border-top shadow-[-2px_0_0_black]" style={{ gridArea: 'l' }} />
      <div className="bg-card-border-bottom shadow-[2px_0_0_black]" style={{ gridArea: 'r' }} />
      <div className="bg-card-border-top shadow-[0_-2px_0_black]" style={{ gridArea: 't' }} />
      <div className="bg-card-border-bottom shadow-[0_2px_0_black]" style={{ gridArea: 'b' }} />
      
      {/* Main content area */}
      <div 
        ref={ref}
        className="bg-card p-2 pt-1"
        style={{ gridArea: 'inv' }}
      >
        {children}
      </div>
    </div>

    {/* Corner pixels */}
    <div className="absolute top-0.5 left-0 w-[2px] h-[2px] bg-black" />
    <div className="absolute top-0 left-0.5 w-[2px] h-[2px] bg-black" />

    <div className="absolute top-0.5 right-0 w-[2px] h-[2px] bg-black" />
    <div className="absolute top-0 right-0.5 w-[2px] h-[2px] bg-black" />

    <div className="absolute bottom-0.5 left-0 w-[2px] h-[2px] bg-black" />
    <div className="absolute bottom-0 left-0.5 w-[2px] h-[2px] bg-black" />

    <div className="absolute bottom-0.5 right-0 w-[2px] h-[2px] bg-black" />
    <div className="absolute bottom-0 right-0.5 w-[2px] h-[2px] bg-black" />
  </div>
));

MinecraftCard.displayName = 'MinecraftCard';

const CardHeader = ({ className, ...props }) => (
  <div className={cn("mb-1", className)} {...props} />
);

const CardTitle = ({ className, ...props }) => (
  <h3 className={cn("text-xl font-minecraft text-text-gray", className)} {...props} />
);

const CardContent = ({ className, ...props }) => (
  <div 
    className={cn(
      "bg-input px-2 relative",
      className
    )} 
    {...props} 
  >
    <div className="absolute inset-0 border-t-2 border-l-2 border-input-border-top" />
    <div className="absolute inset-0 border-b-2 border-r-2 border-input-border-bottom" />
    <div className="relative z-10">
      {props.children}
    </div>
  </div>
);

const CardFooter = ({ className, ...props }) => (
  <div className={cn("mt-2", className)} {...props} />
);

export { CardContent, CardFooter, CardHeader, CardTitle, MinecraftCard };

