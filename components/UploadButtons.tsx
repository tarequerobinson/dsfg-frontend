"use client"

import * as React from "react"
import { UploadCloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface UploadButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  buttonText?: string
  uploading?: boolean
  className?: string
  buttonClassName?: string
}

export function UploadButton({
  onChange,
  buttonText = "Upload file",
  uploading = false,
  className,
  buttonClassName,
  ...props
}: UploadButtonProps) {
  const [fileName, setFileName] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      setFileName(files[0].name)
    }
    if (onChange) {
      onChange(event)
    }
  }

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <Button type="button" onClick={handleClick} disabled={uploading} className={cn("relative", buttonClassName)}>
        <UploadCloud className="mr-2 h-4 w-4" />
        {uploading ? "Uploading..." : buttonText}
      </Button>
      {fileName && <p className="text-sm text-muted-foreground">{fileName}</p>}
      <input type="file" className="sr-only" ref={inputRef} onChange={handleChange} disabled={uploading} {...props} />
    </div>
  )
}

