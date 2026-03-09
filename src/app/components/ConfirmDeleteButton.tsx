// components/ConfirmDeleteButton.tsx
import { ReactNode } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface ConfirmDeleteButtonProps {
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  className?: string;
  variant?: "ghost" | "outline" | "destructive";
  size?: "sm" | "default" | "lg" | "icon";
  iconOnly?: boolean;
  children?: ReactNode;
}

export function ConfirmDeleteButton({
  onConfirm,
  title = "Delete item?",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  className,
  variant = "ghost",
  size = "sm",
  iconOnly = false,
  children,
}: ConfirmDeleteButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children ? (
          <span>{children}</span>
        ) : (
          <Button
            variant={variant}
            size={size}
            className={className}
            onClick={(e) => e.stopPropagation()}
          >
            <Trash2 size={16} strokeWidth={1.8} />
            {!iconOnly && <span className="ml-1">Delete</span>}
          </Button>
        )}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}