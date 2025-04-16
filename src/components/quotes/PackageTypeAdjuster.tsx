
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PackageType } from '@/hooks/usePackageTypes';
import { Settings2 } from 'lucide-react';

interface PackageTypeAdjusterProps {
  packageType: PackageType;
  onUpdate: (id: number, updates: Partial<PackageType>) => Promise<any>;
}

export function PackageTypeAdjuster({ packageType, onUpdate }: PackageTypeAdjusterProps) {
  const [open, setOpen] = useState(false);
  const [weight, setWeight] = useState(packageType.weight.toString());
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      const parsedWeight = parseFloat(weight);
      if (isNaN(parsedWeight) || parsedWeight <= 0) {
        throw new Error('O peso deve ser um número positivo');
      }
      
      await onUpdate(packageType.id, { weight: parsedWeight });
      setOpen(false);
    } catch (error) {
      console.error('Error updating package type:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-7 w-7 text-primary-500 hover:text-primary-600 hover:bg-primary-50 absolute right-2 top-2"
          title="Ajustar peso"
        >
          <Settings2 size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajustar Embalagem</DialogTitle>
          <DialogDescription>
            Você pode personalizar o peso desta embalagem pré-definida.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="length">Comprimento (cm)</Label>
              <Input id="length" value={packageType.length} disabled />
            </div>
            <div>
              <Label htmlFor="width">Largura (cm)</Label>
              <Input id="width" value={packageType.width} disabled />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="height">Altura (cm)</Label>
              <Input id="height" value={packageType.height} disabled />
            </div>
            <div>
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input 
                id="weight" 
                type="number" 
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                step="0.1"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleUpdate} disabled={isUpdating}>
            {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
