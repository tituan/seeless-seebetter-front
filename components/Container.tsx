import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  maxWidth?: number;
};

export default function Container({ children, className, maxWidth = 1200 }: Props) {
  return (
    <div
      className={className}
      style={{
        maxWidth,
        margin: '0 auto',
        padding: '0 20px',
      }}
    >
      {children}
    </div>
  );
}