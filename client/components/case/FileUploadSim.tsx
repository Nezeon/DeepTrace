import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';

interface FileUploadSimProps {
  files: File[];
  onComplete: () => void;
}

export default function FileUploadSim({ files, onComplete }: FileUploadSimProps) {
  const [progress, setProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    if (files.length === 0) {
      onComplete();
      return;
    }

    const newProgress = files.reduce((acc, file) => ({ ...acc, [file.name]: 0 }), {});
    setProgress(newProgress);

    const timers = files.map(file => {
      const interval = setInterval(() => {
        setProgress(prev => {
          const currentProgress = prev[file.name] || 0;
          if (currentProgress >= 100) {
            clearInterval(interval);
            return prev;
          }
          const nextProgress = currentProgress + Math.random() * 10;
          return { ...prev, [file.name]: Math.min(nextProgress, 100) };
        });
      }, 100 + Math.random() * 80);
      return interval;
    });

    return () => {
      timers.forEach(timer => clearInterval(timer));
    };
  }, [files]);

  useEffect(() => {
    const allComplete = Object.values(progress).every(p => p === 100);
    if (allComplete && files.length > 0) {
      onComplete();
    }
  }, [progress, files, onComplete]);

  return (
    <div className="space-y-2">
      {files.map(file => (
        <div key={file.name}>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{file.name}</span>
            <span>{Math.round(progress[file.name] || 0)}%</span>
          </div>
          <Progress value={progress[file.name] || 0} className="h-2 mt-1" />
        </div>
      ))}
    </div>
  );
}
