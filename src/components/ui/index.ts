/**
 * UI Components Library
 *
 * Cartoon-themed components styled with black-and-white paper aesthetic.
 * All components are built with accessibility in mind and use Radix UI primitives where applicable.
 *
 * @module components/ui
 */

export { Button } from './Button';
export type { ButtonProps } from './Button';

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './Card';
export type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
} from './Card';

export { Input, Textarea, Select } from './Input';
export type { InputProps, TextareaProps, SelectProps } from './Input';

export { Badge } from './Badge';
export type { BadgeProps } from './Badge';

export { Spinner, LoadingOverlay } from './Spinner';
export type { SpinnerProps, LoadingOverlayProps } from './Spinner';

export { Alert } from './Alert';
export type { AlertProps } from './Alert';

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from './Dialog';

export { Separator } from './Separator';
export type { SeparatorProps } from './Separator';

export { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';

export { Modal, ConfirmModal, InfoModal } from './Modal';
