"use client";

import { MouseEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export const Testimonials = () => {
  const handleGlowMove = (event: MouseEvent<HTMLElement>) => {
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;

    card.style.setProperty("--testimonial-glow-x", `${x}px`);
    card.style.setProperty("--testimonial-glow-y", `${y}px`);
  };

  const handleGlowEnter = (event: MouseEvent<HTMLElement>) => {
    event.currentTarget.classList.add("testimonial-glow-active");
  };

  const handleGlowLeave = (event: MouseEvent<HTMLElement>) => {
    const card = event.currentTarget;
    card.classList.remove("testimonial-glow-active");
    card.style.removeProperty("--testimonial-glow-x");
    card.style.removeProperty("--testimonial-glow-y");
  };

  return (
    <section
      id="testimonials"
      className="container py-20 sm:py-28"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">
            Beta-Feedback, das Vertrauen aufbaut
          </h2>
          <p className="text-xl text-muted-foreground pt-4 max-w-3xl">
            Ein kurzer Beleg, dass Teams mit unserem Loyalty-System schnell live
            gehen und nicht mehr mit CSV-Dateien kämpfen.
          </p>
        </div>
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-8">
        <Card
          onMouseMove={handleGlowMove}
          onMouseEnter={handleGlowEnter}
          onMouseLeave={handleGlowLeave}
          className="testimonial-glow-card testimonial-glow-1 lg:col-span-2 border-primary/10 shadow-lg shadow-primary/5"
        >
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Avatar>
              <AvatarImage
                alt=""
                src="https://i.pravatar.cc/150?img=12"
              />
              <AvatarFallback>BT</AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <CardTitle className="text-lg">Mara Schmidt</CardTitle>
              <CardDescription>Beta-Tester, E-Commerce Brand</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="text-lg leading-8 text-muted-foreground">
            &quot;Wir haben unser eigenes Treueprogramm in wenigen Stunden live
            gebracht. Die API war sauber, das Setup klar und die ersten
            Wiederkäufe kamen direkt aus den Loyalty-Kampagnen.&quot;
          </CardContent>
        </Card>

        <Card
          onMouseMove={handleGlowMove}
          onMouseEnter={handleGlowEnter}
          onMouseLeave={handleGlowLeave}
          className="testimonial-glow-card testimonial-glow-2 border-primary/10 bg-muted/30"
        >
          <CardHeader>
            <CardTitle className="text-lg">Warum das wirkt</CardTitle>
            <CardDescription>
              Teams brauchen keine Points-Logik mehr selbst zu bauen.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>• Schnell integrierbar in bestehende Shops und Apps</p>
            <p>• Kampagnen in Echtzeit statt Excel-Workflows</p>
            <p>• White-label bereit für deine Kunden</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
