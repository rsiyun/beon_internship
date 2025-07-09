import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import KtpDialog from "./KtpDialog";

const OcupantTable = ({ ocupants, onEdit }) => {
    const [selectedKtp, setSelectedKtp] = useState(null);
  return (
    <>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nama</TableHead>
          <TableHead>Ktp</TableHead>
          <TableHead>No Telpon</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ocupants.length > 0 ? (
          ocupants.map((ocupant) => (
            <TableRow key={ocupant.id}>
              <TableCell>{ocupant.name}</TableCell>
              <TableCell>
                <Avatar onClick={() => setSelectedKtp(ocupant)} className="h-16 w-24 rounded-md">
                  <AvatarImage
                    src={ocupant.identity_card}
                    alt={`KTP ${ocupant.name}`}
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-md">No KTP</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{ocupant.phone}</TableCell>
              <TableCell>{ocupant.status}</TableCell>
              <TableCell className="flex items-center gap-2">
                <Button variant="outline" onClick={() => onEdit(ocupant)}>
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
    <KtpDialog
        open={!!selectedKtp}
        onOpenChange={(open) => !open && setSelectedKtp(null)}
        imageUrl={selectedKtp?.identity_card}
        name={selectedKtp?.name}
      />
    </>
  );
};

export default OcupantTable;
