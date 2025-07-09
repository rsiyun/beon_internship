import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const KtpDialog = ({ open, onOpenChange, imageUrl, name }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>KTP {name}</DialogTitle>
        </DialogHeader>
        <div className="relative aspect-[1.6] w-full overflow-hidden rounded-lg">
          <img
            src={imageUrl}
            alt={`KTP ${name}`}
            className="object-contain w-full h-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KtpDialog;