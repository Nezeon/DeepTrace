import { useState } from "react";
import FileUploadSim from "./FileUploadSim";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ForensicCase } from "@shared/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCaseCreate: (newCase: ForensicCase) => void;
}

export default function NewCasePanel({ isOpen, onClose, onCaseCreate }: Props) {
  const [caseNo, setCaseNo] = useState("");
  const [officer, setOfficer] = useState("");
  const [ipcFir, setIpcFir] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!caseNo) newErrors.caseNo = "Case no. is required";
    if (!officer) newErrors.officer = "Officer name is required";
    if (!title) newErrors.title = "Title is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateCase = () => {
    const newCase: ForensicCase = {
      id: `case-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      caseNo,
      officer,
      ipcFir,
      title,
      description,
      files: files.map(f => ({ name: f.name, size: f.size, status: 'simulated' })),
      createdAt: new Date().toISOString(),
      status: "Open",
    };
    onCaseCreate(newCase);
    onClose();
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (files.length > 0) {
      setIsUploading(true);
    } else {
      handleCreateCase();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Create New Case</SheetTitle>
          <SheetDescription>Fill in the details to create a new forensic case.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="caseNo" className="text-right">Case No.</Label>
            <Input id="caseNo" value={caseNo} onChange={(e) => setCaseNo(e.target.value)} className="col-span-3" />
            {errors.caseNo && <p className="col-span-4 text-red-500 text-xs text-right">{errors.caseNo}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="officer" className="text-right">Officer</Label>
            <Input id="officer" value={officer} onChange={(e) => setOfficer(e.target.value)} className="col-span-3" />
            {errors.officer && <p className="col-span-4 text-red-500 text-xs text-right">{errors.officer}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ipcFir" className="text-right">IPC/FIR No.</Label>
            <Input id="ipcFir" value={ipcFir} onChange={(e) => setIpcFir(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
            {errors.title && <p className="col-span-4 text-red-500 text-xs text-right">{errors.title}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="files" className="text-right">UFDR Files</Label>
            <Input id="files" type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} className="col-span-3" disabled={isUploading} />
          </div>
          {isUploading && (
            <div className="col-span-4">
              <FileUploadSim files={files} onComplete={handleCreateCase} />
            </div>
          )}
        </div>
        <SheetFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isUploading}>Create Case</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
