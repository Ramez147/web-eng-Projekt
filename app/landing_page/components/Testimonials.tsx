import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export const Testimonials = () => {
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
        <Card className="lg:col-span-2 border-primary/10 shadow-lg shadow-primary/5">
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
            "Wir haben unser eigenes Treueprogramm in wenigen Stunden live
            gebracht. Die API war sauber, das Setup klar und die ersten
            Wiederkäufe kamen direkt aus den Loyalty-Kampagnen."
          </CardContent>
        </Card>

        <Card className="border-primary/10 bg-muted/30">
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
