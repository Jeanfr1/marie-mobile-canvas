import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Gift, Cake, Calendar } from "lucide-react";
import { format, parseISO, addYears, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";

interface BirthdayGiftPromptProps {
  isOpen: boolean;
  onClose: () => void;
  contact: {
    id: number;
    name: string;
    birthday: string;
  };
}

export const BirthdayGiftPrompt = ({
  isOpen,
  onClose,
  contact,
}: BirthdayGiftPromptProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Calculate days until birthday
  const calculateDaysUntilBirthday = () => {
    if (!contact?.birthday) return null;

    const today = new Date();
    const birthDate = parseISO(contact.birthday);

    // Get this year's birthday
    const thisYearBirthday = new Date(
      today.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate()
    );

    // If birthday has passed this year, calculate for next year
    const targetBirthday =
      thisYearBirthday < today
        ? addYears(thisYearBirthday, 1)
        : thisYearBirthday;

    return differenceInDays(targetBirthday, today);
  };

  const daysUntilBirthday = calculateDaysUntilBirthday();

  const formatBirthday = () => {
    if (!contact?.birthday) return "";
    const date = parseISO(contact.birthday);
    return format(date, "dd MMMM", { locale: fr });
  };

  const handleSendGift = () => {
    setIsLoading(true);
    // Redirect to add gift form
    setTimeout(() => {
      navigate("/gifts-given", {
        state: {
          suggestedRecipient: contact.name,
          birthdayGift: true,
          contactId: contact.id,
        },
      });
      onClose();
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Cake className="h-6 w-6 text-pink-500" />
            Anniversaire à venir !
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-muted p-4 rounded-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-medium text-lg">{contact?.name}</div>
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatBirthday()}
              </div>
            </div>

            <p className="text-muted-foreground">
              L'anniversaire de {contact?.name} arrive{" "}
              {daysUntilBirthday === 0
                ? "aujourd'hui"
                : daysUntilBirthday === 1
                ? "demain"
                : `dans ${daysUntilBirthday} jours`}
              ! Vous souhaitez lui offrir un cadeau ?
            </p>
          </div>

          <div className="bg-background border rounded-md p-4">
            <h4 className="font-medium flex items-center gap-2 mb-2">
              <Gift className="h-4 w-4 text-blue-500" />
              Suggestions
            </h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
              <li>Enregistrez les cadeaux que vous offrez</li>
              <li>Gardez une trace des préférences de vos proches</li>
              <li>Ne manquez plus jamais une occasion spéciale</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Pas maintenant
          </Button>
          <Button
            onClick={handleSendGift}
            disabled={isLoading}
            className="gap-2"
          >
            <Gift className="h-4 w-4" />
            Offrir un cadeau
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
