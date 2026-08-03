import ConfirmationForm from "./ConfirmationForm";

interface InvitationPageProps {
  codigo: string;
}

export default function InvitationPage({ codigo }: InvitationPageProps) {
  return <ConfirmationForm codigo={codigo} variant="full" />;
}
