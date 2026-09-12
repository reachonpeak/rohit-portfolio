import * as React from 'react';
import { cn } from '@/lib/utils';
type Props = React.ComponentProps<'button'> & { variant?: 'ghost'; size?: 'icon-lg' };
export function Button({className, variant, size, ...props}: Props) { return <button data-slot="button" className={cn('inline-flex size-10 items-center justify-center cursor-pointer transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white',className)} {...props} />; }
